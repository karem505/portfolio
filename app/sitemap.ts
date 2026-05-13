import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

// Revalidate sitemap every hour (3600 seconds)
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aboelmakarem.pro'
  const lastModified = new Date()

  // Static pages - Only include actual page URLs, not hash/anchor links
  // Hash URLs (/#about, /#contact, etc.) are NOT indexed by Google as separate pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?lang=ar`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact-info`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = []

  try {
    const posts = await getAllPosts()

    blogPages = posts.flatMap((post) => [
      // English version
      {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
      // Arabic version
      {
        url: `${baseUrl}/blog/${post.slug}?lang=ar`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      },
    ])
  } catch (error) {
    // If Supabase is not configured yet, just return static pages
    console.log('Blog posts not available for sitemap:', error)
  }

  return [...staticPages, ...blogPages]
}
