'use client'

import { useState } from 'react'
import Link from 'next/link'
import QRCode from '@/app/components/QRCode'
import { useI18n } from '@/lib/i18n/LanguageContext'

// 模拟数据
const mockPackage = {
  id: 'j42hnpcq',
  title: '产品发布会预告 2026',
  status: 'active',
  statusText: '活跃',
  types: ['正文'],
  typesText: '正文',
  views: 47,
  maxViews: 100,
  expirationDate: '2026-12-31',
  createdAt: '2026-08-09 14:32',
  password: 'Qrsecu@2024',
  burnAfterRead: false,
  allowDownload: true,
  allowForward: true,
}

const stats = {
  success: 47,
  failed: 6,
  total: 53,
}

const scanFragments = [
  { id: 1, location: '上海 · 中国', ip: '116.226.*.18', device: 'iPhone 15 Pro', time: '2026-08-09 15:42', status: 'success' },
  { id: 2, location: '北京 · 中国', ip: '114.114.*.215', device: 'MacBook Pro', time: '2026-08-09 14:28', status: 'success' },
  { id: 3, location: '深圳 · 中国', ip: '120.78.*.96', device: 'iPad Air', time: '2026-08-09 12:15', status: 'failed' },
  { id: 4, location: '杭州 · 中国', ip: '47.108.*.42', device: 'Pixel 8', time: '2026-08-08 22:03', status: 'success' },
  { id: 5, location: '广州 · 中国', ip: '112.94.*.137', device: 'iPhone 14', time: '2026-08-08 19:51', status: 'failed' },
  { id: 6, location: '成都 · 中国', ip: '182.140.*.71', device: 'Windows PC', time: '2026-08-08 11:36', status: 'success' },
  { id: 7, location: '武汉 · 中国', ip: '58.49.*.204', device: 'iPhone 15', time: '2026-08-07 16:20', status: 'success' },
]

function Donut({ value, max, color, label, sub }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  const r = 34
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="bg-white rounded-apple-lg border border-gray-200/70 p-5 shadow-apple-sm hover:shadow-apple-md transition-all duration-500 ease-apple">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-apple"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-semibold text-gray-900">{value}</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-gray-500">{label}</div>
          <div className="text-[12px] text-gray-400 mt-0.5">{sub}</div>
        </div>
      </div>
    </div>
  )
}

export default function PackageDetail() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const shareUrl = `https://qr.sec/u/${mockPackage.id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // 静默
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const accessTags = []
  if (mockPackage.burnAfterRead) accessTags.push({ text: t('packageDetail.burnAfterRead'), cls: 'bg-amber-50 text-amber-700' })
  if (mockPackage.allowDownload) accessTags.push({ text: t('packageDetail.allowDownload'), cls: 'bg-emerald-50 text-emerald-700' })
  if (mockPackage.allowForward) accessTags.push({ text: t('packageDetail.allowForward'), cls: 'bg-primary-50 text-primary-700' })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/packages"
              className="w-9 h-9 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div>
              <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">{mockPackage.title}</h1>
              <p className="text-[14px] text-gray-500">{t('packageDetail.detailTitle')}{mockPackage.id}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[13px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            {t('myPackages.tabs.' + mockPackage.status)}
          </span>
        </div>

        {/* 左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：二维码大图 + 操作 */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-8 shadow-apple-sm sticky top-20">
              <div className="flex flex-col items-center">
                <div className="relative p-5 bg-white rounded-apple border border-gray-100 shadow-apple-sm">
                  <QRCode value={`qrsecu://p/${mockPackage.id}`} size={280} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-[12px] flex items-center justify-center shadow-apple-sm border border-gray-100">
                    <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[6px] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-gray-400 mt-4">{t('packageDetail.scanAccess')}</p>

                {/* 操作按钮 */}
                <div className="w-full mt-6 flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M5 15V5a2 2 0 012-2h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {copied ? t('packageDetail.copied') : t('packageDetail.copyLink')}
                  </button>
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShareOpen((v) => !v)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-full shadow-apple-blue transition-all"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 11l8-3M8 13l8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      {t('packageDetail.share')}
                    </button>
                    {shareOpen && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-apple border border-gray-200 shadow-apple-lg p-2 flex items-center gap-1 z-10 w-44">
                        {[
                          { key: 'wechat', label: t('packageDetail.wechat') },
                          { key: 'email', label: t('packageDetail.email') },
                          { key: 'x', label: 'X' },
                          { key: 'copy', label: t('packageDetail.copy') },
                        ].map((s) => (
                          <button key={s.key} className="flex-1 px-2 py-2 text-[12px] text-gray-600 hover:bg-gray-100 rounded-apple transition-colors">
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：元数据 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <h2 className="text-[16px] font-semibold text-gray-900 mb-5">{t('packageDetail.meta')}</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <Meta label={t('packageDetail.status')} value={t('myPackages.tabs.' + mockPackage.status)} valueClass="text-emerald-600" />
                <Meta label={t('packageDetail.contentType')} value={t('createPackage.types.text')} />
                <Meta label={t('packageDetail.viewCount')} value={`${mockPackage.views} / ${mockPackage.maxViews}`} />
                <Meta label={t('packageDetail.createdAt')} value={mockPackage.createdAt} />
                <Meta label={t('packageDetail.expiry')} value={mockPackage.expirationDate} />
                <Meta
                  label={t('packageDetail.passwordProtect')}
                  value={mockPackage.password ? t('packageDetail.enabled') : t('packageDetail.disabled')}
                  valueClass={mockPackage.password ? 'text-primary-600' : 'text-gray-400'}
                />
              </div>
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="text-[12px] font-semibold text-gray-500 mb-2.5">{t('packageDetail.accessControl')}</div>
                <div className="flex flex-wrap gap-2">
                  {accessTags.length > 0 ? (
                    accessTags.map((tag) => (
                      <span key={tag.text} className={`px-2.5 py-1 ${tag.cls} text-[12px] font-medium rounded-full`}>
                        {tag.text}
                      </span>
                    ))
                  ) : (
                    <span className="text-[12px] text-gray-400">{t('packageDetail.noSpecialPerms')}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 扫描统计 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-gray-900">{t('packageDetail.scanStats')}</h2>
                <span className="text-[12px] text-gray-400">{t('packageDetail.last30Days')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Donut value={stats.success} max={stats.total} color="#10b981" label={t('packageDetail.successView')} sub={`${t('packageDetail.ratio')}${Math.round((stats.success / stats.total) * 100)}%`} />
                <Donut value={stats.failed} max={stats.total} color="#f43f5e" label={t('packageDetail.failedAttempts')} sub={`${t('packageDetail.ratio')}${Math.round((stats.failed / stats.total) * 100)}%`} />
                <Donut value={stats.total} max={stats.total} color="#0ea5e9" label={t('packageDetail.totalScans')} sub={t('packageDetail.cumulativeCount')} />
              </div>
            </div>

            {/* 扫描碎片 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-semibold text-gray-900">{t('packageDetail.scanFragments')}</h2>
                <button className="text-[12px] text-primary-600 font-medium hover:text-primary-700">{t('packageDetail.viewAll')}</button>
              </div>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      <th className="px-2 py-2 font-semibold">{t('packageDetail.location')}</th>
                      <th className="px-2 py-2 font-semibold">{t('packageDetail.device')}</th>
                      <th className="px-2 py-2 font-semibold">IP</th>
                      <th className="px-2 py-2 font-semibold">{t('packageDetail.scanTime')}</th>
                      <th className="px-2 py-2 font-semibold text-right">{t('packageDetail.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scanFragments.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none">
                              <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            <span className="text-[13px] text-gray-700">{s.location}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-[13px] text-gray-600">{s.device}</td>
                        <td className="px-2 py-3 text-[12px] text-gray-400 font-mono">{s.ip}</td>
                        <td className="px-2 py-3 text-[12px] text-gray-500">{s.time}</td>
                        <td className="px-2 py-3 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            s.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            {s.status === 'success' ? t('packageDetail.success') : t('packageDetail.failed')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Meta({ label, value, valueClass = 'text-gray-800' }) {
  return (
    <div>
      <div className="text-[11px] font-medium text-gray-400 mb-1">{label}</div>
      <div className={`text-[14px] font-medium ${valueClass}`}>{value}</div>
    </div>
  )
}
