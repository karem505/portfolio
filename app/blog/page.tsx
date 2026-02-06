import { Metadata } from 'next'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog | Abo-Elmakarem Shohoud',
  description: 'Latest insights on AI, automation, and software development by Abo-Elmakarem Shohoud.',
  alternates: {
    canonical: 'https://aboelmakarem.pro/blog',
  },
  openGraph: {
    title: 'Blog | Abo-Elmakarem Shohoud',
    description: 'Latest insights on AI, automation, and software development.',
    type: 'website',
    url: 'https://aboelmakarem.pro/blog',
  },
}

export default function BlogPage() {
  return <BlogPageClient />
}
