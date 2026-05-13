'use client'

import { useLanguage } from '@/lib/LanguageContext'

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-stretch border border-wire font-mono ${compact ? 'text-[0.7rem]' : 'text-xs'}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        aria-label="English"
        className={`px-2.5 ${compact ? 'py-1.5' : 'py-2'} tracking-[0.04em] transition-colors duration-150 ${
          language === 'en'
            ? 'bg-paper text-ink'
            : 'text-ash hover:text-signal'
        }`}
      >
        EN
      </button>
      <span aria-hidden="true" className="w-px bg-wire" />
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={language === 'ar'}
        aria-label="العربية"
        className={`px-2.5 ${compact ? 'py-1.5' : 'py-2'} font-rubik transition-colors duration-150 ${
          language === 'ar'
            ? 'bg-paper text-ink'
            : 'text-ash hover:text-signal'
        }`}
      >
        ع
      </button>
    </div>
  )
}
