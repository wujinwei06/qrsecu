'use client'

import { useI18n } from '@/lib/i18n/LanguageContext'

export default function CTA() {
  const { t } = useI18n()
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-primary-400/15 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-headline text-white mb-5 leading-tight">
          {t('cta.title1')}<br />{t('cta.title2')}
        </h2>

        <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto font-normal leading-relaxed">
          {t('cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button className="w-full sm:w-auto bg-white text-primary-600 font-medium py-3.5 px-7 rounded-full hover:bg-primary-50 transition-all duration-300 ease-apple shadow-apple-lg hover:-translate-y-0.5 active:translate-y-0">
            <span className="flex items-center justify-center gap-1.5">
              {t('cta.startBtn')}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <button className="w-full sm:w-auto bg-white/10 text-white font-medium py-3.5 px-7 rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 ease-apple backdrop-blur-sm">
            {t('cta.salesBtn')}
          </button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-primary-100">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('cta.tags.password')}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('cta.tags.limit')}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('cta.tags.destroy')}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('cta.tags.cancel')}
          </div>
        </div>
      </div>
    </section>
  )
}
