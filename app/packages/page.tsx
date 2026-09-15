'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'

function getStatusClasses(status) {
  switch (status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-600'
    case 'expired':
      return 'bg-amber-50 text-amber-600'
    case 'destroyed':
      return 'bg-gray-100 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

export default function MyPackages() {
  const { t, lang } = useI18n()
  const [activeTab, setActiveTab] = useState('all')

  const mockPackages = [
    {
      id: 1,
      name: '季度财务报告 2024Q2',
      status: 'active',
      statusText: t('myPackages.tabs.active'),
      views: 128,
      createdAt: '2024-06-15',
      expiresAt: '2024-12-31',
      thumbnail: 'from-emerald-400 to-cyan-500',
    },
    {
      id: 2,
      name: '产品设计稿 V3.2',
      status: 'active',
      statusText: t('myPackages.tabs.active'),
      views: 56,
      createdAt: '2024-07-01',
      expiresAt: '2024-09-30',
      thumbnail: 'from-violet-400 to-purple-500',
    },
    {
      id: 3,
      name: '婚礼邀请函 - 电子版本',
      status: 'expired',
      statusText: t('myPackages.tabs.expired'),
      views: 342,
      createdAt: '2024-05-01',
      expiresAt: '2024-06-30',
      thumbnail: 'from-rose-400 to-pink-500',
    },
    {
      id: 4,
      name: '薪资条 2024年7月',
      status: 'active',
      statusText: t('myPackages.tabs.active'),
      views: 3,
      createdAt: '2024-07-25',
      expiresAt: '2024-08-25',
      thumbnail: 'from-amber-400 to-orange-500',
    },
    {
      id: 5,
      name: '项目机密资料 - Beta',
      status: 'destroyed',
      statusText: t('myPackages.tabs.destroyed'),
      views: 89,
      createdAt: '2024-03-10',
      expiresAt: '2024-05-10',
      thumbnail: 'from-slate-400 to-slate-600',
    },
    {
      id: 6,
      name: '个人简历 2024版',
      status: 'active',
      statusText: t('myPackages.tabs.active'),
      views: 47,
      createdAt: '2024-07-10',
      expiresAt: '2025-01-10',
      thumbnail: 'from-blue-400 to-indigo-500',
    },
    {
      id: 7,
      name: '情侣旅行照片集',
      status: 'active',
      statusText: t('myPackages.tabs.active'),
      views: 12,
      createdAt: '2024-07-20',
      expiresAt: '2025-07-20',
      thumbnail: 'from-teal-400 to-green-500',
    },
    {
      id: 8,
      name: '营销活动策划案',
      status: 'expired',
      statusText: t('myPackages.tabs.expired'),
      views: 156,
      createdAt: '2024-04-01',
      expiresAt: '2024-06-01',
      thumbnail: 'from-fuchsia-400 to-purple-500',
    },
  ]

  const tabs = [
    { key: 'all', label: t('myPackages.tabs.all') },
    { key: 'active', label: t('myPackages.tabs.active') },
    { key: 'expired', label: t('myPackages.tabs.expired') },
    { key: 'destroyed', label: t('myPackages.tabs.destroyed') },
  ]

  const filteredPackages = mockPackages.filter((pkg) => {
    if (activeTab === 'all') return true
    return pkg.status === activeTab
  })

  const countByTab = (key) => {
    if (key === 'all') return mockPackages.length
    return mockPackages.filter((p) => p.status === key).length
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-[32px] font-semibold text-gray-900 tracking-tight">{t('myPackages.title')}</h1>
            <p className="mt-1 text-gray-500 text-[15px]">{t('myPackages.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/storage"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-apple"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {t('nav.storage')}
            </Link>
            <Link
              href="/recycle-bin"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] font-medium rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 ease-apple"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 7h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7V4h6v3M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {t('myPackages.recycleBin')}
            </Link>
            <Link
              href="/create-package"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-full shadow-apple-blue hover:shadow-lg transition-all duration-300 ease-apple"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {t('myPackages.createNew')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ease-apple whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-apple-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-semibold ${
                    isActive ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {countByTab(tab.key)}
                </span>
              </button>
            )
          })}
        </div>

        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-apple-lg border border-gray-200/70 py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-400" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">{t('myPackages.empty')}</p>
            <p className="text-[13px] text-gray-400 mt-1">{t('myPackages.emptyHint')}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="group bg-white rounded-apple-lg border border-gray-200/70 overflow-hidden hover:shadow-apple-md hover:border-gray-300/60 transition-all duration-500 ease-apple"
              >
                <div className={`h-32 bg-gradient-to-br ${pkg.thumbnail} relative flex items-center justify-center`}>
                  <svg className="w-14 h-14 text-white/90" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className={`absolute top-3 right-3 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusClasses(pkg.status)}`}>
                    {pkg.statusText}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-[15px] truncate mb-4 group-hover:text-primary-600 transition-colors">
                    {pkg.name}
                  </h3>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        {t('myPackages.views')}
                      </div>
                      <span className="font-semibold text-gray-700">{pkg.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        {t('myPackages.deadline')}
                      </div>
                      <span className="font-semibold text-gray-700">{pkg.expiresAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[13px] font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-full transition-colors duration-300"
                    >
                      {t('myPackages.detail')}
                    </Link>
                    <button className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-300">
                      {t('myPackages.share')}
                    </button>
                    <button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300" title={t('myPackages.delete')}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M5 7h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
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
