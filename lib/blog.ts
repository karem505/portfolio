import { supabase } from './supabase'
import type { Post, Category, PaginatedPosts, Language, LocalizedPost } from './types'

const PAGE_SIZE = 9

// Get all published posts with pagination
export async function getPosts(
  page: number = 1,
  categorySlug?: string
): Promise<PaginatedPosts> {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('posts')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (categorySlug) {
    // First get the category ID from the slug
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], total: 0, page, pageSize: PAGE_SIZE, totalPages: 0 }
  }

  const total = count || 0

  return {
    posts: data as Post[],
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}

// Get all posts for sitemap and SSR link rendering (no pagination)
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('slug, title_en, title_ar, updated_at, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching all posts:', error)
    return []
  }

  return data as Post[]
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data as Post
}

// Get related posts by category
export async function getRelatedPosts(
  currentSlug: string,
  categoryId: string | null,
  limit: number = 3
): Promise<Post[]> {
  if (!categoryId) return []

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related posts:', error)
    return []
  }

  return data as Post[]
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name_en')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data as Category[]
}

// Get recent posts for sidebar
export async function getRecentPosts(limit: number = 5): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title_en, title_ar, published_at, featured_image')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent posts:', error)
    return []
  }

  return data as Post[]
}

// Search posts (simple ILIKE search)
export async function searchPosts(
  query: string,
  language: Language = 'en'
): Promise<Post[]> {
  const searchColumn = language === 'ar' ? 'title_ar' : 'title_en'
  const contentColumn = language === 'ar' ? 'content_ar' : 'content_en'

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .or(`${searchColumn}.ilike.%${query}%,${contentColumn}.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error searching posts:', error)
    return []
  }

  return data as Post[]
}

// Helper: Localize post content based on language
export function localizePost(post: Post, language: Language): LocalizedPost {
  const isArabic = language === 'ar'

  return {
    id: post.id,
    slug: post.slug,
    title: isArabic ? post.title_ar : post.title_en,
    content: isArabic ? post.content_ar : post.content_en,
    excerpt: isArabic ? post.excerpt_ar : post.excerpt_en,
    metaDescription: isArabic ? post.meta_description_ar : post.meta_description_en,
    postType: post.post_type,
    featuredImage: post.featured_image,
    readingTime: post.reading_time_minutes,
    views: post.views,
    sourceUrl: post.source_url,
    sourceTitle: post.source_title,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
  }
}

// Helper: Get category display name
export function getCategoryName(category: Category, language: Language): string {
  return language === 'ar' ? category.name_ar : category.name_en
}

// Helper: Format date for display
export function formatDate(dateString: string, language: Language): string {
  const date = new Date(dateString)
  const locale = language === 'ar' ? 'ar-EG' : 'en-US'

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
