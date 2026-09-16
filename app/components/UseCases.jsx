'use client'

import { useI18n } from '@/lib/i18n/LanguageContext'

export default function UseCases() {
  const { t } = useI18n()
  const cases = [
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ),
      title: t('useCases.items.social.title'),
      description: t('useCases.items.social.desc'),
      tag: t('useCases.items.social.tag'),
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M9.5 14.5L4 20m0 0V15m0 5h5m10.5-5.5L15 20m5 0v-5m0 5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t('useCases.items.design.title'),
      description: t('useCases.items.design.desc'),
      tag: t('useCases.items.design.tag'),
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      title: t('useCases.items.enterprise.title'),
      description: t('useCases.items.enterprise.desc'),
      tag: t('useCases.items.enterprise.tag'),
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M21 8v8a2 2 0 01-2 2H8l-5 4V6a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ),
      title: t('useCases.items.event.title'),
      description: t('useCases.items.event.desc'),
      tag: t('useCases.items.event.tag'),
      gradient: 'from-cyan-500 to-blue-500',
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[13px] font-semibold text-primary-600 uppercase tracking-widest mb-3 block">{t('useCases.label')}</span>
          <h2 className="section-title">{t('useCases.title')}</h2>
          <p className="section-subtitle">
            {t('useCases.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cases.map((item, index) => (
            <div
              key={index}
              className="group relative bg-gray-100 rounded-apple-lg p-7 hover:bg-white hover:shadow-apple-md transition-all duration-500 ease-apple"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 bg-gradient-to-br ${item.gradient} rounded-apple text-white mb-5 shadow-sm group-hover:scale-110 transition-transform duration-500 ease-apple`}>
                {item.icon}
              </div>

              <span className="inline-block px-2 py-0.5 bg-gray-200/70 text-gray-500 text-[11px] font-medium rounded-full mb-3">
                {item.tag}
              </span>

              <h3 className="text-[17px] font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-[14px] text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
