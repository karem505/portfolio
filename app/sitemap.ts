import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

// Revalidate sitemap every hour (3600 seconds)
export const revalidate = 3600

// Real modification dates for the static routes (update when a page's content
// changes). A `new Date()` here made every static lastmod identical and change
// every hour, which teaches Google to ignore the field.
const STATIC_LASTMOD = {
  home: new Date('2026-09-02'),
  aiTraining: new Date('2026-09-02'),
  digitalTransformation: new Date('2026-09-02'),
  apps: new Date('2026-06-21'),
  pharmacyManual: new Date('2026-06-22'),
  privacy: new Date('2026-07-01'),
  refund: new Date('2026-07-01'),
  contactInfo: new Date('2026-04-29'),
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aboelmakarem.pro'

  // Dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = []
  let newestPostDate = STATIC_LASTMOD.home

  try {
    const posts = await getAllPosts()

    // Only list indexable posts. Posts curated to noindex (thin AI-news bulk) are
    // excluded so Googlebot's limited crawl budget is concentrated on the pages we
    // actually want ranked. These posts are currently non-indexed, so dropping them
    // from the sitemap removes nothing already in the index.
    const indexable = posts.filter((post) => !post.seo_noindex)
    blogPages = indexable.flatMap((post) => [
      // English version
      {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      // Arabic version (kept so per-post hreflang in <head> stays reciprocal)
      {
        url: `${baseUrl}/blog/${post.slug}?lang=ar`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ])
    const newest = indexable
      .map((post) => new Date(post.updated_at || post.published_at).getTime())
      .filter((t) => !Number.isNaN(t))
    if (newest.length) newestPostDate = new Date(Math.max(...newest))
  } catch (error) {
    // If Supabase is not configured yet, just return static pages
    console.log('Blog posts not available for sitemap:', error)
  }

  // Static pages - Only include actual page URLs, not hash/anchor links
  // Hash URLs (/#about, /#contact, etc.) are NOT indexed by Google as separate pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: STATIC_LASTMOD.home,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?lang=ar`,
      lastModified: STATIC_LASTMOD.home,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: newestPostDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Service landing pages (bilingual: EN default + ?lang=ar variant)
    {
      url: `${baseUrl}/ai-training`,
      lastModified: STATIC_LASTMOD.aiTraining,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-training?lang=ar`,
      lastModified: STATIC_LASTMOD.aiTraining,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/digital-transformation`,
      lastModified: STATIC_LASTMOD.digitalTransformation,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/digital-transformation?lang=ar`,
      lastModified: STATIC_LASTMOD.digitalTransformation,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/apps`,
      lastModified: STATIC_LASTMOD.apps,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apps?lang=ar`,
      lastModified: STATIC_LASTMOD.apps,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/apps/pharmacy-manual`,
      lastModified: STATIC_LASTMOD.pharmacyManual,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apps/pharmacy-manual?lang=ar`,
      lastModified: STATIC_LASTMOD.pharmacyManual,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: STATIC_LASTMOD.privacy,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: STATIC_LASTMOD.refund,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact-info`,
      lastModified: STATIC_LASTMOD.contactInfo,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  return [...staticPages, ...blogPages]
}
