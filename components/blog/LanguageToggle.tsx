'use client'

import { useLanguage } from '@/lib/LanguageContext'

/** EN / ع switch. The highlight is one element that slides between the two
 *  equal-width buttons (CSS transition), so the blog route ships no Framer. */
export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const ar = language === 'ar'

  return (
    <div
      role="group"
      aria-label="Language"
      dir="ltr"
      className="relative grid grid-cols-2 p-1 rounded-full bg-surface border border-white/10"
    >
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-300 ease-out"
        style={{ transform: ar ? 'translateX(100%)' : 'translateX(0)' }}
      />
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={!ar}
        className={`relative z-10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !ar ? 'text-white' : 'text-muted hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('ar')}
        aria-pressed={ar}
        lang="ar"
        className={`relative z-10 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          ar ? 'text-white' : 'text-muted hover:text-white'
        }`}
      >
        ع
      </button>
    </div>
  )
}
