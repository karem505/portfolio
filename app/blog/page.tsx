import { Metadata } from 'next'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Explore AI automation tutorials, voice agent guides, and tech insights by Abo-Elmakarem Shohoud. Practical tips for cutting business costs with AI.',
  alternates: {
    canonical: 'https://aboelmakarem.pro/blog',
  },
  openGraph: {
    title: 'Blog',
    description: 'Explore AI automation tutorials, voice agent guides, and tech insights by Abo-Elmakarem Shohoud. Practical tips for cutting business costs with AI.',
    type: 'website',
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

export default function BlogPage() {
  return <BlogPageClient />
}
