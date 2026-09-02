'use client'

import { useState } from 'react'
import { HiMail, HiCheck, HiExclamation } from 'react-icons/hi'

type Language = 'en' | 'ar'

interface NewsletterProps {
  language?: Language
  className?: string
}

const translations = {
  en: {
    title: 'Stay Updated',
    subtitle: 'Get the latest AI & automation insights delivered to your inbox',
    placeholder: 'Enter your email',
    button: 'Subscribe',
    success: 'Welcome! You are now subscribed.',
    error: 'Something went wrong. Please try again.',
    invalid: 'Please enter a valid email.',
    existing: 'You are already subscribed!',
  },
  ar: {
    title: 'ابق على اطلاع',
    subtitle: 'احصل على أحدث رؤى الذكاء الاصطناعي والأتمتة في بريدك',
    placeholder: 'أدخل بريدك الإلكتروني',
    button: 'اشترك',
    success: 'مرحباً! أنت الآن مشترك.',
    error: 'حدث خطأ. حاول مرة أخرى.',
    invalid: 'الرجاء إدخال بريد إلكتروني صحيح.',
    existing: 'أنت مشترك بالفعل!',
  },
}

export function Newsletter({ language = 'en', className = '' }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const t = translations[language]
  const isRTL = language === 'ar'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage(t.invalid)
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(t.success)
        setEmail('')
      } else if (response.status === 409) {
        setStatus('error')
        setMessage(t.existing)
      } else {
        setStatus('error')
        setMessage(data.message || t.error)
      }
    } catch {
      setStatus('error')
      setMessage(t.error)
    }
  }

  return (
    <div className={`w-full ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t.title}</h3>
        <p className="text-gray-400 text-sm md:text-base mb-6">{t.subtitle}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiMail className={`absolute top-1/2 -translate-y-1/2 text-gray-400 text-lg ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status !== 'idle') setStatus('idle')
              }}
              placeholder={t.placeholder}
              disabled={status === 'loading'}
              className={`w-full bg-white/5 border border-white/10 rounded-xl py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/25"
          >
            {status === 'loading' ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            ) : t.button}
          </button>
        </form>

        {status !== 'idle' && status !== 'loading' && (
          <div
            role="status"
            className={`mt-4 flex items-center gap-2 text-sm enter-down ${
              status === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {status === 'success' ? <HiCheck className="text-lg" /> : <HiExclamation className="text-lg" />}
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default Newsletter
