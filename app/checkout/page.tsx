'use client'

/**
 * 结账页面
 *
 * 从 URL 参数获取 planId 和可选的 gb（储存 GB 数），
 * 展示套餐/储存信息与价格，点击「支付」按钮调用
 * /api/payment/create-intent 创建 Creem 结账会话，
 * 获取到 checkoutUrl 后跳转 Creem 托管支付页完成收款。
 *
 * 支持：
 * - planId=pro_monthly：专业版月度订阅
 * - planId=storage&gb=N：储存空间 N GB 按月订阅
 */

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n/LanguageContext'
import { getPlanById, calcStorageCost } from '@/lib/creem/plans'

function CheckoutContent() {
  const { t, lang } = useI18n()
  const searchParams = useSearchParams()
  const planId = searchParams?.get('planId') || ''
  const gbParam = searchParams?.get('gb')
  const gb = gbParam ? parseInt(gbParam, 10) || 1 : 1

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ui =
    lang === 'zh'
      ? {
          title: '确认订单',
          subtitle: '请确认你的订单信息后进行支付',
          planLabel: '套餐',
          storageLabel: '储存容量',
          amountLabel: '订单金额',
          secureHint: '支付将通过 Creem 安全处理，支持信用卡、PayPal、Apple Pay',
          payBtn: '支付',
          redirecting: '正在跳转支付…',
          invalidPlan: '未选择有效套餐',
          invalidPlanHint: '请返回定价页选择一个套餐',
          backPricing: '返回定价页',
          needLogin: '请先登录后再进行支付',
          monthly: '/ 月',
          gbUnit: 'GB',
          storageName: '储存空间',
          perGB: '$0.9 / GB / 月',
        }
      : {
          title: 'Confirm Order',
          subtitle: 'Review your order and proceed to payment',
          planLabel: 'Plan',
          storageLabel: 'Storage',
          amountLabel: 'Amount',
          secureHint: 'Payment is securely processed by Creem (credit card, PayPal, Apple Pay)',
          payBtn: 'Pay',
          redirecting: 'Redirecting to payment…',
          invalidPlan: 'No valid plan selected',
          invalidPlanHint: 'Please go back and choose a plan',
          backPricing: 'Back to pricing',
          needLogin: 'Please sign in before payment',
          monthly: '/ mo',
          gbUnit: 'GB',
          storageName: 'Storage',
          perGB: '$0.9 / GB / mo',
        }

  const plan = planId ? getPlanById(planId) : undefined

  // 储存订阅的展示信息
  const isStorage = plan?.isStorage === true
  const displayName = isStorage ? ui.storageName : (plan?.name || '')
  const displayPrice = isStorage ? calcStorageCost(gb) : (plan?.price ?? 0)
  const displayUnit = isStorage ? ui.monthly : (lang === 'zh' ? '/ 月' : '/ mo')
  const displayDetail = isStorage ? `${gb} ${ui.gbUnit} × $0.9` : ''
  const i18nPlanKey = planId === 'pro_monthly' ? 'pro' : planId

  /** 点击支付 */
  const handlePay = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, gb: isStorage ? gb : undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(ui.needLogin)
        }
        throw new Error(data.error || '创建支付失败')
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('未收到支付链接')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '支付发起失败，请稍后重试')
      setLoading(false)
    }
  }

  // 无效套餐
  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[15px] font-semibold text-gray-900 mb-1">{ui.invalidPlan}</p>
          <p className="text-[13px] text-gray-400 mb-5">{ui.invalidPlanHint}</p>
          <Link href="/pricing" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold rounded-full shadow-apple-blue transition-all duration-300 ease-apple">
            {ui.backPricing}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-md p-8">
          <h1 className="text-[24px] font-semibold text-gray-900 tracking-tight mb-1">{ui.title}</h1>
          <p className="text-[13px] text-gray-400 mb-6">{ui.subtitle}</p>

          {/* 订单信息卡片 */}
          <div className="rounded-apple border border-gray-200/70 bg-gray-50/60 p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-gray-500">{isStorage ? ui.storageLabel : ui.planLabel}</span>
              <span className="text-[15px] font-semibold text-gray-900">{displayName}</span>
            </div>
            {isStorage && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-gray-500">{ui.storageLabel}</span>
                <span className="text-[15px] font-semibold text-gray-900">{gb} {ui.gbUnit}</span>
              </div>
            )}
            <div className="flex items-end gap-1 mb-3 min-h-[40px]">
              <span className="text-[14px] text-gray-400 mb-1.5">$</span>
              <span className="text-[32px] font-semibold text-gray-900 tracking-tight leading-none">{displayPrice.toFixed(2)}</span>
              <span className="text-[13px] text-gray-400 mb-1.5 ml-0.5">{displayUnit}</span>
            </div>
            {isStorage && (
              <p className="text-[12px] text-gray-500">{displayDetail} · {ui.perGB}</p>
            )}
          </div>

          {/* 安全提示 */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-primary-50/60 border border-primary-200/50 rounded-apple mb-6">
            <svg className="w-5 h-5 text-primary-600 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[12px] text-primary-700 font-medium">{ui.secureHint}</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-apple mb-6">
              <svg className="w-5 h-5 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-[12px] text-rose-600 font-medium">{error}</p>
            </div>
          )}

          {/* 支付按钮 */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white text-[15px] font-semibold rounded-full shadow-apple-blue hover:shadow-lg transition-all duration-300 ease-apple disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {ui.redirecting}
              </>
            ) : (
              <>{ui.payBtn} ${displayPrice.toFixed(2)}</>
            )}
          </button>

          {/* 返回定价页 */}
          <div className="mt-6 text-center">
            <Link href="/pricing" className="inline-flex items-center gap-1 text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {ui.backPricing}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <CheckoutContent />
    </Suspense>
  )
}
