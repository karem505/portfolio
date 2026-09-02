'use client'

import { Suspense, useEffect, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'next/navigation'
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2'
import { BlogCard } from '@/components/blog'
import { paginationWindow } from '@/lib/pagination'
import { useLanguage, translations } from '@/lib/LanguageContext'
import { getPosts, searchPosts } from '@/lib/blog'
import type { Post } from '@/lib/types'

const categoryLabels: Record<string, { en: string; ar: string }> = {
  news: translations.news,
  'how-to': translations['how-to'],
  tutorial: translations.tutorial,
  insights: translations.insights,
}

/**
 * Page intro. Kept outside the useSearchParams() Suspense boundary so the h1 and
 * lead are in the server HTML (inside the boundary they would render as the
 * loading skeleton for crawlers).
 */
function BlogIntro() {
  const { t, dir } = useLanguage()
  return (
    <div dir={dir} className="mb-8 sm:mb-12 enter-up">
      <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">
        {t(translations.blog.en, translations.blog.ar)}
      </h1>
      <p className="text-muted text-base sm:text-lg max-w-2xl">
        {t(
          'Latest insights on AI, automation, and software development.',
          'أحدث الرؤى حول الذكاء الاصطناعي والأتمتة وتطوير البرمجيات.'
        )}
      </p>
    </div>
  )
}

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

  return (
    <div dir={dir}>
      {/* Active category (the h1 lives in BlogIntro, outside the Suspense boundary) */}
      {category && categoryLabels[category] && (
        <p className="mb-6 -mt-4 text-sm text-muted">
          {t('Category:', 'التصنيف:')}{' '}
          <span className="text-white">{t(categoryLabels[category].en, categoryLabels[category].ar)}</span>
        </p>
      )}

      {/* Search Bar */}
      <div className="mb-8 enter-up" style={{ '--enter-delay': '100ms' } as CSSProperties}>
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
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl sm:rounded-2xl bg-surface border border-white/5 animate-pulse"
            >
              <div className="aspect-video bg-white/5" />
              <div className="p-4 sm:p-6 space-y-3">
                <div className="h-4 bg-white/5 rounded w-1/4" />
                <div className="h-6 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 enter-fade">
          <p className="text-muted text-lg">
            {t(translations.noResults.en, translations.noResults.ar)}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}

      {/* Pagination: windowed (first · gap · siblings · gap · last) so it fits
          one row on a phone; the full 20+ button row used to force the page
          wider than the viewport. */}
      {!searchQuery && totalPages > 1 && (
        <nav
          aria-label={t('Pagination', 'ترقيم الصفحات')}
          className="flex flex-wrap justify-center items-center gap-2 mt-12 enter-fade"
          style={{ '--enter-delay': '300ms' } as CSSProperties}
        >
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page <= 1}
            aria-label={t('Previous page', 'الصفحة السابقة')}
            className="w-10 h-10 rounded-lg font-medium transition-colors bg-surface text-muted hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-muted"
          >
            {language === 'ar' ? '›' : '‹'}
          </button>
          {paginationWindow(page, totalPages).map((item, i) =>
            item === 'gap' ? (
              <span key={`gap-${i}`} aria-hidden="true" className="w-6 text-center text-muted select-none">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                aria-current={page === item ? 'page' : undefined}
                aria-label={t(`Page ${item}`, `الصفحة ${item}`)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors tabular-nums ${
                  page === item
                    ? 'bg-primary text-white'
                    : 'bg-surface text-muted hover:text-white hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ),
          )}
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page >= totalPages}
            aria-label={t('Next page', 'الصفحة التالية')}
            className="w-10 h-10 rounded-lg font-medium transition-colors bg-surface text-muted hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-muted"
          >
            {language === 'ar' ? '‹' : '›'}
          </button>
        </nav>
      )}

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
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
      {/* Search Skeleton */}
      <div className="mb-8">
        <div className="h-12 bg-surface rounded-xl w-full max-w-md animate-pulse" />
      </div>

      {/* Posts Grid Skeleton */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl sm:rounded-2xl bg-surface border border-white/5 animate-pulse"
          >
            <div className="aspect-video bg-white/5" />
            <div className="p-4 sm:p-6 space-y-3">
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
    <>
      <BlogIntro />
      <Suspense fallback={<BlogLoadingFallback />}>
        <BlogContent />
      </Suspense>
    </>
  )
}
