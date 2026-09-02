import { describe, it, expect } from 'vitest'
import { CHAPTERS, getChapter } from './chapters'

describe('CHAPTERS', () => {
  it('has unique ids and numbers', () => {
    const ids = CHAPTERS.map((c) => c.id)
    const nums = CHAPTERS.map((c) => c.number)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(nums).size).toBe(nums.length)
  })

  it('has non-empty EN and AR labels for every chapter', () => {
    for (const c of CHAPTERS) {
      expect(c.en.length).toBeGreaterThan(0)
      expect(c.ar.length).toBeGreaterThan(0)
    }
  })

  it('follows the homepage DOM order', () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual([
      'home', 'about', 'experience', 'projects', 'services', 'blog', 'faq', 'contact',
    ])
  })

  it('getChapter resolves known ids and throws on unknown', () => {
    expect(getChapter('projects').number).toBe('004')
    expect(() => getChapter('nope' as never)).toThrow(/Unknown chapter/)
  })
})
