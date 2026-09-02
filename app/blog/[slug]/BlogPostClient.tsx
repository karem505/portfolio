'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  HiArrowLeft,
  HiArrowRight,
  HiClock,
  HiCalendar,
  HiUser,
  HiLink,
} from 'react-icons/hi2'
import { FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa'
import { BlogCard, BlogContent, PostCTA } from '@/components/blog'
import { useLanguage, translations } from '@/lib/LanguageContext'
import { postPath } from '@/lib/postPath'
import { localizePost, formatDate } from '@/lib/blog'
import type { Post } from '@/lib/types'

interface BlogPostClientProps {
  post: Post
  relatedPosts: Post[]
}

export default function BlogPostClient({
  post,
  relatedPosts,
}: BlogPostClientProps) {
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

  const shareUrl = `https://aboelmakarem.pro${postPath(post.slug, language)}`
  const shareText = localized.title

  return (
    <>
      <article dir={dir}>
        {/* Breadcrumb (visible) */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs sm:text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                {t('Home', 'الرئيسية')}
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/30">/</li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                {t('Blog', 'المدونة')}
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/30">/</li>
            <li className="text-ash line-clamp-1" aria-current="page">
              {localized.title}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors"
          >
            {language === 'ar' ? (
              <HiArrowRight className="w-5 h-5" />
            ) : (
              <HiArrowLeft className="w-5 h-5" />
            )}
            {t(translations.backToBlog.en, translations.backToBlog.ar)}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Post Type Badge */}
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/20 text-primary mb-4">
            {postTypeLabels[post.post_type]
              ? t(postTypeLabels[post.post_type].en, postTypeLabels[post.post_type].ar)
              : post.post_type}
          </span>

          {/* Title */}
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 leading-tight">
            {localized.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-muted">
            <span className="flex items-center gap-2">
              <HiUser className="w-5 h-5" />
              Abo-Elmakarem Shohoud
            </span>
            <span className="flex items-center gap-2">
              <HiCalendar className="w-5 h-5" />
              {formatDate(localized.publishedAt, language)}
            </span>
            <span className="flex items-center gap-2">
              <HiClock className="w-5 h-5" />
              {localized.readingTime} {t(translations.minRead.en, translations.minRead.ar)}
            </span>
          </div>
        </motion.header>

        {/* Cover Image */}
        {localized.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-10"
          >
            <Image
              src={localized.featuredImage}
              alt={localized.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Source Attribution */}
        {post.source_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-muted mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg bg-surface border border-white/5"
          >
            <HiLink className="w-4 h-4" />
            <span>{t('Source:', 'المصدر:')}</span>
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {post.source_title || post.source_url}
            </a>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <BlogContent content={localized.content} />
        </motion.div>

        {/* In-content CTA → service (money) pages: gives every post an internal
            link to /ai-training + /digital-transformation */}
        <PostCTA postType={post.post_type} />

        {/* Author box (E-E-A-T): who wrote this, in the CV's own words, linking to
            the entity hub on the homepage and to LinkedIn. */}
        <aside
          aria-label={t('About the author', 'عن الكاتب')}
          className="mt-10 pt-8 border-t border-white/10 flex items-start gap-4"
        >
          <Image
            src="/profile.jpg"
            alt="Abo-Elmakarem Shohoud"
            width={56}
            height={56}
            className="rounded-full shrink-0 object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm text-muted mb-1">{t('Written by', 'كتبه')}</p>
            <p className="font-display font-bold text-white">
              <Link href="/" className="hover:text-primary transition-colors">
                {t('Abo-Elmakarem Shohoud', 'ابوالمكارم شهود')}
              </Link>
            </p>
            <p className="text-sm text-muted mt-1 leading-relaxed">
              {t(
                'Full-Stack Developer, DevOps Engineer, Scrum Master and Business Analyst at Ailigent, Cairo. Ships AI-powered SaaS (Tornix.ai, Oravex.app, Costra.net) for clients across Egypt, the UAE and Saudi Arabia, and works independently as a digital transformation consultant and corporate AI trainer.',
                'مطور Full-Stack ومهندس DevOps و Scrum Master ومحلل أعمال في Ailigent بالقاهرة. يبني منتجات SaaS مدعومة بالذكاء الاصطناعي (Tornix.ai و Oravex.app و Costra.net) لعملاء في مصر والإمارات والسعودية، ويعمل بشكل مستقل كمستشار تحول رقمي ومدرّب ذكاء اصطناعي للشركات.'
              )}
            </p>
            <p className="text-sm mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/" className="text-primary hover:underline">
                {t('More about me', 'المزيد عني')}
              </Link>
              <a
                href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </aside>

        {/* Category Badge */}
        {post.category && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 pt-8 border-t border-white/10"
          >
            <h3 className="text-sm font-medium text-muted mb-3">
              {t('Category', 'التصنيف')}
            </h3>
            <span className="px-3 py-1.5 text-sm rounded-lg bg-surface text-muted">
              {language === 'ar' ? post.category.name_ar : post.category.name_en}
            </span>
          </motion.div>
        )}

        {/* Share Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 pt-8 border-t border-white/10"
        >
          <h3 className="text-sm font-medium text-muted mb-4">
            {t(translations.sharePost.en, translations.sharePost.ar)}
          </h3>
          <div className="flex gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-white hover:bg-[#1DA1F2] transition-colors"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-white hover:bg-[#0077B5] transition-colors"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-white hover:bg-[#1877F2] transition-colors"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl)
              }}
              className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-muted hover:text-white hover:bg-primary transition-colors"
            >
              <HiLink className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-white/10"
          >
            <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 sm:mb-8">
              {t(translations.relatedPosts.en, translations.relatedPosts.ar)}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <BlogCard key={relatedPost.id} post={relatedPost} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </article>
    </>
  )
}
