'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import { BlogCard } from '@/components/blog'
import { useLanguage, translations } from '@/lib/LanguageContext'
import { getPosts, searchPosts } from '@/lib/blog'
import type { Post } from '@/lib/types'

function BlogContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || undefined
  const { language, t, dir } = useLanguage()

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      const result = await getPosts(page, category)
      setPosts(result.posts)
      setTotalPages(result.totalPages)
      setLoading(false)
    }
    loadPosts()
  }, [page, category])

  async function handleSearch(query: string) {
    setSearchQuery(query)
    if (query.trim()) {
      setLoading(true)
      const results = await searchPosts(query, language)
      setPosts(results)
      setLoading(false)
    } else {
      const result = await getPosts(1, category)
      setPosts(result.posts)
      setTotalPages(result.totalPages)
      setPage(1)
    }
  }

  function clearSearch() {
    setSearchQuery('')
    handleSearch('')
  }

  const categoryLabels: Record<string, { en: string; ar: string }> = {
    news: translations.news,
    'how-to': translations['how-to'],
    tutorial: translations.tutorial,
    insights: translations.insights,
  }

  return (
    <div dir={dir}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
          {category && categoryLabels[category]
            ? t(categoryLabels[category].en, categoryLabels[category].ar)
            : t(translations.blog.en, translations.blog.ar)}
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          {t(
            'Latest insights on AI, automation, and software development.',
            'أحدث الرؤى حول الذكاء الاصطناعي والأتمتة وتطوير البرمجيات.'
          )}
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative max-w-md">
          <HiMagnifyingGlass className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t(translations.search.en, translations.search.ar)}
            className="w-full pl-12 rtl:pl-4 rtl:pr-12 pr-10 py-3 rounded-xl bg-surface border border-white/10 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-surface border border-white/5 animate-pulse"
            >
              <div className="aspect-video bg-white/5" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-6 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-muted text-lg">
            {t(translations.noResults.en, translations.noResults.ar)}
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!searchQuery && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-2 mt-12"
        >
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                page === i + 1
                  ? 'bg-primary text-white'
                  : 'bg-surface text-muted hover:text-white hover:bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </motion.div>
      )}

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden mt-12 pt-8 border-t border-white/10">
        <h3 className="font-display font-bold text-lg mb-4">
          {t(translations.categories.en, translations.categories.ar)}
        </h3>
        <div className="flex flex-wrap gap-2">
          <a
            href="/blog"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !category
                ? 'bg-primary text-white'
                : 'bg-surface text-muted hover:text-white'
            }`}
          >
            {t(translations.all.en, translations.all.ar)}
          </a>
          {Object.entries(categoryLabels).map(([key, value]) => (
            <a
              key={key}
              href={`/blog?category=${key}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === key
                  ? 'bg-primary text-white'
                  : 'bg-surface text-muted hover:text-white'
              }`}
            >
              {t(value.en, value.ar)}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function BlogLoadingFallback() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="mb-12">
        <div className="h-12 bg-surface rounded w-48 mb-4 animate-pulse" />
        <div className="h-6 bg-surface rounded w-96 animate-pulse" />
      </div>

      {/* Search Skeleton */}
      <div className="mb-8">
        <div className="h-12 bg-surface rounded-xl w-full max-w-md animate-pulse" />
      </div>

      {/* Posts Grid Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-surface border border-white/5 animate-pulse"
          >
            <div className="aspect-video bg-white/5" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-white/5 rounded w-1/4" />
              <div className="h-6 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BlogPageClient() {
  return (
    <Suspense fallback={<BlogLoadingFallback />}>
      <BlogContent />
    </Suspense>
  )
}
