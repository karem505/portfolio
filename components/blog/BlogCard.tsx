'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { HiArrowRight, HiClock, HiNewspaper, HiLightBulb } from 'react-icons/hi2'
import { useLanguage, translations } from '@/lib/LanguageContext'
import { postPath } from '@/lib/postPath'
import { localizePost, formatDate } from '@/lib/blog'
import type { Post } from '@/lib/types'

interface BlogCardProps {
  post: Post
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const { language, t, dir } = useLanguage()
  const localized = localizePost(post, language)

  const postTypeLabels: Record<string, { en: string; ar: string }> = {
    news: translations.news,
    'how-to': translations['how-to'],
    tutorial: translations.tutorial,
    analysis: translations.analysis,
    'tool-review': translations['tool-review'],
    insights: translations.insights,
    trending: translations.trending,
  }

  const PostTypeIcon = post.post_type === 'news' ? HiNewspaper : HiLightBulb

  return (
    <article
      className="group relative enter-up"
      style={{ '--enter-delay': `${Math.min(index, 8) * 100}ms` } as CSSProperties}
      dir={dir}
    >
      <Link href={postPath(post.slug, language)}>
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-surface border border-white/5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          {/* Cover Image */}
          <div className="relative aspect-video overflow-hidden">
            {localized.featuredImage ? (
              <Image
                src={localized.featuredImage}
                alt={localized.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <PostTypeIcon className="w-16 h-16 text-primary/30" />
              </div>
            )}
            {/* Post Type Badge */}
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/90 text-white backdrop-blur-sm flex items-center gap-1.5">
                <PostTypeIcon className="w-3.5 h-3.5" />
                {postTypeLabels[post.post_type] ? t(postTypeLabels[post.post_type].en, postTypeLabels[post.post_type].ar) : post.post_type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Meta */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted mb-2 sm:mb-3">
              <span className="flex items-center gap-1.5">
                <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {localized.readingTime} {t(translations.minRead.en, translations.minRead.ar)}
              </span>
              <span>{formatDate(localized.publishedAt, language)}</span>
            </div>

            {/* Title */}
            <h2 className="font-display font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white group-hover:text-primary transition-colors line-clamp-2">
              {localized.title}
            </h2>

            {/* Excerpt */}
            <p className="text-muted text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
              {localized.excerpt}
            </p>

            {/* Category Badge */}
            {post.category && (
              <div className="mb-3 sm:mb-4">
                <span className="px-2 sm:px-2.5 py-1 text-xs rounded-md bg-white/5 text-muted">
                  {language === 'ar' ? post.category.name_ar : post.category.name_en}
                </span>
              </div>
            )}

            {/* Read More */}
            <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
              {t(translations.readMore.en, translations.readMore.ar)}
              <HiArrowRight className={`w-4 h-4 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
