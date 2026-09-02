import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore AI automation tutorials, voice agent guides, and tech insights by Abo-Elmakarem Shohoud. Practical tips for cutting business costs with AI.',
  // Single canonical: the listing is one server URL with a client-side language
  // toggle, so no hreflang pair (an `ar` alternate would just canonicalize back).
  alternates: {
    canonical: 'https://aboelmakarem.pro/blog',
  },
  openGraph: {
    title: 'Blog',
    description: 'Explore AI automation tutorials, voice agent guides, and tech insights by Abo-Elmakarem Shohoud. Practical tips for cutting business costs with AI.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
    url: 'https://aboelmakarem.pro/blog',
    images: [{ url: 'https://aboelmakarem.pro/opengraph-image', alt: 'Abo-Elmakarem Blog', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: 'AI automation tutorials, voice agent guides, and tech insights.',
    images: ['https://aboelmakarem.pro/opengraph-image'],
  },
}

export default async function BlogPage() {
  // Fetch all posts server-side so Googlebot can discover all blog post links
  // without needing to execute JavaScript. Only indexable posts are listed: the
  // curated noindex set is excluded from the sitemap too, so linking it here only
  // spent crawl budget (and ~40 KB of HTML) on pages we do not want indexed.
  const allPosts = (await getAllPosts()).filter((post) => !post.seo_noindex)

  return (
    <>
      <BlogPageClient />
      {/* Server-rendered post links for SEO crawlability */}
      {/* This hidden nav ensures Googlebot discovers all blog post URLs */}
      <nav aria-label="All blog posts" className="sr-only">
        <ul>
          {allPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                {post.title_en || post.slug}
              </Link>
              <Link href={`/blog/${post.slug}?lang=ar`}>
                {post.title_ar || post.slug}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
