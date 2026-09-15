'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/lib/i18n/LanguageContext'
import { useAuth } from '@/lib/auth/client'

export default function Navbar() {
  const pathname = usePathname()
  const { t, lang, switchLang } = useI18n()
  const { isAuthenticated, user, logout } = useAuth()

  const menuItems = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.packages'), to: '/packages' },
    { label: t('nav.pricing'), to: '/pricing' },
    { label: t('nav.help'), to: '/help' },
    { label: t('nav.feedback'), to: '/feedback' },
  ]

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[7px] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 ease-apple">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                </svg>
              </div>
              <span className="text-[17px] font-semibold tracking-tight text-gray-900">
                Qrsecu
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = item.to !== '#' && pathname === item.to
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={`px-3 py-1.5 text-[13px] font-medium rounded-full transition-all duration-300 ease-apple ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 语言切换 */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 ease-apple">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>{lang === 'zh' ? '中文' : 'English'}</span>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={() => switchLang('zh')}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors ${lang === 'zh' ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="text-[15px]">🇨🇳</span>
                  <span>中文</span>
                  {lang === 'zh' && (
                    <svg className="w-3.5 h-3.5 ml-auto" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => switchLang('en')}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] transition-colors ${lang === 'en' ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="text-[15px]">🇺🇸</span>
                  <span>English</span>
                  {lang === 'en' && (
                    <svg className="w-3.5 h-3.5 ml-auto" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="relative group">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 ease-apple">
                    <div className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-[11px] font-semibold">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[120px] truncate">{user?.email}</span>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/packages" className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                      {t('nav.myPackages')}
                    </Link>
                    <Link href="/pricing" className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                      {t('nav.pricing')}
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2 text-[13px] text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      {lang === 'zh' ? '退出登录' : 'Sign Out'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="hidden md:block px-3 py-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('nav.login')}
                </Link>
              </>
            )}

            <Link href="/create-package" className="btn-primary text-[13px] py-2 px-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {t('nav.createPackage')}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
