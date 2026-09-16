'use client'

import { useI18n } from '@/lib/i18n/LanguageContext'

export default function Footer() {
  const { t } = useI18n()
  const footerLinks = {
    product: {
      title: t('footer.product.title'),
      links: [t('footer.product.features'), t('footer.product.pricing'), t('footer.product.api'), t('footer.product.changelog')],
    },
    support: {
      title: t('footer.support.title'),
      links: [t('footer.support.help'), t('footer.support.contact'), t('footer.support.security'), t('footer.support.status')],
    },
    company: {
      title: t('footer.company.title'),
      links: [t('footer.company.about'), t('footer.company.blog'), t('footer.company.privacy'), t('footer.company.terms')],
    },
  }

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[7px] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </div>
              <span className="text-[17px] font-semibold text-white">Qrsecu</span>
            </div>
            <p className="text-[13px] leading-relaxed mb-4">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-2">
              {[
                <path key="tw" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
                <path key="gh" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.602-3.369-1.34-3.369-1.34-.455-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.071 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.831.092-.646.349-1.088.635-1.339-2.22-.252-4.555-1.109-4.555-4.939 0-1.092.39-1.984 1.029-2.684-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.7 1.028 1.592 1.028 2.684 0 3.842-2.339 4.685-4.565 4.931.359.31.679.921.679 1.856 0 1.341-.012 2.423-.012 2.751 0 .267.18.578.688.48C19.138 20.16 22 16.418 22 12 22 6.477 17.523 2 12 2z" />,
                <path key="in" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />,
              ].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-[13px] mb-3">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-gray-500">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center gap-6 text-[13px] text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">{t('footer.company.privacy')}</a>
            <a href="#" className="hover:text-gray-300 transition-colors">{t('footer.company.terms')}</a>
            <a href="#" className="hover:text-gray-300 transition-colors">{t('footer.cookie')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
