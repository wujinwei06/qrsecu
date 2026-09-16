'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'
import { useAuth } from '@/lib/auth/client'

/**
 * 用户仪表盘主页
 *
 * 路径: /dashboard
 * 功能: 显示用户账户概览、套餐信息、快捷入口等
 */
export default function DashboardPage() {
  const { t } = useI18n()
  const { user } = useAuth()

  // 模拟数据
  const stats = {
    totalPackages: 12,
    activePackages: 8,
    totalViews: 542,
    storageUsed: 3.8,
    storageTotal: 6, // 1GB 基础 + 5GB 订阅
  }

  const quickActions = [
    {
      key: 'create',
      label: '创建包裹',
      desc: '生成新的安全二维码',
      href: '/create-package',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      color: 'from-primary-500 to-primary-700',
    },
    {
      key: 'packages',
      label: '我的包裹',
      desc: '管理所有二维码包裹',
      href: '/packages',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      color: 'from-violet-500 to-purple-700',
    },
    {
      key: 'storage',
      label: '储存管理',
      desc: '管理云储存空间',
      href: '/dashboard/storage',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-700',
    },
    {
      key: 'recycle',
      label: '回收站',
      desc: '恢复或永久删除',
      href: '/recycle-bin',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          <path d="M5 7h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M9 7V4h6v3M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-700',
    },
  ]

  const usedPct = Math.min(100, Math.round((stats.storageUsed / stats.storageTotal) * 100))

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 顶部欢迎 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">
              你好，{user?.name || user?.email || '用户'} 👋
            </h1>
            <p className="text-[14px] text-gray-500 mt-1">欢迎回到你的仪表盘</p>
          </div>
          <Link
            href="/create-package"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-full shadow-apple-blue hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-apple"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            创建新包裹
          </Link>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-apple-lg border border-gray-200/70 p-5 shadow-apple-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-400 font-medium">总包裹数</span>
              <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <div className="text-[28px] font-semibold text-gray-900 tracking-tight">
              {stats.totalPackages}
            </div>
            <div className="text-[12px] text-emerald-600 mt-1">
              {stats.activePackages} 个活跃
            </div>
          </div>

          <div className="bg-white rounded-apple-lg border border-gray-200/70 p-5 shadow-apple-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-400 font-medium">总浏览量</span>
              <div className="w-8 h-8 bg-violet-50 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none">
                  <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <div className="text-[28px] font-semibold text-gray-900 tracking-tight">
              {stats.totalViews}
            </div>
            <div className="text-[12px] text-gray-400 mt-1">累计扫码次数</div>
          </div>

          <div className="bg-white rounded-apple-lg border border-gray-200/70 p-5 shadow-apple-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-400 font-medium">已用储存</span>
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <div className="text-[28px] font-semibold text-gray-900 tracking-tight">
              {stats.storageUsed}
              <span className="text-[14px] text-gray-400 font-normal ml-0.5">GB</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                <span>共 {stats.storageTotal} GB</span>
                <span>{usedPct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${usedPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-apple-lg border border-gray-200/70 p-5 shadow-apple-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-gray-400 font-medium">当前套餐</span>
              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="text-[20px] font-semibold text-gray-900 tracking-tight">
              专业版
            </div>
            <Link
              href="/pricing"
              className="text-[12px] text-primary-600 font-medium mt-2 inline-flex items-center gap-1 hover:text-primary-700"
            >
              管理订阅
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="mb-8">
          <h2 className="text-[16px] font-semibold text-gray-900 mb-4">快捷操作</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.key}
                href={action.href}
                className="group bg-white rounded-apple-lg border border-gray-200/70 p-5 shadow-apple-sm hover:shadow-apple-md hover:border-gray-300/60 transition-all duration-300 ease-apple"
              >
                <div className={`w-12 h-12 rounded-apple bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-[15px] mb-1">{action.label}</h3>
                <p className="text-[12px] text-gray-400">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-[16px] font-semibold text-gray-900">最近活动</h2>
            <Link
              href="/packages"
              className="text-[12px] text-primary-600 font-medium hover:text-primary-700"
            >
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { type: 'view', pkg: '季度财务报告 2024Q2', desc: '来自 上海 的用户扫码查看', time: '2 分钟前', icon: '👁️' },
              { type: 'create', pkg: '产品设计稿 V3.2', desc: '你创建了新的包裹', time: '1 小时前', icon: '📦' },
              { type: 'storage', pkg: '储存空间', desc: '你添加了 5GB 储存空间', time: '昨天', icon: '💾' },
              { type: 'expire', pkg: '婚礼邀请函 - 电子版本', desc: '包裹已过期', time: '3 天前', icon: '⏰' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-gray-800 truncate">{activity.pkg}</div>
                  <div className="text-[12px] text-gray-400">{activity.desc}</div>
                </div>
                <span className="text-[12px] text-gray-300 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
