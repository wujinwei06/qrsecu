'use client'

import { useI18n } from '@/lib/i18n/LanguageContext'

export default function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-100 via-gray-100 to-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary-200/40 via-transparent to-transparent rounded-full blur-3xl -translate-y-1/2"></div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-600 px-3.5 py-1.5 rounded-full text-[13px] font-medium mb-8 shadow-apple-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
          </span>
          {t('hero.badge')}
        </div>

        <h1 className="text-display text-gray-900 mb-5">
          {t('hero.title1')}
          <span className="block bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 bg-clip-text text-transparent">
            {t('hero.title2')}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10 leading-relaxed font-normal">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button className="btn-primary text-[15px] px-7 py-3.5 w-full sm:w-auto">
            <span className="flex items-center justify-center gap-1.5">
              {t('hero.createBtn')}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button className="btn-secondary text-[15px] px-7 py-3.5 w-full sm:w-auto">
            <span className="flex items-center justify-center gap-1.5">
              <svg className="w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {t('hero.demoBtn')}
            </span>
          </button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-6 text-[13px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('hero.tags.encryption')}
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('hero.tags.free')}
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-primary-500" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('hero.tags.private')}
          </div>
        </div>
      </div>
    </section>
  )
}
