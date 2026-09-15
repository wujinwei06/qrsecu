'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/LanguageContext'

// 各版本单文件大小限制（字节）
const FILE_LIMITS = {
  free: {
    image:  10 * 1024 * 1024,       // 10MB
    audio:  30 * 1024 * 1024,        // 30MB
    video:  50 * 1024 * 1024,        // 50MB
    archive: 10 * 1024 * 1024,      // 10MB
  },
  pro: {
    image:  500 * 1024 * 1024,      // 500MB
    audio:  1024 * 1024 * 1024,      // 1GB
    video:  2 * 1024 * 1024 * 1024,  // 2GB
    archive: 100 * 1024 * 1024,     // 100MB
  },
}

const contentTypes = [
  {
    key: 'text',
    label: '正文',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 10h16M4 14h10M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    fileTypes: [],
    maxSize: null,
  },
  {
    key: 'image',
    label: '图片',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M21 17l-5-5-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    fileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  {
    key: 'audio',
    label: '音频',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M9 18V6l10-3v12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    fileTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/aac'],
  },
  {
    key: 'video',
    label: '视频',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M17 10l4-2v8l-4-2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    fileTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
  {
    key: 'archive',
    label: '档案',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8v12a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    fileTypes: ['.zip', '.rar', '.7z', 'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
  },
]

function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export default function CreatePackage() {
  const { t } = useI18n()
  const router = useRouter()
  // 当前套餐等级（模拟：免费版 / 专业版）
  const [planTier, setPlanTier] = useState('free')
  // 基础表单
  const [title, setTitle] = useState('')
  const [selectedTypes, setSelectedTypes] = useState(['text'])
  const [textContent, setTextContent] = useState('')
  const [files, setFiles] = useState([])
  
  // 访问控制
  const [password, setPassword] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [maxViews, setMaxViews] = useState('')
  const [burnAfterRead, setBurnAfterRead] = useState(false)
  const [allowDownload, setAllowDownload] = useState(true)
  const [allowForward, setAllowForward] = useState(false)
  
  // UI 状态
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef(null)

  const toggleType = (key) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? (prev.length > 1 ? prev.filter((k) => k !== key) : prev) : [...prev, key]
    )
  }

  const getActiveMaxSize = () => {
    let max = 0
    const limits = FILE_LIMITS[planTier] || FILE_LIMITS.free
    for (const k of selectedTypes) {
      const limit = limits[k]
      if (limit) max = Math.max(max, limit)
    }
    return max
  }

  const getAcceptFileTypes = () => {
    const types = []
    for (const k of selectedTypes) {
      const type = contentTypes.find((ct) => ct.key === k)
      if (type) types.push(...type.fileTypes)
    }
    return [...new Set(types)].join(',')
  }

  const validateFile = (file) => {
    const activeMaxSize = getActiveMaxSize()
    if (activeMaxSize > 0 && file.size > activeMaxSize) {
      alert(`文件 ${file.name} 超过最大限制 ${formatSize(activeMaxSize)}`)
      return false
    }
    return true
  }

  const handleFiles = useCallback((fileList) => {
    const validFiles = []
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      if (validateFile(file)) {
        validFiles.push({
          id: Math.random().toString(36).slice(2, 10),
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'unknown',
        })
      }
    }
    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles])
    }
  }, [getActiveMaxSize])

  const onDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const onDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  const handleGenerate = () => {
    if (isGenerating) return
    setErrorMsg('')

    // 校验：必须有标题
    if (!title.trim()) {
      setErrorMsg(t('createPackage.errorTitle'))
      return
    }
    // 校验：必须至少有一项内容
    const hasText = selectedTypes.includes('text') && textContent.trim().length > 0
    const hasFiles = files.length > 0
    if (!hasText && !hasFiles) {
      setErrorMsg(t('createPackage.errorContent'))
      return
    }

    setIsGenerating(true)
    // 模拟加密生成过程
    setTimeout(() => {
      const packageId = Math.random().toString(36).slice(2, 10)
      const typesText = selectedTypes
        .map((k) => t('createPackage.types.' + k))
        .join(' / ')

      const packageData = {
        id: packageId,
        title: title.trim(),
        types: selectedTypes,
        typesText,
        filesCount: files.length,
        textLength: textContent.trim().length,
        password,
        expirationDate,
        maxViews,
        burnAfterRead,
        allowDownload,
        allowForward,
        createdAt: new Date().toISOString(),
      }

      sessionStorage.setItem('packageData', JSON.stringify(packageData))
      router.push('/generate-success')
    }, 1200)
  }

  const needsFileArea = selectedTypes.some((k) => k !== 'text')
  const activeMaxSize = getActiveMaxSize()

  return (
    <div className="min-h-screen bg-gray-100 pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/packages"
              className="w-9 h-9 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <div>
              <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">{t('createPackage.title')}</h1>
              <p className="text-[14px] text-gray-500">{t('createPackage.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 套餐切换（演示用） */}
            <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-full">
              <button
                onClick={() => setPlanTier('free')}
                className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all ${planTier === 'free' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('createPackage.planFree')}
              </button>
              <button
                onClick={() => setPlanTier('pro')}
                className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all ${planTier === 'pro' ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {t('createPackage.planPro')}
              </button>
            </div>
            <span className="hidden sm:inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-full text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              AES-256 加密
            </span>
          </div>
        </div>

        {/* 主内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：内容填报 */}
          <div className="lg:col-span-8 space-y-5">
            {/* 包装标题 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2.5">
                {t('createPackage.titleLabel')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('createPackage.titlePlaceholder')}
                  className="w-full h-12 pl-4 pr-10 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[15px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
                {title && (
                  <button
                    onClick={() => setTitle('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 内容类型选择器 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <label className="block text-[13px] font-semibold text-gray-700 mb-4">
                {t('createPackage.typeLabel')} <span className="text-gray-400 font-normal ml-1">{t('createPackage.typeMulti')}</span>
              </label>
              <div className="grid grid-cols-5 gap-3">
                {contentTypes.map((type) => {
                  const active = selectedTypes.includes(type.key)
                  return (
                    <button
                      key={type.key}
                      onClick={() => toggleType(type.key)}
                      className={`group relative aspect-square rounded-apple border flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-apple ${
                        active
                          ? 'bg-primary-50 border-primary-500 text-primary-600 shadow-apple-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {active && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                      <div className={active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600 transition-colors'}>
                        {type.icon}
                      </div>
                      <span className="text-[12px] font-medium">{t('createPackage.types.' + type.key)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 内容输入/上传区 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              {/* 文本 */}
              {selectedTypes.includes('text') && (
                <div className={files.length > 0 || needsFileArea ? 'mb-6' : ''}>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-[13px] font-semibold text-gray-700">{t('createPackage.textLabel')}</label>
                    <span className="text-[12px] text-gray-400">{textContent.length}{t('createPackage.textCount')}</span>
                  </div>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder={t('createPackage.textPlaceholder')}
                    rows={5}
                    className="w-full p-4 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none leading-relaxed"
                  />
                </div>
              )}

              {/* 文件上传 */}
              {needsFileArea && (
                <>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-[13px] font-semibold text-gray-700">
                      {selectedTypes.filter((k) => k !== 'text').map((k) => t('createPackage.types.' + k)).join('/')}
                      <span className="text-gray-400 font-normal ml-1">
                        {activeMaxSize ? `(单文件 < ${formatSize(activeMaxSize)})` : ''}
                      </span>
                    </label>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[12px] text-primary-600 font-medium hover:text-primary-700"
                    >
                      浏览文件
                    </button>
                  </div>
                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-apple-lg p-10 text-center cursor-pointer transition-all duration-300 ease-apple ${
                      isDragging
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-white shadow-apple-sm mb-4">
                      <svg className={`w-7 h-7 transition-colors ${isDragging ? 'text-primary-600' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none">
                        <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-[14px] font-medium text-gray-700 mb-1">
                      {isDragging ? '松开以上传文件' : '拖拽文件到此处'}
                    </p>
                    <p className="text-[12px] text-gray-400">
                      或点击选择文件 · {t('createPackage.fileTypes')} {selectedTypes.filter((k) => k !== 'text').map((k) => t('createPackage.types.' + k)).join('、')}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={getAcceptFileTypes()}
                      onChange={onFileInputChange}
                      className="hidden"
                    />
                  </div>

                  {/* 上传文件列表 */}
                  {files.length > 0 && (
                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[12px] font-semibold text-gray-500">已上传 {files.length}{t('createPackage.fileCount')}</span>
                        <button
                          onClick={() => setFiles([])}
                          className="text-[12px] text-gray-400 hover:text-red-500 transition-colors"
                        >
                          清空全部
                        </button>
                      </div>
                      <div className="rounded-apple border border-gray-200/70 overflow-hidden divide-y divide-gray-100">
                        {files.map((f) => (
                          <div key={f.id} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors group">
                            <div className="w-10 h-10 rounded-apple bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                                <path d="M14 3H8a2 2 0 00-2 2v14a2 2 0 002 2h8a2 2 0 002-2V9l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] font-medium text-gray-800 truncate">{f.name}</div>
                              <div className="text-[12px] text-gray-400">{formatSize(f.size)}</div>
                            </div>
                            <button
                              onClick={() => removeFile(f.id)}
                              className="w-8 h-8 inline-flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 右侧：访问控制 */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-apple bg-primary-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-[17px] font-semibold text-gray-900">{t('createPackage.accessControl')}</h2>
              </div>

              <div className="space-y-5">
                {/* 密码 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                    {t('createPackage.passwordLabel')}
                    <span className="text-gray-400 font-normal ml-1">{t('createPackage.passwordHint')}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('createPackage.passwordPlaceholder')}
                      className="w-full h-11 pl-4 pr-10 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* 有效期 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('createPackage.expiryLabel')}</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* 最大观看次数 */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                    {t('createPackage.viewsLabel')}
                    <span className="text-gray-400 font-normal ml-1">{t('createPackage.viewsHint')}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={maxViews}
                      onChange={(e) => setMaxViews(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder={t('createPackage.viewsPlaceholder')}
                      className="w-full h-11 pl-4 pr-12 bg-gray-100/60 border border-gray-200/70 rounded-apple text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">次</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 -mx-1"></div>

                {/* 复选框们 */}
                <div className="space-y-3">
                  {[
                    {
                      id: 'burnAfterRead',
                      label: t('createPackage.burnAfterRead'),
                      desc: t('createPackage.burnAfterReadHint'),
                      checked: burnAfterRead,
                      set: setBurnAfterRead,
                      icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      ),
                    },
                    {
                      id: 'allowDownload',
                      label: t('createPackage.allowDownload'),
                      desc: t('createPackage.allowDownloadHint'),
                      checked: allowDownload,
                      set: setAllowDownload,
                      icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ),
                    },
                    {
                      id: 'allowForward',
                      label: t('createPackage.allowForward'),
                      desc: t('createPackage.allowForwardHint'),
                      checked: allowForward,
                      set: setAllowForward,
                      icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M8 11l8-3M8 13l8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      ),
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => opt.set(!opt.checked)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-apple border transition-all duration-300 ease-apple text-left ${
                        opt.checked
                          ? 'bg-primary-50 border-primary-200'
                          : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-[5px] flex items-center justify-center border-2 transition-all ${
                          opt.checked
                            ? 'bg-primary-600 border-primary-600'
                            : 'bg-white border-gray-300 group-hover:border-gray-400'
                        }`}
                      >
                        {opt.checked && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`${opt.checked ? 'text-primary-700' : 'text-gray-800'} text-[14px] font-medium`}>
                            {opt.label}
                          </span>
                          <span className={`${opt.checked ? 'text-primary-500' : 'text-gray-400'} transition-colors`}>
                            {opt.icon}
                          </span>
                        </div>
                        <div className="text-[12px] text-gray-400 mt-0.5">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部生成按钮栏 */}
      <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/70 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2 text-[13px] min-h-[20px]">
              {errorMsg ? (
                <span className="flex items-center gap-1.5 text-red-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {errorMsg}
                </span>
              ) : (
                <span className="text-gray-500">完成信息填写后，点击按钮生成加密二维码</span>
              )}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={() => {
                  setTitle('')
                  setTextContent('')
                  setFiles([])
                  setPassword('')
                  setExpirationDate('')
                  setMaxViews('')
                  setBurnAfterRead(false)
                  setAllowDownload(true)
                  setAllowForward(false)
                  setSelectedTypes(['text'])
                  setErrorMsg('')
                }}
                className="px-5 py-2.5 text-[14px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              >
                {t('createPackage.clear')}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`px-8 py-3.5 text-white text-[15px] font-semibold rounded-full transition-all duration-300 ease-apple ${
                  isGenerating
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 shadow-apple-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isGenerating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      正在加密生成…
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3z" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      {t('createPackage.generate')}
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
