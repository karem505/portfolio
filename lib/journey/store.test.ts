import { describe, it, expect } from 'vitest'
import { computePageProgress, resolveChapter, type ChapterBounds } from './store'

describe('computePageProgress', () => {
  it('is 0 at the top and 1 at the bottom', () => {
    expect(computePageProgress(0, 5000, 900)).toBe(0)
    expect(computePageProgress(4100, 5000, 900)).toBe(1)
    expect(computePageProgress(2050, 5000, 900)).toBeCloseTo(0.5)
  })
  it('clamps and tolerates short documents', () => {
    expect(computePageProgress(9999, 5000, 900)).toBe(1)
    expect(computePageProgress(-5, 5000, 900)).toBe(0)
    expect(computePageProgress(0, 800, 900)).toBe(0)
  })
})

describe('resolveChapter', () => {
  const vh = 900
  const bounds: ChapterBounds[] = [
    { id: 'home', top: 0, height: 900 },
    { id: 'about', top: 900, height: 1200 },
    { id: 'projects', top: 2100, height: 3400 },
  ]

  it('starts on home with progress 0', () => {
    expect(resolveChapter(bounds, 0, vh)).toEqual({ id: 'home', progress: 0 })
  })

  it('measures hero progress as how far the hero has scrolled past the top', () => {
    expect(resolveChapter(bounds, 450, vh)).toEqual({ id: 'home', progress: 0.5 })
  })

  it('switches chapters when the next top crosses the 35% viewport line', () => {
    expect(resolveChapter(bounds, 584, vh).id).toBe('home')
    expect(resolveChapter(bounds, 585, vh).id).toBe('about')
  })

  it('measures mid-page chapters by the viewport midline', () => {
    // midline = 900 + 450 = 1350; about spans 900..2100 → (1350-900)/1200
    expect(resolveChapter(bounds, 900, vh).progress).toBeCloseTo(0.375)
  })

  it('clamps progress to [0,1]', () => {
    expect(resolveChapter(bounds, 9000, vh)).toEqual({ id: 'projects', progress: 1 })
  })

  it('returns home when nothing is measured yet', () => {
    expect(resolveChapter([], 300, vh)).toEqual({ id: 'home', progress: 0 })
  })

  it('works when optional chapters (blog) are absent', () => {
    const noBlog: ChapterBounds[] = [
      { id: 'faq', top: 0, height: 600 },
      { id: 'contact', top: 600, height: 800 },
    ]
    expect(resolveChapter(noBlog, 700, vh).id).toBe('contact')
  })
})
