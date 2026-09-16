'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n/LanguageContext'

/**
 * 扫码落地页（公开访问）
 *
 * 用户扫描二维码后访问此页面。
 * 路径: /pack/[id]
 *
 * 功能：
 * - 显示包裹基本信息
 * - 密码验证（如果设置了密码）
 * - 查看包裹内容（文本、文件列表等）
 */
export default function PackLandingPage() {
  const params = useParams()
  const { t } = useI18n()
  const packageId = params.id as string

  const [password, setPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 模拟数据 - 实际应从 API 获取
  const mockPackage = {
    id: packageId,
    title: '季度财务报告 2024Q2',
    requiresPassword: true,
    hasText: true,
    hasFiles: true,
    filesCount: 3,
    views: 128,
    expiresAt: '2024-12-31',
    textContent: '这是一段加密的文本内容，只有输入正确密码后才能查看。\n\n包含敏感的财务数据和分析报告。',
    files: [
      { name: 'report-q2.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'charts.xlsx', size: '856 KB', type: 'excel' },
      { name: 'summary.docx', size: '128 KB', type: 'word' },
    ],
  }

  const handleUnlock = () => {
    setError('')
    setIsLoading(true)

    // 模拟验证
    setTimeout(() => {
      if (password.length >= 4) {
        setIsUnlocked(true)
      } else {
        setError('密码错误，请重试')
      }
      setIsLoading(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* 品牌标识 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold text-lg">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
            Qrsecu
          </div>
          <p className="text-gray-400 text-sm mt-1">安全二维码包裹</p>
        </div>

        {/* 主卡片 */}
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-md overflow-hidden">
          {/* 卡片头部 */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-8 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-1">{mockPackage.title}</h1>
            <p className="text-white/70 text-sm">包裹 ID: {mockPackage.id}</p>
          </div>

          {/* 卡片内容 */}
          <div className="p-6">
            {!isUnlocked && mockPackage.requiresPassword ? (
              /* 密码验证界面 */
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium text-[15px]">此包裹受密码保护</p>
                  <p className="text-gray-400 text-sm mt-1">请输入密码以查看内容</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="请输入访问密码"
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-center"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="flex items-center justify-center gap-1.5 text-red-500 text-sm">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleUnlock}
                    disabled={isLoading || !password}
                    className={`w-full py-3 text-white font-medium rounded-full transition-all duration-300 ease-apple ${
                      isLoading || !password
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 shadow-apple-blue hover:shadow-lg'
                    }`}
                  >
                    {isLoading ? '验证中...' : '解锁查看'}
                  </button>
                </div>

                {/* 包裹信息 */}
                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{mockPackage.views}</div>
                    <div className="text-xs text-gray-400">已浏览</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{mockPackage.filesCount}</div>
                    <div className="text-xs text-gray-400">文件</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">有效</div>
                    <div className="text-xs text-gray-400">状态</div>
                  </div>
                </div>
              </div>
            ) : (
              /* 内容展示界面 */
              <div>
                {/* 成功提示 */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-50 rounded-apple">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-emerald-700 font-medium text-sm">已解锁</div>
                    <div className="text-emerald-500 text-xs">您可以查看包裹内容</div>
                  </div>
                </div>

                {/* 文本内容 */}
                {mockPackage.hasText && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">文本内容</h3>
                    <div className="bg-gray-50 rounded-apple p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {mockPackage.textContent}
                    </div>
                  </div>
                )}

                {/* 文件列表 */}
                {mockPackage.hasFiles && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      附件文件 ({mockPackage.filesCount})
                    </h3>
                    <div className="space-y-2">
                      {mockPackage.files.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-apple hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                          <div className="w-10 h-10 bg-white rounded-apple flex items-center justify-center shadow-sm flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                              <path d="M14 3H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V9l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                              <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 truncate">{file.name}</div>
                            <div className="text-xs text-gray-400">{file.size}</div>
                          </div>
                          <svg className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 过期提示 */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span>有效期至 {mockPackage.expiresAt}</span>
                  <span>已浏览 {mockPackage.views} 次</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-xs">
            由 Qrsecu 提供加密保护 · AES-256 加密
          </p>
          <p className="text-gray-300 text-xs mt-1">
            创建你自己的安全二维码包裹
          </p>
        </div>
      </div>
    </div>
  )
}
