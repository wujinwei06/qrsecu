/**
 * Creem Webhook 处理器
 *
 * POST /api/payment/webhook
 *
 * 处理 Creem 推送的事件通知：
 * 1. 读取原始请求体并验证签名（确保请求来自 Creem 且未被篡改）
 * 2. 解析事件类型并分发处理
 * 3. 对 checkout.completed / subscription.paid 事件更新用户套餐状态
 * 4. 始终返回 200，避免 Creem 重试
 *
 * 请求头：
 *   - creem-signature  HMAC-SHA256 签名（使用 Webhook Secret）
 */

import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/creem/server'

// 使用 Node.js 运行时（验签依赖 node:crypto）
export const runtime = 'nodejs'
// 动态渲染，避免被静态缓存
export const dynamic = 'force-dynamic'

/** Creem 事件结构 */
interface CreemEvent {
  /** 事件 ID */
  id?: string
  /** 事件类型，如 checkout.completed、subscription.paid */
  eventType?: string
  /** 创建时间戳 */
  created_at?: number
  /** 事件数据对象 */
  object?: Record<string, unknown>
}

/** 从 metadata 或 request_id 中解析套餐 ID */
function parsePlanId(event: CreemEvent): string | null {
  // 优先从 metadata 中获取
  const obj = event.object || {}
  const metadata = (obj.metadata || obj.subscription?.metadata) as
    | Record<string, unknown>
    | undefined
  if (metadata?.planId && typeof metadata.planId === 'string') {
    return metadata.planId
  }

  // 从 request_id 中解析（格式：qrsecu_{planId}_{timestamp}）
  const requestId = obj.request_id as string | undefined
  if (typeof requestId === 'string') {
    const parts = requestId.split('_')
    if (parts.length < 3 || parts[0] !== 'qrsecu') return null
    return parts.slice(1, -1).join('_') || null
  }

  return null
}

export async function POST(request: Request) {
  // 1. 读取原始请求体（验签需要未经修改的原始字符串）
  const rawBody = await request.text()

  // 2. 获取签名请求头
  const signature = request.headers.get('creem-signature') || ''

  // 3. 验证签名
  const isValid = verifyWebhookSignature(rawBody, signature)
  if (!isValid) {
    return NextResponse.json(
      { error: '签名验证失败' },
      { status: 401 }
    )
  }

  // 4. 解析事件
  let event: CreemEvent
  try {
    event = JSON.parse(rawBody) as CreemEvent
  } catch {
    return NextResponse.json(
      { error: '请求体非合法 JSON' },
      { status: 400 }
    )
  }

  const eventType = event.eventType || ''

  // 5. 按事件类型分发处理
  switch (eventType) {
    case 'checkout.completed': {
      const obj = event.object || {}
      const checkoutId = (obj.id as string) || ''
      const customer = obj.customer as { email?: string; id?: string } | undefined
      const planId = parsePlanId(event)

      console.log('[Creem Webhook] 结账完成:', {
        checkoutId,
        customerEmail: customer?.email,
        planId,
      })

      // TODO: 更新数据库中的用户套餐状态
      //   await db.prepare(
      //     'UPDATE users SET plan = ?, plan_expires_at = ? WHERE email = ?'
      //   ).bind(planId, expiresAt, customerEmail).run()

      break
    }
    case 'subscription.paid': {
      const obj = event.object || {}
      const subscriptionId = (obj.id as string) || ''
      const customer = obj.customer as { email?: string; id?: string } | undefined
      const planId = parsePlanId(event)
      const nextTransactionDate = obj.next_transaction_date as string | undefined

      console.log('[Creem Webhook] 订阅付款成功:', {
        subscriptionId,
        customerEmail: customer?.email,
        planId,
        nextTransactionDate,
      })

      // TODO: 更新用户套餐状态，延长到期时间
      break
    }
    case 'subscription.canceled':
    case 'subscription.expired': {
      const obj = event.object || {}
      const subscriptionId = (obj.id as string) || ''
      const customer = obj.customer as { email?: string; id?: string } | undefined

      console.warn('[Creem Webhook] 订阅取消/过期:', {
        subscriptionId,
        eventType,
        customerEmail: customer?.email,
      })

      // TODO: 撤销用户的专业版权限
      break
    }
    case 'subscription.past_due': {
      console.warn('[Creem Webhook] 订阅付款失败:', {
        subscriptionId: event.object?.id,
      })
      // TODO: 发送提醒邮件或宽限处理
      break
    }
    case 'refund.created': {
      const obj = event.object || {}
      console.log('[Creem Webhook] 退款已发出:', {
        orderId: obj.id,
      })
      // TODO: 撤销用户权限
      break
    }
    default:
      console.log('[Creem Webhook] 未处理的事件类型:', eventType)
  }

  // 6. 返回 200 确认收到（避免 Creem 重试推送）
  return NextResponse.json({ received: true })
}
