import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog'
import BlogPostClient from './BlogPostClient'

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
  const baseUrl = 'https://abo-elmakarem.netlify.app'

  return {
    title,
    description,
    authors: [{ name: 'Abo-Elmakarem Shohoud' }],
    keywords: [post.post_type],
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
      languages: {
        en: `/blog/${post.slug}?lang=en`,
        ar: `/blog/${post.slug}?lang=ar`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: ['Abo-Elmakarem Shohoud'],
      locale: isArabic ? 'ar_EG' : 'en_US',
      images: [
        {
          url: post.featured_image || `${baseUrl}/og-blog.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.featured_image || `${baseUrl}/og-blog.png`],
      creator: '@karem_shohud',
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { lang } = await searchParams
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(slug, post.category_id, 3)
  const language = lang || 'en'

  return <BlogPostClient post={post} relatedPosts={relatedPosts} initialLanguage={language} />
}
