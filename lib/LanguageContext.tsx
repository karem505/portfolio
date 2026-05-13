'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Language } from './types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (en: string, ar: string) => string
  dir: 'ltr' | 'rtl'
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function applyHtmlAttrs(lang: Language) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang') as Language

    let initial: Language = 'en'
    if (urlLang && ['en', 'ar'].includes(urlLang)) {
      initial = urlLang
    } else {
      const storedLang = localStorage.getItem('blog-language') as Language
      if (storedLang && ['en', 'ar'].includes(storedLang)) {
        initial = storedLang
      }
    }
    setLanguageState(initial)
    applyHtmlAttrs(initial)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('blog-language', lang)
    applyHtmlAttrs(lang)

    // Update URL without reload
    const url = new URL(window.location.href)
    url.searchParams.set('lang', lang)
    window.history.pushState({}, '', url)
  }

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
