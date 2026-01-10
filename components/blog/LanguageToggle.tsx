'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-surface border border-white/10">
      <button
        onClick={() => setLanguage('en')}
        className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          language === 'en' ? 'text-white' : 'text-muted hover:text-white'
        }`}
      >
        {language === 'en' && (
          <motion.div
            layoutId="language-indicator"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          language === 'ar' ? 'text-white' : 'text-muted hover:text-white'
        }`}
      >
        {language === 'ar' && (
          <motion.div
            layoutId="language-indicator"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10">ع</span>
      </button>
    </div>
  )
}
