'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/LanguageContext'

const initialMembers = [
  { id: 1, name: '陈思远', email: 'chen.sy@qrsecu.com', role: 'admin', status: 'active', avatar: 'bg-primary-500', joined: '2026-01-15' },
  { id: 2, name: '林晚晴', email: 'lin.wq@qrsecu.com', role: 'editor', status: 'active', avatar: 'bg-emerald-500', joined: '2026-02-20' },
  { id: 3, name: '苏明哲', email: 'su.mz@qrsecu.com', role: 'editor', status: 'active', avatar: 'bg-amber-500', joined: '2026-03-08' },
  { id: 4, name: '周慕白', email: 'zhou.mb@qrsecu.com', role: 'viewer', status: 'pending', avatar: 'bg-rose-500', joined: '2026-08-01' },
  { id: 5, name: '叶知秋', email: 'ye.zq@qrsecu.com', role: 'viewer', status: 'active', avatar: 'bg-indigo-500', joined: '2026-05-12' },
]

function StatCard({ icon, label, value, sub, trend }) {
  return (
    <div className="bg-white rounded-apple-lg border border-gray-200/70 p-5 shadow-apple-sm hover:shadow-apple-md transition-all duration-500 ease-apple">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-apple bg-gray-50 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        {trend && (
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>
        )}
      </div>
      <div className="mt-4">
        <div className="text-[28px] font-semibold text-gray-900 tracking-tight">{value}</div>
        <div className="text-[13px] text-gray-500 mt-0.5">{label}</div>
      </div>
      {sub && <div className="text-[12px] text-gray-400 mt-2">{sub}</div>}
    </div>
  )
}

export default function Enterprise() {
  const { t } = useI18n()
  const [members, setMembers] = useState(initialMembers)
  const memberLimit = 20
  const [editingMember, setEditingMember] = useState(false)
  const [memberDraft, setMemberDraft] = useState('20')
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  // 自定义品牌状态
  const [brandName, setBrandName] = useState('Qrsecu')
  const [brandColor, setBrandColor] = useState('#3b82f6')
  const [customDomain, setCustomDomain] = useState('')
  const [logoUploaded, setLogoUploaded] = useState(false)

  const usedStorage = 8.4 // GB
  const storageLimit = 100 // GB
  const storagePct = Math.round((usedStorage / storageLimit) * 100)

  const saveMember = () => {
    setEditingMember(false)
  }

  const addMember = () => {
    if (!newName.trim() || !newEmail.trim()) return
    const colors = ['bg-primary-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500', 'bg-violet-500']
    setMembers([
      {
        id: Date.now(),
        name: newName.trim(),
        email: newEmail.trim(),
        role: 'viewer',
        status: 'pending',
        avatar: colors[members.length % colors.length],
        joined: new Date().toISOString().slice(0, 10),
      },
      ...members,
    ])
    setNewName('')
    setNewEmail('')
    setAddOpen(false)
  }

  const removeMember = (id) => setMembers((prev) => prev.filter((m) => m.id !== id))

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 顶部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight">{t('enterprise.title')}</h1>
            <p className="text-[14px] text-gray-500 mt-1">{t('enterprise.subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {t('enterprise.logout')}
            </Link>
            <span className="inline-flex items-center px-3 py-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-[13px] font-medium">
              <svg className="w-3.5 h-3.5 mr-1.5" viewBox="0 0 24 24" fill="none">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {t('enterprise.badge')}
            </span>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            label={t('enterprise.stats.members')}
            value={`${members.length} / ${memberLimit}`}
            sub={`${t('enterprise.statsSub.membersRemaining')} ${memberLimit - members.length} ${t('enterprise.memberLimitSuffix')}`}
          />
          <StatCard
            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>}
            label={t('enterprise.stats.packages')}
            value="128"
            sub={t('enterprise.statsSub.packagesUnlimited')}
            trend="+12 本月"
          />
          <StatCard
            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M5 7h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
            label={t('enterprise.stats.recycle')}
            value="30 天"
            sub={t('enterprise.statsSub.recycleDays')}
          />
          <StatCard
            icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.5" /></svg>}
            label={t('enterprise.stats.storage')}
            value={`${usedStorage} GB`}
            sub={`${t('enterprise.statsSub.storageTotal')} ${storageLimit} GB · ${storagePct}%`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧列 */}
          <div className="lg:col-span-1 space-y-4">
            {/* 配额设置 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-5">{t('enterprise.quota')}</h2>
              <div className="space-y-5">
                {/* 成员上限 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-medium text-gray-600">{t('enterprise.memberLimit')}</label>
                    {editingMember ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={memberDraft}
                          onChange={(e) => setMemberDraft(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-20 h-8 px-2 text-[13px] text-right bg-gray-50 border border-gray-200 rounded-apple focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                        />
                        <button onClick={saveMember} className="text-[12px] text-primary-600 font-medium hover:text-primary-700">{t('enterprise.save')}</button>
                        <button onClick={() => setEditingMember(false)} className="text-[12px] text-gray-400 hover:text-gray-600">{t('enterprise.cancel')}</button>
                      </div>
                    ) : (
                      <button onClick={() => { setMemberDraft(String(memberLimit)); setEditingMember(true) }} className="text-[12px] text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none"><path d="M11 4h-7a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-7M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {t('enterprise.edit')}
                      </button>
                    )}
                  </div>
                  <div className="text-[24px] font-semibold text-gray-900">{memberLimit} <span className="text-[13px] text-gray-400 font-normal">{t('enterprise.memberLimitSuffix')}</span></div>
                </div>
                {/* 包裹上限 - 无限 */}
                <div className="pt-5 border-t border-gray-100">
                  <label className="block text-[13px] font-medium text-gray-600 mb-2">{t('enterprise.packageLimit')}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-[24px] font-semibold text-gray-900">{t('enterprise.unlimited')}</span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[11px] font-medium rounded-full">{t('enterprise.badge')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 存储进度 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-4">{t('enterprise.storageUsage')}</h2>
              <div className="flex items-end justify-between mb-2">
                <span className="text-[24px] font-semibold text-gray-900">{usedStorage} <span className="text-[13px] text-gray-400 font-normal">GB</span></span>
                <span className="text-[12px] text-gray-400">/ {storageLimit} GB</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-apple" style={{ width: `${storagePct}%` }}></div>
              </div>
              <p className="text-[12px] text-gray-400 mt-3">{t('enterprise.remaining')} {storageLimit - usedStorage} GB {t('enterprise.available')}</p>
            </div>

            {/* 自定义品牌 */}
            <div className="bg-white rounded-apple-lg border border-gray-200/70 p-6 shadow-apple-sm">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-5">{t('enterprise.customBrand')}</h2>
              <div className="space-y-5">
                {/* Logo 上传 */}
                <div>
                  <label className="block text-[13px] font-medium text-gray-600 mb-2">{t('enterprise.brandLogo')}</label>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-apple flex items-center justify-center ${logoUploaded ? 'bg-gray-100' : 'bg-gradient-to-br from-primary-500 to-primary-700'}`}>
                      {logoUploaded ? (
                        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M3 16l5-5 5 5 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                        </svg>
                      )}
                    </div>
                    <button
                      onClick={() => setLogoUploaded(!logoUploaded)}
                      className="px-3 py-1.5 text-[12px] font-medium text-primary-600 border border-primary-200 hover:bg-primary-50 rounded-full transition-colors"
                    >
                      {logoUploaded ? t('enterprise.changeLogo') : t('enterprise.uploadLogo')}
                    </button>
                  </div>
                </div>

                {/* 品牌名称 */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-[13px] font-medium text-gray-600 mb-2">{t('enterprise.brandName')}</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full h-10 px-3 text-[13px] bg-gray-50 border border-gray-200 rounded-apple focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                {/* 品牌主色 */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-[13px] font-medium text-gray-600 mb-2">{t('enterprise.brandColor')}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-10 rounded-apple border border-gray-200 cursor-pointer"
                    />
                    <span className="text-[13px] text-gray-500 font-mono">{brandColor}</span>
                  </div>
                </div>

                {/* 自定义域名 */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-[13px] font-medium text-gray-600 mb-2">{t('enterprise.customDomain')}</label>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder={t('enterprise.customDomainPlaceholder')}
                    className="w-full h-10 px-3 text-[13px] bg-gray-50 border border-gray-200 rounded-apple focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-gray-400"
                  />
                  <p className="text-[11px] text-gray-400 mt-1.5">{t('enterprise.customDomainHint')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 团队成员 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900">{t('enterprise.teamMembers')}</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">{t('enterprise.teamSubtitle')} {members.length} {t('enterprise.memberLimitSuffix')} · {members.filter((m) => m.status === 'active').length} {t('enterprise.active')} · {t('enterprise.memberLimit')} {memberLimit} {t('enterprise.memberLimitSuffix')}</p>
                </div>
                <button
                  onClick={() => setAddOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-full shadow-apple-blue transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  {t('enterprise.addMember')}
                </button>
              </div>

              {addOpen && (
                <div className="p-6 bg-primary-50/40 border-b border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={t('enterprise.namePlaceholder')}
                      className="h-10 px-3 bg-white border border-gray-200 rounded-apple text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                    <input
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder={t('enterprise.emailPlaceholder')}
                      className="h-10 px-3 bg-white border border-gray-200 rounded-apple text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button onClick={() => setAddOpen(false)} className="px-3 py-1.5 text-[13px] text-gray-500 hover:text-gray-700">{t('enterprise.cancelBtn')}</button>
                    <button onClick={addMember} className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[13px] font-medium rounded-full transition-all">{t('enterprise.sendInvite')}</button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-100">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/60 transition-colors group">
                    <div className={`w-10 h-10 rounded-full ${m.avatar} flex items-center justify-center text-white text-[14px] font-semibold flex-shrink-0`}>
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-medium text-gray-900">{m.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          m.role === 'admin' ? 'bg-primary-50 text-primary-700' : m.role === 'editor' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>{t(`enterprise.roles.${m.role}`)}</span>
                      </div>
                      <div className="text-[12px] text-gray-400 mt-0.5">{m.email} · {t('enterprise.joined')} {m.joined}</div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      m.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {t(`enterprise.status.${m.status}`)}
                    </span>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="w-8 h-8 inline-flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
