'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'
import { useAuth } from '@/lib/auth/client'
import { calcStorageCost } from '@/lib/creem/plans'

const planSeeds = [
  { key: 'free', price: 0, highlight: false, featureOn: [true, true, true, true, true, true, false, false] },
  { key: 'pro', price: 2.49, highlight: true, featureOn: [true, true, true, true, true, true, true, true] },
]

function Check({ on }) {
  return (
    <span className={`inline-flex w-5 h-5 rounded-full items-center justify-center flex-shrink-0 ${on ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-300'}`}>
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function Pricing() {
  const { t } = useI18n()
  const { isAuthenticated } = useAuth()
  const [storageGB, setStorageGB] = useState(5)

  const getPlanHref = (planKey) => {
    if (planKey === 'free') return '/create-package'
    if (planKey === 'pro') return '/checkout?planId=pro_monthly'
    return '#'
  }

  const plans = planSeeds.map((p) => ({
    ...p,
    name: t(`pricing.plans.${p.key}.name`),
    tagline: t(`pricing.plans.${p.key}.tagline`),
    unit: t(`pricing.plans.${p.key}.unit`),
    cta: t(`pricing.plans.${p.key}.cta`),
    sub: p.key === 'free' ? t('pricing.plans.free.permanent') : t(`pricing.plans.${p.key}.sub`),
    features: t(`pricing.features.${p.key}`).map((text, i) => ({ text, on: p.featureOn[i] })),
  }))

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-[40px] sm:text-[44px] font-semibold text-gray-900 tracking-tight">{t('pricing.title')}</h1>
          <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto">{t('pricing.subtitle')}</p>
        </div>

        {/* 套餐卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-white rounded-apple-lg border p-6 transition-all duration-500 ease-apple ${
                plan.highlight
                  ? 'border-primary-500 shadow-apple-lg ring-1 ring-primary-500/20'
                  : 'border-gray-200/70 shadow-apple-sm'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-[11px] font-semibold rounded-full shadow-apple-blue">
                  {t('pricing.popular')}
                </span>
              )}
              <div className="mb-5">
                <h3 className="text-[17px] font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-[12px] text-gray-400 mt-1">{plan.tagline}</p>
              </div>
              <div className="flex items-end gap-1 mb-1 min-h-[48px]">
                {plan.price !== null ? (
                  <>
                    <span className="text-[12px] text-gray-400 mb-1.5">$</span>
                    <span className="text-[36px] font-semibold text-gray-900 tracking-tight leading-none">{plan.price}</span>
                    <span className="text-[12px] text-gray-400 mb-1.5 ml-0.5">{plan.unit}</span>
                  </>
                ) : (
                  <span className="text-[20px] font-semibold text-gray-700">{plan.unit}</span>
                )}
              </div>
              <p className="text-[12px] text-gray-400 mb-5 min-h-[18px]">
                {plan.sub}
              </p>
              {(() => {
                const href = getPlanHref(plan.key)
                const needsAuth = plan.key === 'pro'
                const finalHref = needsAuth && !isAuthenticated
                  ? `/auth?callbackUrl=${encodeURIComponent(href)}`
                  : href
                return (
                  <Link
                    href={finalHref}
                    className={`block w-full py-2.5 text-center text-[13px] font-semibold rounded-full transition-all duration-300 ease-apple ${
                      plan.highlight
                        ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-apple-blue hover:shadow-lg hover:-translate-y-0.5'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )
              })()}
              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2.5">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check on={f.on} />
                    <span className={`text-[12px] ${f.on ? 'text-gray-700' : 'text-gray-400 line-through'}`}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 储存空间订阅 */}
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm p-7 mb-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 bg-primary-50 text-primary-600 text-[11px] font-semibold rounded-full">{t('pricing.storage.badge')}</span>
                <h2 className="text-[18px] font-semibold text-gray-900">{t('pricing.storage.title')}</h2>
              </div>
              <p className="text-[13px] text-gray-500">{t('pricing.storage.desc')}</p>
              {isAuthenticated && (
                <Link
                  href="/dashboard/storage"
                  className="inline-flex items-center gap-1 mt-2 text-[13px] text-primary-600 hover:text-primary-700 font-medium"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t('pricing.storage.manageBtn')}
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStorageGB(Math.max(1, storageGB - 1))}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
                <div className="text-center min-w-[80px]">
                  <div className="text-[24px] font-semibold text-gray-900 leading-none">{storageGB} <span className="text-[13px] text-gray-400 font-normal">GB</span></div>
                  <div className="text-[11px] text-gray-400 mt-1">{t('pricing.storage.unit')}</div>
                </div>
                <button
                  onClick={() => setStorageGB(storageGB + 1)}
                  className="w-9 h-9 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-600 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="text-center">
                <div className="text-[20px] font-semibold text-gray-900">${calcStorageCost(storageGB).toFixed(2)}</div>
                <div className="text-[11px] text-gray-400">{t('storageManagement.monthly')}</div>
              </div>
              <Link
                href={isAuthenticated ? `/checkout?planId=storage&gb=${storageGB}` : `/auth?callbackUrl=${encodeURIComponent(`/checkout?planId=storage&gb=${storageGB}`)}`}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold rounded-full shadow-apple-blue hover:shadow-lg transition-all duration-300 ease-apple whitespace-nowrap"
              >
                {t('pricing.storage.buyBtn')}
              </Link>
            </div>
          </div>
        </div>

        {/* 对比表格 */}
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-[16px] font-semibold text-gray-900">{t('pricing.comparison.title')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/60">
                  {t('pricing.comparison.headers').map((h, i) => (
                    <th key={i} className={`px-4 py-3.5 ${i === 0 ? 'text-left' : 'text-center'} text-[12px] font-semibold ${i === 2 ? 'text-primary-600' : 'text-gray-500'} whitespace-nowrap`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {t('pricing.comparison.rows').map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-4 py-3 text-[13px] font-medium text-gray-700 whitespace-nowrap">{row.label}</td>
                    {row.v.map((val, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        {typeof val === 'boolean' ? (
                          <span className={`inline-flex w-5 h-5 rounded-full items-center justify-center ${val ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-300'}`}>
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>
                        ) : (
                          <span className="text-[13px] text-gray-700">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-8">{t('pricing.footnote')}</p>
      </div>
    </div>
  )
}
