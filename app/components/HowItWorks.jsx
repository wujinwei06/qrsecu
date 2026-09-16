'use client'

import { useI18n } from '@/lib/i18n/LanguageContext'

export default function HowItWorks() {
  const { t } = useI18n()
  const steps = [
    {
      number: '01',
      title: t('howItWorks.steps.create.title'),
      description: t('howItWorks.steps.create.desc'),
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M3 12l9 4 9-4M3 17l9 4 9-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      number: '02',
      title: t('howItWorks.steps.generate.title'),
      description: t('howItWorks.steps.generate.desc'),
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      number: '03',
      title: t('howItWorks.steps.share.title'),
      description: t('howItWorks.steps.share.desc'),
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[13px] font-semibold text-primary-600 uppercase tracking-widest mb-3 block">{t('howItWorks.label')}</span>
          <h2 className="section-title">{t('howItWorks.title')}</h2>
          <p className="section-subtitle">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-12 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent hidden lg:block"></div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative text-center group"
              >
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-apple-lg border border-gray-200/70 shadow-apple mb-6 group-hover:shadow-apple-md group-hover:-translate-y-1 transition-all duration-500 ease-apple">
                  <div className="absolute -top-2 -right-2 min-w-[28px] h-7 px-1.5 bg-primary-600 text-white rounded-full flex items-center justify-center text-[12px] font-semibold shadow-apple-sm">
                    {step.number}
                  </div>
                  <div className="text-primary-600">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2.5">
                  {step.title}
                </h3>

                <p className="text-gray-500 max-w-xs mx-auto leading-relaxed text-[15px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
