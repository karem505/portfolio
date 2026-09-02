import type { Language } from './types'

/**
 * Public path of a blog post in a language. Only the Arabic variant carries a
 * query: `?lang=en` is not a real URL on this site (the English post is the bare
 * path), so emitting it would create crawlable duplicates.
 */
export function postPath(slug: string, language: Language): string {
  return language === 'ar' ? `/blog/${slug}?lang=ar` : `/blog/${slug}`
}
