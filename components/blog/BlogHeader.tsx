'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { HiHome, HiNewspaper } from 'react-icons/hi2'
import LanguageToggle from './LanguageToggle'
import { useLanguage, translations } from '@/lib/LanguageContext'

export default function BlogHeader() {
  const { t, dir } = useLanguage()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between" dir={dir}>
          {/* Logo / Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted hover:text-white transition-colors"
            >
              <HiHome className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-2 text-primary">
              <HiNewspaper className="w-5 h-5" />
              <span className="font-display font-bold">
                {t(translations.blog.en, translations.blog.ar)}
              </span>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="enter-fade" style={{ '--enter-delay': '200ms' } as CSSProperties}>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
