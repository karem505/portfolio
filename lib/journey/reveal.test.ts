import { describe, it, expect } from 'vitest'
import { viewportRelation, parallaxRange, revealAllImmediately, TALL_VIEWPORT_PX, PARALLAX_PX } from './reveal'

describe('viewportRelation', () => {
  const vh = 1000
  it('is above when the element has fully scrolled past', () => {
    expect(viewportRelation({ top: -500, bottom: -10 }, vh)).toBe('above')
  })
  it('is in when the top is inside the first 90% of the viewport', () => {
    expect(viewportRelation({ top: 100, bottom: 400 }, vh)).toBe('in')
    expect(viewportRelation({ top: 899, bottom: 1200 }, vh)).toBe('in')
    expect(viewportRelation({ top: -50, bottom: 300 }, vh)).toBe('in')
  })
  it('is below beyond the 90% line', () => {
    expect(viewportRelation({ top: 900, bottom: 1300 }, vh)).toBe('below')
    expect(viewportRelation({ top: 5000, bottom: 5300 }, vh)).toBe('below')
  })
})

describe('parallaxRange', () => {
  it('far planes lag (negative → positive), near planes lead', () => {
    expect(parallaxRange(0.1)).toEqual([-0.1 * PARALLAX_PX, 0.1 * PARALLAX_PX])
    expect(parallaxRange(-0.2)).toEqual([0.2 * PARALLAX_PX, -0.2 * PARALLAX_PX])
  })
  it('depth 0 is static and amplitude scales', () => {
    expect(parallaxRange(0)).toEqual([-0, 0])
    expect(parallaxRange(0.5, 100)).toEqual([-50, 50])
  })
})

describe('revealAllImmediately', () => {
  it('keeps reveals for phone, laptop and large desktop viewports', () => {
    expect(revealAllImmediately(667)).toBe(false)
    expect(revealAllImmediately(900)).toBe(false)
    expect(revealAllImmediately(1440)).toBe(false)
    expect(revealAllImmediately(TALL_VIEWPORT_PX)).toBe(false)
  })
  it('skips reveals for headless renderer viewports that never scroll', () => {
    expect(revealAllImmediately(TALL_VIEWPORT_PX + 1)).toBe(true)
    expect(revealAllImmediately(9000)).toBe(true)
    expect(revealAllImmediately(12140)).toBe(true)
  })
})
