import type { Metadata } from 'next'
import { BlogHeader, BlogSidebar } from '@/components/blog'

export const metadata: Metadata = {
  title: {
    default: 'Blog | Abo-Elmakarem Shohoud',
    template: '%s | Abo-Elmakarem Shohoud',
  },
  description: 'AI, automation, and software development insights in Arabic and English. Latest news, tutorials, and how-to guides.',
  keywords: [
    'AI blog', 'automation blog', 'tech blog', 'Arabic tech blog',
    'مدونة الذكاء الاصطناعي', 'مدونة الأتمتة', 'مدونة تقنية',
  ],
  openGraph: {
    title: 'Blog | Abo-Elmakarem Shohoud',
    description: 'AI, automation, and software development insights in Arabic and English.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          {/* min-w-0: a grid item's automatic minimum width is its content's
              min-content size, so wide tables/code would otherwise push the whole
              page wider than the phone instead of scrolling inside their wrappers. */}
          <div className="min-w-0">{children}</div>
          <div className="hidden lg:block">
            <BlogSidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
