'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'

const sectionIcons = {
  guide: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  best: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  faq: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

const sectionKeys = ['guide', 'best', 'faq']

export default function Help() {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState({ guide: [0], best: [], faq: [] })

  const sections = sectionKeys.map((key) => ({
    key,
    title: t(`help.sections.${key}.title`),
    icon: sectionIcons[key],
    items: t(`help.sections.${key}.items`),
  }))

  const toggle = (sectionKey, idx) => {
    setOpen((prev) => {
      const arr = prev[sectionKey] || []
      return { ...prev, [sectionKey]: arr.includes(idx) ? arr.filter((i) => i !== idx) : [...arr, idx] }
    })
  }

  const filterText = query.trim().toLowerCase()
  const visibleSections = sections
    .map((s) => ({
      ...s,
      items: s.items.filter(
        (it) => !filterText || it.q.toLowerCase().includes(filterText) || it.a.toLowerCase().includes(filterText)
      ),
    }))
    .filter((s) => s.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 顶部搜索引导 */}
        <div className="text-center mb-8">
          <h1 className="text-[36px] font-semibold text-gray-900 tracking-tight">{t('help.title')}</h1>
          <p className="text-[14px] text-gray-500 mt-2">{t('help.subtitle')}</p>
        </div>
        <div className="relative mb-10">
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('help.searchPlaceholder')}
            className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-apple-lg text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-apple-sm transition-all"
          />
        </div>

        {/* 折叠面板 */}
        <div className="space-y-6">
          {visibleSections.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-gray-100 mb-3">
                <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" /><path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <p className="text-[14px] text-gray-500">{t('help.noResult')}</p>
              <p className="text-[12px] text-gray-400 mt-1">{t('help.noResultHint')}</p>
            </div>
          )}
          {visibleSections.map((section) => (
            <div key={section.key} className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100">
                <span className="w-7 h-7 rounded-apple bg-primary-50 text-primary-600 flex items-center justify-center">
                  {section.icon}
                </span>
                <h2 className="text-[15px] font-semibold text-gray-900">{section.title}</h2>
                <span className="text-[12px] text-gray-400 ml-auto">{section.items.length}{t('help.articles')}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, idx) => {
                  const isOpen = (open[section.key] || []).includes(idx)
                  return (
                    <div key={idx}>
                      <button
                        onClick={() => toggle(section.key, idx)}
                        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50/60 transition-colors"
                      >
                        <span className="text-[14px] font-medium text-gray-800">{item.q}</span>
                        <svg
                          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ease-apple ${isOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24" fill="none"
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 -mt-1 animate-[fadeIn_0.3s_ease-apple]">
                          <p className="text-[13px] text-gray-600 leading-relaxed pl-0">{item.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 底部联系 */}
        <div className="mt-10 bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm text-center">
          <p className="text-[14px] text-gray-700">{t('help.bottomTitle')}</p>
          <p className="text-[12px] text-gray-400 mt-1 mb-4">{t('help.bottomSubtitle')}</p>
          <div className="flex items-center justify-center gap-3">
            <button className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-full shadow-apple-blue transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.4 8.4 0 01-9 8.4L3 21l1.1-6.9A8.4 8.4 0 1121 11.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              {t('help.contactSupport')}
            </button>
            <Link href="/feedback" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-medium rounded-full transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M8 10h8M8 14h5M21 12a8 8 0 01-12 7l-5 1 1-5a8 8 0 1116-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t('help.submitFeedback')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
