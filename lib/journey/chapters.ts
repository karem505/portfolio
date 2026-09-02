export type ChapterId =
  | 'home'
  | 'about'
  | 'experience'
  | 'projects'
  | 'services'
  | 'blog'
  | 'faq'
  | 'contact'

export interface Chapter {
  id: ChapterId
  /** The numbered eyebrow already used by each section (001…008). */
  number: string
  en: string
  ar: string
}

/**
 * Homepage sections in DOM order. `blog` is optional at runtime: RecentPosts
 * renders nothing when there are no published posts, so consumers must tolerate
 * a missing `#blog` element.
 */
export const CHAPTERS: readonly Chapter[] = [
  { id: 'home', number: '001', en: 'engineer.profile', ar: 'ملف.المهندس' },
  { id: 'about', number: '002', en: 'about', ar: 'نبذة' },
  { id: 'experience', number: '003', en: 'experience', ar: 'الخبرات' },
  { id: 'projects', number: '004', en: 'shipped · work', ar: 'الأعمال · المنشورة' },
  { id: 'services', number: '005', en: 'services', ar: 'الخدمات' },
  { id: 'blog', number: '008', en: 'journal', ar: 'المدونة' },
  { id: 'faq', number: '006', en: 'faq', ar: 'أسئلة شائعة' },
  { id: 'contact', number: '007', en: 'contact', ar: 'تواصل' },
]

export function getChapter(id: ChapterId): Chapter {
  const chapter = CHAPTERS.find((c) => c.id === id)
  if (!chapter) throw new Error(`Unknown chapter: ${id}`)
  return chapter
}
