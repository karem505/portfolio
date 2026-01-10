import { Metadata } from 'next'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = {
  title: 'Blog | Abo-Elmakarem Shohoud',
  description: 'Latest insights on AI, automation, and software development by Abo-Elmakarem Shohoud.',
  alternates: {
    canonical: 'https://abo-elmakarem.netlify.app/blog',
  },
  openGraph: {
    title: 'Blog | Abo-Elmakarem Shohoud',
    description: 'Latest insights on AI, automation, and software development.',
    type: 'website',
    url: 'https://abo-elmakarem.netlify.app/blog',
  },
}

export default function BlogPage() {
  return <BlogPageClient />
}
