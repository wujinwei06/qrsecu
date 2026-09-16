'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'
import { useAuth } from '@/lib/auth/client'
import { calcStorageCost } from '@/lib/creem/plans'

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface Subscription {
  id: string
  gb: number
  status: 'active' | 'canceled' | 'pending'
  nextBilling: string
  monthlyCost: number
}

interface HistoryEntry {
  id: string
  date: string
  type: 'add' | 'remove'
  gb: number
  cost: number
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const mockSubscriptions: Subscription[] = [
  { id: 'sub_001', gb: 5, status: 'active', nextBilling: '2026-10-01', monthlyCost: 4.5 },
  { id: 'sub_002', gb: 3, status: 'active', nextBilling: '2026-10-01', monthlyCost: 2.7 },
]

const mockHistory: HistoryEntry[] = [
  { id: 'h1', date: '2026-09-01', type: 'add', gb: 5, cost: 4.5 },
  { id: 'h2', date: '2026-08-15', type: 'add', gb: 3, cost: 2.7 },
  { id: 'h3', date: '2026-07-20', type: 'remove', gb: 2, cost: 1.8 },
  { id: 'h4', date: '2026-06-01', type: 'add', gb: 2, cost: 1.8 },
]

const BASE_STORAGE_GB = 1 // 专业版基础储存
const USED_STORAGE_GB = 3.8

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr)
  if (lang === 'zh') {
    return `${d.getFullYear()}\u5E74${d.getMonth() + 1}\u6708${d.getDate()}\u65E5`
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const STATUS_STYLES: Record<Subscription['status'], string> = {
  active: 'bg-emerald-50 text-emerald-600',
  canceled: 'bg-gray-100 text-gray-500',
  pending: 'bg-amber-50 text-amber-600',
}

const STATUS_DOT: Record<Subscription['status'], string> = {
  active: 'bg-emerald-500',
  canceled: 'bg-gray-400',
  pending: 'bg-amber-500',
}

/* ------------------------------------------------------------------ */
/*  Stat pill                                                         */
/* ------------------------------------------------------------------ */

function StatPill({
  label,
  value,
  unit,
  note,
  accent,
}: {
  label: string
  value: string | number
  unit?: string
  note?: string
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] text-gray-400 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-[20px] font-semibold tracking-tight ${accent ? 'text-primary-600' : 'text-gray-900'}`}>
          {value}
          {unit && <span className="text-[13px] text-gray-400 font-normal ml-0.5">{unit}</span>}
        </span>
        {note && (
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-medium">
            {note}
          </span>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function StorageManagement() {
  const { t, lang } = useI18n()
  const { isAuthenticated } = useAuth()

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [history] = useState<HistoryEntry[]>(mockHistory)
  const [addGB, setAddGB] = useState(5)
  const [toast, setToast] = useState<{ message: string } | null>(null)

  /* auto-dismiss toast --------------------------------------------- */
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  /* derived values ------------------------------------------------- */
  const activeSubs = subscriptions.filter((s) => s.status === 'active')
  const subscribedGB = activeSubs.reduce((sum, s) => sum + s.gb, 0)
  const totalGB = BASE_STORAGE_GB + subscribedGB
  const remainingGB = Math.max(0, totalGB - USED_STORAGE_GB)
  const usedPct = Math.min(100, Math.round((USED_STORAGE_GB / totalGB) * 100))
  const totalMonthlyCost = activeSubs.reduce((sum, s) => sum + s.monthlyCost, 0)
  const addCost = calcStorageCost(addGB)

  /* handlers ------------------------------------------------------- */
  const checkoutHref = isAuthenticated
    ? `/checkout?planId=storage&gb=${addGB}`
    : `/auth?callbackUrl=${encodeURIComponent(`/checkout?planId=storage&gb=${addGB}`)}`

  const handleCancel = (sub: Subscription) => {
    const msg = String(t('storageManagement.cancelConfirm')).replace('{gb}', String(sub.gb))
    if (window.confirm(msg)) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: 'canceled' as const } : s)),
      )
      setToast({ message: t('storageManagement.cancelSuccess') })
    }
  }

  const handleProceed = () => {
    setToast({ message: t('storageManagement.addSuccess') })
    setTimeout(() => {
      window.location.href = checkoutHref
    }, 1500)
  }

  const isProPlan = true // mock: 专业版

  const statusLabel = (s: Subscription['status']) => {
    if (s === 'active') return t('storageManagement.statusActive')
    if (s === 'canceled') return t('storageManagement.statusCanceled')
    return t('storageManagement.statusPending')
  }

  /* --------------------------------------------------------------- */
  /*  Render                                                         */
  /* --------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Toast ─────────────────────────────────────────────── */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-white shadow-apple-md text-[13px] font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {toast.message}
            </div>
          </div>
        )}

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">
              {t('storageManagement.title')}
            </h1>
            <p className="text-[14px] text-gray-500 mt-1">{t('storageManagement.subtitle')}</p>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-apple whitespace-nowrap self-start sm:self-auto"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('storageManagement.backToPackages')}
          </Link>
        </div>

        {/* ── Storage overview ──────────────────────────────────── */}
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm p-6 mb-6">
          {/* plan badge + subscription desc */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-400 font-medium">{t('storageManagement.currentPlan')}</span>
              <span className="inline-flex items-center px-2.5 py-1 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-[12px] font-semibold">
                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                {isProPlan ? t('storageManagement.planPro') : t('storageManagement.planFree')}
              </span>
            </div>
            <p className="text-[12px] text-gray-400">{t('storageManagement.subscriptionDesc')}</p>
          </div>

          {/* progress bar */}
          <div className="mb-6">
            <div className="flex items-end justify-between mb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-semibold text-gray-900 tracking-tight leading-none">
                  {USED_STORAGE_GB}
                </span>
                <span className="text-[14px] text-gray-400">
                  {t('storageManagement.of')} {totalGB} {t('storageManagement.gb')}
                </span>
              </div>
              <span className="text-[13px] font-medium text-gray-500">{usedPct}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-apple"
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="text-[12px] text-gray-400 mt-2">
              {t('storageManagement.remaining')} {remainingGB.toFixed(1)} {t('storageManagement.gb')}
            </p>
          </div>

          {/* stat pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-gray-100">
            <StatPill
              label={t('storageManagement.baseStorage')}
              value={`${BASE_STORAGE_GB} ${t('storageManagement.gb')}`}
              note={t('storageManagement.free')}
              accent
            />
            <StatPill
              label={t('storageManagement.subscribedStorage')}
              value={subscribedGB}
              unit={t('storageManagement.gb')}
            />
            <StatPill
              label={t('storageManagement.totalStorage')}
              value={totalGB}
              unit={t('storageManagement.gb')}
              accent
            />
            <StatPill
              label={t('storageManagement.usedStorage')}
              value={USED_STORAGE_GB}
              unit={t('storageManagement.gb')}
            />
          </div>
        </div>

        {/* ── Two-column: subscriptions + add storage ────────────── */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[16px] font-semibold text-gray-900">{t('storageManagement.subscription')}</h2>
          <span className="text-[12px] text-gray-400">{t('storageManagement.subscriptionDesc')}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ── Current subscriptions (col-span-2) ──────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm h-full">
              {/* card header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">
                    {t('storageManagement.currentSubscription')}
                  </h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    {t('storageManagement.removeStorage')} · {t('storageManagement.unitPrice')}
                  </p>
                </div>
                {activeSubs.length > 0 && (
                  <span className="text-[13px] font-semibold text-gray-900">
                    ${totalMonthlyCost.toFixed(2)}
                    <span className="text-[12px] text-gray-400 font-normal ml-0.5">
                      {t('storageManagement.monthly')}
                    </span>
                  </span>
                )}
              </div>

              {/* subscription list / empty state */}
              {activeSubs.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p className="text-[14px] text-gray-500 font-medium">{t('storageManagement.noSubscription')}</p>
                  <p className="text-[12px] text-gray-400 mt-1">{t('storageManagement.noSubscriptionHint')}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* column labels */}
                  <div className="flex items-center gap-4 px-6 py-2.5 bg-gray-50/40 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    <span className="flex-1">{t('storageManagement.currentSubscription')}</span>
                    <span className="hidden sm:inline">{t('storageManagement.status')}</span>
                    <span className="hidden md:inline">{t('storageManagement.nextBilling')}</span>
                    <span className="w-[72px] text-right">{t('storageManagement.actions')}</span>
                  </div>
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-5 hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* GB + cost */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-apple bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-primary-600" viewBox="0 0 24 24" fill="none">
                            <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[18px] font-semibold text-gray-900">
                              {sub.gb} <span className="text-[13px] text-gray-400 font-normal">{t('storageManagement.gb')}</span>
                            </span>
                            <span className="text-[12px] text-gray-300">|</span>
                            <span className="text-[14px] font-medium text-gray-700">
                              ${sub.monthlyCost.toFixed(2)}
                              <span className="text-[12px] text-gray-400 font-normal ml-0.5">
                                {t('storageManagement.monthly')}
                              </span>
                            </span>
                          </div>
                          <div className="text-[12px] text-gray-400 mt-0.5">
                            {t('storageManagement.monthlyCost')}: ${sub.monthlyCost.toFixed(2)} ·{' '}
                            {t('storageManagement.unitPrice')}
                          </div>
                        </div>
                      </div>

                      {/* status */}
                      <div className="flex items-center gap-2 sm:gap-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLES[sub.status]}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[sub.status]}`} />
                          {statusLabel(sub.status)}
                        </span>

                        {/* next billing */}
                        {sub.status === 'active' && (
                          <span className="text-[12px] text-gray-400 hidden md:inline-block whitespace-nowrap">
                            {t('storageManagement.nextBilling')}: {formatDate(sub.nextBilling, lang)}
                          </span>
                        )}

                        {/* cancel button */}
                        {sub.status === 'active' ? (
                          <button
                            onClick={() => handleCancel(sub)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors duration-300 whitespace-nowrap"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {t('storageManagement.removeBtn')}
                          </button>
                        ) : (
                          <span className="text-[12px] text-gray-300 inline-flex items-center w-[72px] justify-end">
                            —
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Add storage (col-span-1) ────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm p-6 h-full flex flex-col">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-gray-900">{t('storageManagement.buyStorage')}</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">{t('storageManagement.buyStorageHint')}</p>
              </div>

              {/* GB selector */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[13px] font-medium text-gray-500">{t('storageManagement.addStorage')}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAddGB((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="text-center min-w-[72px]">
                    <div className="text-[24px] font-semibold text-gray-900 leading-none">
                      {addGB}
                      <span className="text-[13px] text-gray-400 font-normal ml-0.5">
                        {t('storageManagement.gb')}
                      </span>
                    </div>
                    <div className="text-[10px] text-primary-600 font-medium mt-1">
                      {t('storageManagement.addBtn')}
                    </div>
                  </div>
                  <button
                    onClick={() => setAddGB((prev) => prev + 1)}
                    className="w-9 h-9 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-600 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* price breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-400">{t('storageManagement.unitPrice')}</span>
                  <span className="text-gray-700 font-medium">
                    {addGB} {t('storageManagement.gb')} × $0.9
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-gray-400">{t('storageManagement.monthlyCost')}</span>
                  <span className="text-gray-700 font-medium">{t('storageManagement.monthly')}</span>
                </div>
              </div>

              {/* total */}
              <div className="flex items-end justify-between mb-6">
                <span className="text-[14px] font-semibold text-gray-900">{t('storageManagement.total')}</span>
                <div className="text-right">
                  <div className="text-[28px] font-semibold text-gray-900 tracking-tight leading-none">
                    ${addCost.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">{t('storageManagement.monthly')}</div>
                </div>
              </div>

              {/* proceed button */}
              <button
                onClick={handleProceed}
                className="block w-full py-2.5 text-center bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-semibold rounded-full shadow-apple-blue hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-apple"
              >
                {t('storageManagement.proceed')}
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-3">
                {t('storageManagement.subscriptionDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Storage history table ──────────────────────────────── */}
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900">{t('storageManagement.storageHistory')}</h2>
          </div>

          {history.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[14px] text-gray-500 font-medium">{t('storageManagement.noHistory')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/60">
                    <th className="px-6 py-3.5 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">
                      {t('storageManagement.dateLabel')}
                    </th>
                    <th className="px-6 py-3.5 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">
                      {t('storageManagement.typeLabel')}
                    </th>
                    <th className="px-6 py-3.5 text-left text-[12px] font-semibold text-gray-500 whitespace-nowrap">
                      {t('storageManagement.amountLabel')}
                    </th>
                    <th className="px-6 py-3.5 text-right text-[12px] font-semibold text-gray-500 whitespace-nowrap">
                      {t('storageManagement.costLabel')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-3.5 text-[13px] text-gray-700 whitespace-nowrap">
                        {formatDate(entry.date, lang)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            entry.type === 'add'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-500'
                          }`}
                        >
                          {entry.type === 'add' ? (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                          )}
                          {entry.type === 'add'
                            ? t('storageManagement.typeAdd')
                            : t('storageManagement.typeRemove')}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[13px] font-medium text-gray-900 whitespace-nowrap">
                        {entry.gb} {t('storageManagement.gb')}
                      </td>
                      <td className="px-6 py-3.5 text-[13px] text-right whitespace-nowrap">
                        <span className={entry.type === 'add' ? 'text-gray-700' : 'text-gray-400'}>
                          ${entry.cost.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Back to packages ──────────────────────────────────── */}
        <div className="flex justify-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-apple"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('storageManagement.backToPackages')}
          </Link>
        </div>
      </div>
    </div>
  )
}
