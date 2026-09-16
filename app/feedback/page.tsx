'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n/LanguageContext'

const feedbackTypeSeeds = [
  { key: 'bug', icon: 'bug' },
  { key: 'feature', icon: 'lightbulb' },
  { key: 'experience', icon: 'heart' },
  { key: 'other', icon: 'chat' },
]

function TypeIcon({ type }) {
  const icons = {
    bug: <path d="M12 2v2M9 4l-3 5 3 2M15 4l3 5-3 2M5 14a7 7 0 0014 0M9 14a1 1 0 100-2 1 1 0 000 2zM15 14a1 1 0 100-2 1 1 0 000 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
    lightbulb: <path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 13c1 1 1 2 1 3h6c0-1 0-2 1-3a7 7 0 00-4-13z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
    heart: <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6 5c2 0 3.5 1 6 3.5C14.5 6 16 5 18 5c3.5 0 5 4 3.5 7-2.5 4.5-9.5 9-9.5 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
    chat: <path d="M21 12a8 8 0 01-12 7l-5 1 1-5a8 8 0 1116-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  }
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">{icons[type]}</svg>
}

export default function Feedback() {
  const { t } = useI18n()
  const [selectedType, setSelectedType] = useState('bug')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const feedbackTypes = feedbackTypeSeeds.map((item) => ({
    ...item,
    label: t(`feedback.types.${item.key}`),
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-[24px] font-semibold text-gray-900 mb-2">{t('feedback.submitted')}</h2>
          <p className="text-[14px] text-gray-500 mb-8">{t('feedback.submittedHint')}</p>
          <button
            onClick={() => { setSubmitted(false); setContent(''); setEmail(''); setRating(0) }}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[14px] font-semibold rounded-full shadow-apple-blue transition-all duration-300 ease-apple"
          >
            {t('feedback.writeAnother')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold text-gray-900 tracking-tight">{t('feedback.title')}</h1>
          <p className="text-[14px] text-gray-500 mt-2">{t('feedback.subtitle')}</p>
        </div>

        <div className="bg-white rounded-apple-lg border border-gray-200/70 shadow-apple-sm p-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 反馈类型 */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-3">{t('feedback.typeLabel')}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {feedbackTypes.map((ft) => (
                  <button
                    key={ft.key}
                    type="button"
                    onClick={() => setSelectedType(ft.key)}
                    className={`flex flex-col items-center gap-2 py-3.5 rounded-apple border transition-all duration-300 ease-apple ${
                      selectedType === ft.key
                        ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500/20'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <TypeIcon type={ft.icon} />
                    <span className="text-[12px] font-medium">{ft.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 满意度评分 */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-3">{t('feedback.ratingLabel')}</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <svg className={`w-8 h-8 ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z" />
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-[13px] text-gray-400 ml-2">
                    {t('feedback.ratings')[rating]}
                  </span>
                )}
              </div>
            </div>

            {/* 反馈内容 */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('feedback.contentLabel')}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
                placeholder={t('feedback.contentPlaceholder')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-apple text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
              />
              <div className="text-right text-[12px] text-gray-400 mt-1">{content.length} / 500</div>
            </div>

            {/* 联系邮箱 */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">{t('feedback.emailLabel')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('feedback.emailPlaceholder')}
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-apple text-[14px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            {/* 提交 */}
            <button
              type="submit"
              className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white text-[15px] font-semibold rounded-full shadow-apple-blue hover:shadow-lg transition-all duration-300 ease-apple"
            >
              {t('feedback.submit')}
            </button>
          </form>
        </div>

        {/* 其他联系方式 */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[13px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('feedback.contactEmail')}
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M8 10h8M8 14h5M21 12a8 8 0 01-12 7l-5 1 1-5a8 8 0 1116-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('feedback.onlineChat')}
          </div>
        </div>
      </div>
    </div>
  )
}
