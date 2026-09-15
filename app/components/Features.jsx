'use client'

import { useI18n } from '@/lib/i18n/LanguageContext'

export default function Features() {
  const { t } = useI18n()
  const features = [
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t('features.items.encryption.title'),
      description: t('features.items.encryption.desc'),
      color: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t('features.items.expiry.title'),
      description: t('features.items.expiry.desc'),
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: t('features.items.password.title'),
      description: t('features.items.password.desc'),
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[13px] font-semibold text-primary-600 uppercase tracking-widest mb-3 block">{t('features.label')}</span>
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-subtitle">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-apple-lg border border-gray-200/70 p-8 hover:shadow-apple-md hover:border-gray-300/60 transition-all duration-500 ease-apple"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-apple ${feature.iconColor} mb-5 group-hover:scale-110 transition-transform duration-500 ease-apple`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2.5">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-relaxed text-[15px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
