'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n/LanguageContext'
import { useAuth, registerUser } from '@/lib/auth/client'

function AuthContent() {
  const { t, lang } = useI18n()
  const searchParams = useSearchParams()
  const paramMode = searchParams?.get('mode')
  const callbackUrl = searchParams?.get('callbackUrl') || '/packages'
  const initialMode = paramMode === 'register' ? 'register' : paramMode === 'enterprise' ? 'enterprise' : 'login'
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [enterpriseCode, setEnterpriseCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'register' && password !== confirmPassword) {
      setError(lang === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match')
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const result = await login({ email, password, callbackUrl })
        if (!result.ok) {
          setError(result.error || (lang === 'zh' ? '登录失败' : 'Login failed'))
        } else {
          router.push(callbackUrl)
          router.refresh()
        }
      } else if (mode === 'register') {
        const regResult = await registerUser(email, password)
        if (!regResult.success) {
          setError(regResult.error || (lang === 'zh' ? '注册失败' : 'Registration failed'))
        } else {
          // 注册成功后自动登录
          const loginResult = await login({ email, password, callbackUrl })
          if (loginResult.ok) {
            router.push(callbackUrl)
            router.refresh()
          } else {
            setError(lang === 'zh' ? '注册成功，请手动登录' : 'Registration successful, please login')
            setMode('login')
          }
        }
      } else if (mode === 'enterprise') {
        // 企业号登入（模拟，后续接入企业管理系统）
        router.push('/enterprise')
      }
    } catch (err) {
      setError(lang === 'zh' ? '操作失败，请稍后重试' : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'login', label: t('auth.tabs.login') },
    { key: 'register', label: t('auth.tabs.register') },
    { key: 'enterprise', label: t('auth.tabs.enterprise') },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[9px] flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
              </svg>
            </div>
            <span className="text-[20px] font-semibold tracking-tight text-gray-900">Qrsecu</span>
          </Link>
        </div>

        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-md p-8">
          {/* 切换标签 */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-full mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex-1 py-2 text-[13px] font-medium rounded-full transition-all duration-300 ease-apple ${
                  mode === tab.key
                    ? 'bg-white text-gray-900 shadow-apple-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 错误提示 */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-apple">
                <svg className="w-4 h-4 text-rose-500 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] text-rose-700 font-medium">{error}</p>
              </div>
            )}
            {mode === 'enterprise' ? (
              <>
                {/* 企业号登入提示 */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-primary-50/60 border border-primary-200/50 rounded-apple">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  <p className="text-[13px] text-primary-700 font-medium">{t('auth.enterpriseHint')}</p>
                </div>

                {/* 邮箱 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('auth.adminEmail')}</label>
                  <div className="relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.adminEmailPlaceholder')}
                      required
                      className="w-full h-12 pl-11 pr-4 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                {/* 密码 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('auth.password')}</label>
                  <div className="relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      required
                      className="w-full h-12 pl-11 pr-4 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                {/* 企业代码 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('auth.enterpriseCode')}</label>
                  <div className="relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="text"
                      value={enterpriseCode}
                      onChange={(e) => setEnterpriseCode(e.target.value)}
                      placeholder={t('auth.enterpriseCodePlaceholder')}
                      required
                      className="w-full h-12 pl-11 pr-4 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 邮箱 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('auth.email')}</label>
                  <div className="relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      required
                      className="w-full h-12 pl-11 pr-4 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                {/* 密码 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('auth.password')}</label>
                  <div className="relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'register' ? t('auth.passwordRegisterPlaceholder') : t('auth.passwordPlaceholder')}
                      required
                      minLength={mode === 'register' ? 8 : undefined}
                      className="w-full h-12 pl-11 pr-4 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                {/* 注册时多一个确认密码 */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('auth.confirmPassword')}</label>
                    <div className="relative">
                      <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        required
                        className="w-full h-12 pl-11 pr-4 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* 登入时的忘记密码 */}
                {mode === 'login' && (
                  <div className="flex justify-end">
                    <button type="button" className="text-[13px] text-primary-600 hover:text-primary-700 font-medium">
                      {t('auth.forgotPassword')}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white text-[15px] font-semibold rounded-full shadow-apple-blue hover:shadow-lg transition-all duration-300 ease-apple disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (lang === 'zh' ? '处理中...' : 'Loading...') : (mode === 'login' ? t('auth.loginBtn') : mode === 'register' ? t('auth.registerBtn') : t('auth.enterpriseBtn'))}
            </button>
          </form>

          {/* 切换提示 */}
          <div className="mt-6 text-center text-[13px] text-gray-400">
            {mode === 'login' ? (
              <>
                {t('auth.noAccount')}
                <button onClick={() => setMode('register')} className="text-primary-600 hover:text-primary-700 font-medium ml-1">
                  {t('auth.registerNow')}
                </button>
              </>
            ) : mode === 'register' ? (
              <>
                {t('auth.hasAccount')}
                <button onClick={() => setMode('login')} className="text-primary-600 hover:text-primary-700 font-medium ml-1">
                  {t('auth.goLogin')}
                </button>
              </>
            ) : (
              <>
                {t('auth.needEnterprise')}
                <Link href="/pricing" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
                  {t('auth.learnEnterprise')}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 返回首页 */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
            {t('auth.backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Auth() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <AuthContent />
    </Suspense>
  )
}
