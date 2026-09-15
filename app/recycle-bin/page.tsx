'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'

const mockDeletedPackages = [
  {
    id: 1,
    name: '项目保密协议 V1.0',
    deletedAt: '2024-08-01',
    daysRemaining: 7,
    thumbnail: 'from-slate-400 to-slate-600',
  },
  {
    id: 2,
    name: '客户资料 - A类重点',
    deletedAt: '2024-08-03',
    daysRemaining: 9,
    thumbnail: 'from-rose-400 to-red-500',
  },
  {
    id: 3,
    name: '员工个人身份证扫描件',
    deletedAt: '2024-08-05',
    daysRemaining: 11,
    thumbnail: 'from-amber-400 to-yellow-500',
  },
  {
    id: 4,
    name: '未发布的博客草稿',
    deletedAt: '2024-08-06',
    daysRemaining: 13,
    thumbnail: 'from-blue-400 to-indigo-500',
  },
  {
    id: 5,
    name: '临时测试包 - 0728',
    deletedAt: '2024-08-07',
    daysRemaining: 14,
    thumbnail: 'from-teal-400 to-emerald-500',
  },
]

export default function RecycleBin() {
  const { t } = useI18n()
  const [packages, setPackages] = useState(mockDeletedPackages)

  const handleRestore = (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCleanupExpired = () => {
    setPackages((prev) => prev.filter((p) => p.daysRemaining > 3))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-gray-900 tracking-tight">{t('recycleBin.title')}</h1>
            <p className="mt-1 text-gray-500 text-[15px]">{t('recycleBin.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/packages"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-apple"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('recycleBin.backToPackages')}
            </Link>
            <button
              onClick={handleCleanupExpired}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 text-[13px] font-medium rounded-full transition-colors duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 7h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {t('recycleBin.cleanExpired')}
            </button>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/60 rounded-apple-lg p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 w-9 h-9 bg-amber-100 rounded-apple flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10.3 3.5L2.5 17a2 2 0 002 3h15a2 2 0 002-3L13.7 3.5a2 2 0 00-3.4 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-semibold text-amber-900">{t('recycleBin.ruleTitle')}</h3>
              <p className="mt-0.5 text-[13px] text-amber-700 leading-relaxed">
                {t('recycleBin.ruleText')}<span className="font-semibold">{t('recycleBin.ruleDays')}</span>{t('recycleBin.ruleSuffix')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-full border border-amber-200">
              <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none">
                <path d="M5 7h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span className="text-[13px] font-semibold text-amber-700">{packages.length}{t('recycleBin.countSuffix')}</span>
            </div>
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white rounded-apple-lg border border-gray-200/70 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none">
                <path d="M5 7h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">{t('recycleBin.empty')}</p>
            <p className="text-[13px] text-gray-400 mt-1">{t('recycleBin.emptyHint')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="group bg-white rounded-apple-lg border border-gray-200/70 p-5 hover:shadow-apple hover:border-gray-300/60 transition-all duration-500 ease-apple"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-apple bg-gradient-to-br ${pkg.thumbnail} flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white/90" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-[15px] truncate">{pkg.name}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500">
                        {t('recycleBin.deleted')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        {t('recycleBin.deleteDate')}
                        <span className="font-medium text-gray-600">{pkg.deletedAt}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M12 9v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9 3h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        {t('recycleBin.remaining')}
                        <span className={`font-semibold ${pkg.daysRemaining <= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                          {pkg.daysRemaining}{t('recycleBin.daysSuffix')}
                        </span>
                        {t('recycleBin.afterDelete')}
                      </div>
                    </div>

                    <div className="mt-2.5 h-1 w-full max-w-md bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pkg.daysRemaining <= 3 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'
                        }`}
                        style={{ width: `${(pkg.daysRemaining / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-auto">
                    <button
                      onClick={() => handleRestore(pkg.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-full shadow-apple-blue transition-all duration-300 ease-apple hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12a9 9 0 0115-6.7L21 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 12a9 9 0 01-15 6.7L3 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {t('recycleBin.restore')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
