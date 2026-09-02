import type { Post, Language } from '@/lib/types'

interface ArticleJsonLdProps {
  post: Post
  language: Language
}

export default function ArticleJsonLd({ post, language }: ArticleJsonLdProps) {
  const isArabic = language === 'ar'
  const baseUrl = 'https://aboelmakarem.pro'

  const categoryName = post.category
    ? (isArabic ? post.category.name_ar : post.category.name_en)
    : post.post_type
  const title = isArabic ? post.title_ar : post.title_en
  const postUrl = isArabic ? `${baseUrl}/blog/${post.slug}?lang=ar` : `${baseUrl}/blog/${post.slug}`

  // Posts without a featured image fall back to the dynamic OG route (the same
  // image the page's og:image uses), never to a static file that may not exist.
  const ogParams = new URLSearchParams({
    title,
    lang: language,
    ...(categoryName && { category: categoryName }),
    ...(post.published_at && { date: post.published_at }),
  })
  const image = post.featured_image || `${baseUrl}/api/og?${ogParams.toString()}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: isArabic ? post.excerpt_ar : post.excerpt_en,
    image,
    url: postUrl,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    // Chained to the site-wide Person / Organization nodes emitted by the root layout.
    author: {
      '@type': 'Person',
      '@id': `${baseUrl}/#person`,
      name: 'Abo-Elmakarem Shohoud',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'Ailigent',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    inLanguage: isArabic ? 'ar' : 'en',
    articleSection: categoryName,
    keywords: post.seo_keywords?.length ? post.seo_keywords.join(', ') : post.post_type,
    wordCount: (isArabic ? post.content_ar : post.content_en).split(/\s+/).length,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
