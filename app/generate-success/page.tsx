'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import QRCode from '@/app/components/QRCode'
import { useI18n } from '@/lib/i18n/LanguageContext'

export default function GenerateSuccess() {
  const { t } = useI18n()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const qrWrapperRef = useRef(null)

  // 从 sessionStorage 读取 CreatePackage 传来的数据
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('packageData')
      if (stored) setData(JSON.parse(stored))
    } catch {}
  }, [])

  // 无数据则回到创建页
  useEffect(() => {
    if (!data) {
      router.replace('/create-package')
    }
  }, [data, router])

  if (!data) return null

  const shareUrl = `https://qr.sec/u/${data.id}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // 剪贴板不可用时静默
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // 将二维码 SVG 导出为 PNG 文件
  const handleDownloadPng = () => {
    if (downloading) return
    const wrapper = qrWrapperRef.current
    const svg = wrapper?.querySelector('svg')
    if (!svg) return

    setDownloading(true)

    try {
      // 克隆 SVG 并补全 xmlns，确保作为独立资源能被浏览器渲染
      const svgClone = svg.cloneNode(true)
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      const svgData = new XMLSerializer().serializeToString(svgClone)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = () => {
        // 4 倍分辨率输出，保证清晰度
        const scale = 4
        const size = 240 * scale
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        // 白色背景
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, size, size)
        // 绘制二维码
        ctx.drawImage(img, 0, 0, size, size)
        URL.revokeObjectURL(url)

        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = pngUrl
            // 清理非法文件名字符
            const safeName = data.title.replace(/[\\/:*?"<>|]/g, '_')
            a.download = `${safeName}-qrcode.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(pngUrl)
          }
          setDownloading(false)
        }, 'image/png')
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        setDownloading(false)
      }
      img.src = url
    } catch {
      setDownloading(false)
    }
  }

  // 权限标签
  const tags = []
  if (data.burnAfterRead) tags.push({ text: t('packageDetail.burnAfterRead'), cls: 'bg-amber-50 text-amber-700' })
  if (data.allowDownload) tags.push({ text: t('packageDetail.allowDownload'), cls: 'bg-emerald-50 text-emerald-700' })
  if (data.allowForward) tags.push({ text: t('packageDetail.allowForward'), cls: 'bg-primary-50 text-primary-700' })
  if (!data.password) tags.push({ text: '无密码', cls: 'bg-gray-100 text-gray-600' })

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* 成功提示 */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-emerald-50 mb-4 animate-[fadeIn_0.4s_ease-apple]">
            <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">{t('generateSuccess.title')}</h1>
          <p className="text-[14px] text-gray-500 mt-1">{t('generateSuccess.subtitle')}</p>
        </div>

        {/* 二维码卡片 */}
        <div className="bg-white rounded-apple-lg border border-gray-200/70 p-8 shadow-apple-sm">
          <div className="flex flex-col items-center">
            {/* 二维码 */}
            <div ref={qrWrapperRef} className="relative p-4 bg-white rounded-apple border border-gray-100">
              <QRCode value={`qrsecu://p/${data.id}`} size={240} />
              {/* 中心 logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-apple-sm border border-gray-100">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[5px] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 标题 */}
            <h2 className="mt-6 text-[20px] font-semibold text-gray-900">{data.title}</h2>
            <p className="text-[12px] text-gray-400 mt-1">
              {t('generateSuccess.packageId')}<span className="font-mono text-gray-500">{data.id}</span>
            </p>

            {/* 访问链接 */}
            <div className="w-full mt-6 flex items-center gap-2 p-3 bg-gray-50 rounded-apple">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="flex-1 text-[13px] text-gray-600 truncate font-mono">{shareUrl}</span>
              <button
                onClick={handleCopy}
                className="text-primary-600 text-[12px] font-medium hover:text-primary-700 transition-colors px-2"
              >
                {copied ? t('generateSuccess.copied') : t('generateSuccess.copy')}
              </button>
            </div>

            {/* 摘要 */}
            <div className="w-full mt-6 grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-apple">
                <div className="text-[11px] text-gray-400">{t('generateSuccess.contentType')}</div>
                <div className="text-[13px] text-gray-800 font-medium mt-0.5">{data.typesText}</div>
              </div>
              {data.filesCount > 0 && (
                <div className="p-3 bg-gray-50 rounded-apple">
                  <div className="text-[11px] text-gray-400">{t('generateSuccess.attachments')}</div>
                  <div className="text-[13px] text-gray-800 font-medium mt-0.5">{data.filesCount}{t('generateSuccess.fileCount')}</div>
                </div>
              )}
              {data.textLength > 0 && (
                <div className="p-3 bg-gray-50 rounded-apple">
                  <div className="text-[11px] text-gray-400">{t('generateSuccess.textContent')}</div>
                  <div className="text-[13px] text-gray-800 font-medium mt-0.5">{data.textLength}{t('generateSuccess.charCount')}</div>
                </div>
              )}
              {data.password && (
                <div className="p-3 bg-gray-50 rounded-apple">
                  <div className="text-[11px] text-gray-400">{t('generateSuccess.passwordProtect')}</div>
                  <div className="text-[13px] text-gray-800 font-medium mt-0.5">{t('generateSuccess.enabled')}</div>
                </div>
              )}
              {data.expirationDate && (
                <div className="p-3 bg-gray-50 rounded-apple">
                  <div className="text-[11px] text-gray-400">{t('generateSuccess.expiry')}</div>
                  <div className="text-[13px] text-gray-800 font-medium mt-0.5">{data.expirationDate}</div>
                </div>
              )}
              {data.maxViews && (
                <div className="p-3 bg-gray-50 rounded-apple">
                  <div className="text-[11px] text-gray-400">{t('generateSuccess.maxViews')}</div>
                  <div className="text-[13px] text-gray-800 font-medium mt-0.5">{data.maxViews}{t('generateSuccess.viewsSuffix')}</div>
                </div>
              )}
              <div className="p-3 bg-gray-50 rounded-apple">
                <div className="text-[11px] text-gray-400">{t('generateSuccess.createdAt')}</div>
                <div className="text-[13px] text-gray-800 font-medium mt-0.5">
                  {new Date(data.createdAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* 权限标签 */}
            <div className="w-full mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag.text} className={`px-2.5 py-1 ${tag.cls} text-[11px] font-medium rounded-full`}>
                  {tag.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/packages"
            className="flex-1 px-5 py-3 bg-white border border-gray-200 text-gray-700 text-[14px] font-medium rounded-full hover:bg-gray-50 transition-all text-center"
          >
            {t('generateSuccess.backToPackages')}
          </Link>
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            className={`flex-1 px-5 py-3 text-white text-[14px] font-semibold rounded-full transition-all duration-300 ease-apple ${
              downloading
                ? 'bg-primary-400 cursor-wait'
                : 'bg-primary-600 hover:bg-primary-700 shadow-apple-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                    <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  {t('generateSuccess.generating')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t('generateSuccess.downloadQR')}
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
