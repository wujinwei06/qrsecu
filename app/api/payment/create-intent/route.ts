/**
 * 创建结账会话 API
 *
 * POST /api/payment/create-intent
 * 请求体：{ planId: string, gb?: number }
 * 响应体：{ checkoutUrl, checkoutId }
 *
 * 支持两种购买类型：
 * 1. 套餐订阅（planId='pro_monthly'）— 直接使用 Creem 产品 ID
 * 2. 储存空间订阅（planId='storage'，gb=N）— 传入 N 个单位的储存产品
 *
 * 流程：
 * 1. 校验用户已登录
 * 2. 根据 planId 查找套餐
 * 3. 对于储存订阅，使用 gb 参数作为 units（席位数）
 * 4. 调用 Creem API 创建结账会话
 * 5. 返回 checkout_url
 */

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getPlanById, calcStorageCost } from '@/lib/creem/plans'
import { createCheckout } from '@/lib/creem/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface CreateCheckoutBody {
  planId?: string
  gb?: number
}

export async function POST(request: Request) {
  // 1. 校验用户已认证
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: '未登录，请先登录后再进行支付' },
      { status: 401 }
    )
  }

  // 2. 解析请求体
  let body: CreateCheckoutBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: '请求体格式错误，需要合法 JSON' },
      { status: 400 }
    )
  }

  const { planId, gb } = body
  if (!planId) {
    return NextResponse.json(
      { error: '缺少 planId 参数' },
      { status: 400 }
    )
  }

  // 3. 查找套餐
  const plan = getPlanById(planId)
  if (!plan) {
    return NextResponse.json({ error: '套餐不存在' }, { status: 404 })
  }
  if (!plan.creemProductId) {
    return NextResponse.json(
      { error: '该套餐无法购买' },
      { status: 400 }
    )
  }

  // 4. 构建支付成功跳转 URL
  const origin = request.headers.get('origin') || 'http://localhost:3000'
  const successUrl = `${origin}/checkout/success`

  // 5. 构建 metadata
  const metadata: Record<string, string> = {
    userId: session.user.id,
    email: session.user.email,
    planId,
  }

  // 6. 处理储存订阅 — 传入 units 作为 GB 数量
  let units: number | undefined
  if (plan.isStorage) {
    const gbNum = typeof gb === 'number' && gb > 0 ? Math.floor(gb) : 1
    metadata.gb = String(gbNum)
    metadata.storageCost = String(calcStorageCost(gbNum))
    units = gbNum
  }

  try {
    // 7. 创建 Creem 结账会话
    const checkout = await createCheckout({
      productId: plan.creemProductId,
      requestId: `qrsecu_${planId}_${Date.now()}`,
      successUrl,
      units,
      customer: {
        email: session.user.email,
        name: session.user.name || undefined,
      },
      metadata,
    })

    // 8. 返回前端所需信息
    return NextResponse.json({
      checkoutUrl: checkout.checkout_url,
      checkoutId: checkout.id,
    })
  } catch (err) {
    console.error('创建结账会话失败:', err)
    return NextResponse.json(
      { error: '创建支付失败，请稍后重试' },
      { status: 500 }
    )
  }
}
