'use client'

import { SessionProvider } from 'next-auth/react'
import { LanguageProvider } from '@/lib/i18n/LanguageContext'

/**
 * 全局 Providers 组合
 *
 * 将 SessionProvider（认证）和 LanguageProvider（国际化）组合在一起，
 * 在根布局中统一包裹。
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  )
}
