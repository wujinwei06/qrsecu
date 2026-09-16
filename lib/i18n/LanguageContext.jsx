'use client'

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('zh')

  const switchLang = useCallback((newLang) => {
    setLang(newLang)
    try { localStorage.setItem('qrsecu-lang', newLang) } catch {}
  }, [])

  // 从 localStorage 恢复语言偏好（仅客户端）
  useEffect(() => {
    try {
      const saved = localStorage.getItem('qrsecu-lang')
      if (saved === 'zh' || saved === 'en') setLang(saved)
    } catch {}
  }, [])

  // 同步 html lang 属性和页面标题
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    document.title = lang === 'zh' ? 'Qrsecu - 安全二维码生成器' : 'Qrsecu - Secure QR Code Generator'
  }, [lang])

  const t = useMemo(() => {
    const dict = translations[lang] || translations.zh
    return (path) => {
      const keys = path.split('.')
      let val = dict
      for (const k of keys) {
        if (val == null) break
        val = val[k]
      }
      return val ?? path
    }
  }, [lang])

  const value = useMemo(() => ({ lang, switchLang, t }), [lang, switchLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
