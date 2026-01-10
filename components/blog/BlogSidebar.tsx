'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiTag, HiClock, HiNewspaper, HiLightBulb, HiCodeBracket, HiChartBar } from 'react-icons/hi2'
import { useLanguage, translations } from '@/lib/LanguageContext'
import { getCategories, getRecentPosts, formatDate } from '@/lib/blog'
import type { Category, Post } from '@/lib/types'

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  news: HiNewspaper,
  'how-to': HiLightBulb,
  tutorial: HiCodeBracket,
  insights: HiChartBar,
}

export default function BlogSidebar() {
  const { language, t, dir } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])

  useEffect(() => {
    async function loadData() {
      const [cats, posts] = await Promise.all([
        getCategories(),
        getRecentPosts(5),
      ])
      setCategories(cats)
      setRecentPosts(posts)
    }
    loadData()
  }, [])

  return (
    <aside className="space-y-8" dir={dir}>
      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-surface border border-white/5"
      >
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <HiTag className="w-5 h-5 text-primary" />
          {t(translations.categories.en, translations.categories.ar)}
        </h3>
        <div className="space-y-2">
          {/* All Posts */}
          <Link
            href="/blog"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-muted hover:text-white"
          >
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HiNewspaper className="w-4 h-4 text-primary" />
            </span>
            {t(translations.all.en, translations.all.ar)}
          </Link>

          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || HiTag
            return (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-muted hover:text-white"
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: category.color || '#6366f1' }} />
                </span>
                {language === 'ar' ? category.name_ar : category.name_en}
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-surface border border-white/5"
      >
        <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
          <HiClock className="w-5 h-5 text-primary" />
          {t(translations.recentPosts.en, translations.recentPosts.ar)}
        </h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}?lang=${language}`}
              className="block group"
            >
              <h4 className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">
                {language === 'ar' ? post.title_ar : post.title_en}
              </h4>
              <span className="text-xs text-muted">
                {formatDate(post.published_at, language)}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Newsletter CTA (Optional) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20"
      >
        <h3 className="font-display font-bold text-lg mb-2">
          {t('Stay Updated', 'ابق على اطلاع')}
        </h3>
        <p className="text-sm text-muted mb-4">
          {t(
            'Get the latest AI & automation insights delivered to your inbox.',
            'احصل على أحدث رؤى الذكاء الاصطناعي والأتمتة مباشرة إلى بريدك.'
          )}
        </p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          {t('Get in Touch', 'تواصل معي')}
        </Link>
      </motion.div>
    </aside>
  )
}
