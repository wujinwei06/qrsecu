'use client'

/**
 * 支付成功页
 *
 * 用户在 Creem 托管支付页完成支付后跳转至此页面，
 * 展示支付成功消息，并提供返回首页与「我的包裹」的链接。
 */

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'

export default function SuccessPage() {
  const { lang } = useI18n()

  const ui =
    lang === 'zh'
      ? {
          title: '支付成功',
          subtitle: '感谢你的购买！你的套餐已成功激活，现在可以尽情使用全部功能。',
          goHome: '返回首页',
          goPackages: '我的包裹',
          tip: '如需发票或有任何疑问，请随时联系客服。',
        }
      : {
          title: 'Payment Successful',
          subtitle: 'Thank you for your purchase! Your plan is now active — enjoy all the features.',
          goHome: 'Back to Home',
          goPackages: 'My Packages',
          tip: 'Need an invoice or have questions? Feel free to contact support.',
        }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-md p-8 text-center">
          {/* 成功图标 */}
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 标题 */}
          <h1 className="text-[24px] font-semibold text-gray-900 tracking-tight mb-2">
            {ui.title}
          </h1>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
            {ui.subtitle}
          </p>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-3">
            <Link
              href="/packages"
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white text-[15px] font-semibold rounded-full shadow-apple-blue hover:shadow-lg transition-all duration-300 ease-apple flex items-center justify-center gap-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {ui.goPackages}
            </Link>
            <Link
              href="/"
              className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-900 text-[15px] font-semibold rounded-full transition-all duration-300 ease-apple flex items-center justify-center"
            >
              {ui.goHome}
            </Link>
          </div>

          {/* 提示 */}
          <p className="text-[12px] text-gray-400 mt-6">{ui.tip}</p>
        </div>
      </div>
    </div>
  )
}
