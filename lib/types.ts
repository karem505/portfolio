// Blog Types

export type Language = 'en' | 'ar'

export interface Post {
  id: string
  slug: string

  // English content
  title_en: string
  content_en: string
  excerpt_en: string | null
  meta_description_en: string | null

  // Arabic content
  title_ar: string
  content_ar: string
  excerpt_ar: string | null
  meta_description_ar: string | null

  // Categorization
  category_id: string | null
  post_type: 'news' | 'how-to' | 'tutorial' | 'analysis' | 'tool-review' | 'insights' | 'trending'

  // Media
  featured_image: string | null

  // Metadata
  reading_time_minutes: number
  views: number
  status: 'draft' | 'published' | 'archived'

  // SEO
  seo_keywords: string[] | null
  trending_keywords: string[] | null
  seo_noindex?: boolean

  // Source tracking (for news articles)
  source_url: string | null
  source_title: string | null

  // Timestamps
  created_at: string
  updated_at: string
  published_at: string

  // Optional joined data
  category?: Category
}

export interface Category {
  id: string
  slug: string
  name_en: string
  name_ar: string
  description_en: string | null
  description_ar: string | null
  color?: string | null
}

export interface Tag {
  id: string
  slug: string
  name_en: string
  name_ar: string
}

// Helper type for localized content
export interface LocalizedPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string | null
  metaDescription: string | null
  postType: Post['post_type']
  featuredImage: string | null
  readingTime: number
  views: number
  sourceUrl: string | null
  sourceTitle: string | null
  publishedAt: string
  updatedAt: string
}

// Pagination
export interface PaginatedPosts {
  posts: Post[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
