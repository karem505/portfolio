import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog'
import BlogPostClient from './BlogPostClient'
import ArticleJsonLd from '@/components/blog/ArticleJsonLd'
import { ServiceBreadcrumbJsonLd } from '@/components/JsonLd'
import { LanguageProvider } from '@/lib/LanguageContext'
import type { Language } from '@/lib/types'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: 'en' | 'ar' }>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params
  const { lang } = await searchParams
  const post = await getPostBySlug(slug)
  const language = lang || 'en'

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const isArabic = language === 'ar'
  const title = isArabic ? post.title_ar : post.title_en
  const description: string | undefined = (isArabic
    ? post.meta_description_ar || post.excerpt_ar
    : post.meta_description_en || post.excerpt_en) || undefined
  const baseUrl = 'https://aboelmakarem.pro'

  const categoryName = post.category
    ? (isArabic ? post.category.name_ar : post.category.name_en)
    : ''

  const ogImage = post.featured_image || (() => {
    const ogParams = new URLSearchParams({
      title,
      lang: language,
      ...(categoryName && { category: categoryName }),
      ...(post.published_at && { date: post.published_at }),
    })
    return `${baseUrl}/api/og?${ogParams.toString()}`
  })()

  const postUrl = isArabic
    ? `${baseUrl}/blog/${post.slug}?lang=ar`
    : `${baseUrl}/blog/${post.slug}`

  return {
    title,
    description,
    authors: [{ name: 'Abo-Elmakarem Shohoud' }],
    keywords: post.seo_keywords?.length ? post.seo_keywords : [post.post_type],
    robots: post.seo_noindex
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : { index: true, follow: true },
    alternates: {
      canonical: postUrl,
      languages: {
        en: `${baseUrl}/blog/${post.slug}`,
        ar: `${baseUrl}/blog/${post.slug}?lang=ar`,
        'x-default': `${baseUrl}/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: ['Abo-Elmakarem Shohoud'],
      locale: isArabic ? 'ar_EG' : 'en_US',
      alternateLocale: isArabic ? 'en_US' : 'ar_EG',
      images: [
        {
          url: ogImage,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@karem_shohud',
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

// The route renders per request (generateMetadata reads searchParams), so the
// page can render the requested language on the server: `?lang=ar` ships Arabic
// HTML, schema and breadcrumbs to crawlers instead of English that flips after
// hydration.
export default async function BlogPostPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { lang } = await searchParams
  const language: Language = lang === 'ar' ? 'ar' : 'en'
  const isArabic = language === 'ar'
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug, post.category_id, 3)

  const baseUrl = 'https://aboelmakarem.pro'
  const postUrl = isArabic ? `${baseUrl}/blog/${post.slug}?lang=ar` : `${baseUrl}/blog/${post.slug}`

  return (
    <>
      <ArticleJsonLd post={post} language={language} />
      <ServiceBreadcrumbJsonLd
        items={[
          { name: isArabic ? 'الرئيسية' : 'Home', url: baseUrl },
          { name: isArabic ? 'المدونة' : 'Blog', url: `${baseUrl}/blog` },
          { name: isArabic ? post.title_ar : post.title_en, url: postUrl },
        ]}
      />
      <LanguageProvider initialLanguage={language}>
        <div lang={language} dir={isArabic ? 'rtl' : 'ltr'}>
          <BlogPostClient post={post} relatedPosts={relatedPosts} />
        </div>
      </LanguageProvider>
    </>
  )
}
