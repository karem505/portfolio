'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import type { Language } from './types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (en: string, ar: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const isLanguage = (v: unknown): v is Language => v === 'en' || v === 'ar'

function applyHtmlAttrs(lang: Language) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

/**
 * Root provider (app/layout.tsx): renders 'en' on the server, then resolves the
 * client language once from `?lang` / localStorage.
 *
 * Scoped provider: a server page that knows the language from its searchParams
 * (blog posts) mounts `<LanguageProvider initialLanguage>` around its content so
 * the SSR HTML is already in that language for crawlers. After mount it mirrors
 * every later change of the root provider (the header toggle) and delegates
 * `setLanguage` to it, so the whole page still switches together.
 */
export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode
  initialLanguage?: Language
}) {
  const parent = useContext(LanguageContext)
  const hasParent = parent !== undefined
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? parent?.language ?? 'en')

  // Root only: resolve the client-side language once.
  useEffect(() => {
    if (hasParent) return
    const urlLang = new URLSearchParams(window.location.search).get('lang')
    let initial: Language = 'en'
    if (isLanguage(urlLang)) {
      initial = urlLang
    } else {
      const storedLang = localStorage.getItem('blog-language')
      if (isLanguage(storedLang)) initial = storedLang
    }
    setLanguageState(initial)
    applyHtmlAttrs(initial)
  }, [hasParent])

  // Scoped only: follow the parent's changes after mount. The first run is
  // skipped so the server-rendered language survives hydration (the parent
  // still reads 'en' until its own effect has run).
  const parentLanguage = parent?.language
  const seenParent = useRef(parentLanguage)
  useEffect(() => {
    if (parentLanguage === undefined) return
    if (seenParent.current !== parentLanguage) setLanguageState(parentLanguage)
    seenParent.current = parentLanguage
  }, [parentLanguage])

  const setLanguageRoot = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('blog-language', lang)
    applyHtmlAttrs(lang)

    // Update URL without reload
    const url = new URL(window.location.href)
    url.searchParams.set('lang', lang)
    window.history.pushState({}, '', url)
  }
  const setLanguage = parent ? parent.setLanguage : setLanguageRoot

  const t = (en: string, ar: string) => (language === 'ar' ? ar : en)
  const dir = language === 'ar' ? 'rtl' : 'ltr'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

// Static translations for common UI elements
export const translations = {
  blog: { en: 'Blog', ar: 'المدونة' },
  readMore: { en: 'Read More', ar: 'اقرأ المزيد' },
  minRead: { en: 'min read', ar: 'دقيقة قراءة' },
  search: { en: 'Search articles...', ar: 'ابحث في المقالات...' },
  categories: { en: 'Categories', ar: 'التصنيفات' },
  recentPosts: { en: 'Recent Posts', ar: 'أحدث المقالات' },
  relatedPosts: { en: 'Related Posts', ar: 'مقالات ذات صلة' },
  sharePost: { en: 'Share this post', ar: 'شارك هذا المقال' },
  tableOfContents: { en: 'Table of Contents', ar: 'جدول المحتويات' },
  noResults: { en: 'No posts found', ar: 'لا توجد مقالات' },
  loadMore: { en: 'Load More', ar: 'تحميل المزيد' },
  backToBlog: { en: 'Back to Blog', ar: 'العودة للمدونة' },
  publishedOn: { en: 'Published on', ar: 'نشر في' },
  byAuthor: { en: 'by', ar: 'بواسطة' },
  news: { en: 'News', ar: 'أخبار' },
  'how-to': { en: 'How-To', ar: 'دليل عملي' },
  tutorial: { en: 'Tutorial', ar: 'درس تعليمي' },
  analysis: { en: 'Analysis', ar: 'تحليل' },
  'tool-review': { en: 'Tool Review', ar: 'مراجعة أداة' },
  insights: { en: 'Insights', ar: 'رؤى' },
  trending: { en: 'Trending', ar: 'رائج' },
  all: { en: 'All', ar: 'الكل' },
}
