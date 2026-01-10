import type { Post, Language } from '@/lib/types'

interface ArticleJsonLdProps {
  post: Post
  language: Language
}

export default function ArticleJsonLd({ post, language }: ArticleJsonLdProps) {
  const isArabic = language === 'ar'
  const baseUrl = 'https://abo-elmakarem.netlify.app'

  const categoryName = post.category
    ? (isArabic ? post.category.name_ar : post.category.name_en)
    : post.post_type

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: isArabic ? post.title_ar : post.title_en,
    description: isArabic ? post.excerpt_ar : post.excerpt_en,
    image: post.featured_image || `${baseUrl}/og-blog.png`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: 'Abo-Elmakarem Shohoud',
      url: baseUrl,
      sameAs: [
        'https://github.com/karem505',
        'https://linkedin.com/in/abo-el-makarem-shohoud-745367244',
        'https://twitter.com/karem_shohud',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Ailigent',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    inLanguage: isArabic ? 'ar' : 'en',
    articleSection: categoryName,
    keywords: post.post_type,
    wordCount: (isArabic ? post.content_ar : post.content_en).split(/\s+/).length,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
