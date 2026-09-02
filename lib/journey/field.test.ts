import { describe, it, expect } from 'vitest'
import { fieldState, SPIN_HERO, SPIN_DRIFT, type JourneySnapshot } from './field'

const top: JourneySnapshot = { page: 0, chapter: 'home', chapterProgress: 0, heroProgress: 0 }

describe('fieldState', () => {
  it('starts still, dense and close at the top of the page', () => {
    expect(fieldState(top)).toEqual({ spin: 0, order: 0, dolly: 8, density: 1 })
  })

  it('spins 1.2 turns over the first half of the hero (×2 sensitivity) and holds', () => {
    expect(fieldState({ ...top, heroProgress: 0.5 }).spin).toBeCloseTo(SPIN_HERO, 6)
    expect(fieldState({ ...top, heroProgress: 1 }).spin).toBeCloseTo(SPIN_HERO, 6)
    expect(fieldState({ ...top, heroProgress: 0.25 }).spin).toBeCloseTo(SPIN_HERO / 2, 6)
  })

  it('pulls the camera back during the last 40% of the hero', () => {
    expect(fieldState({ ...top, heroProgress: 0.6 }).dolly).toBeCloseTo(8)
    expect(fieldState({ ...top, heroProgress: 1 }).dolly).toBeCloseTo(11)
  })

  it('is a pure function (same input, same output)', () => {
    const s: JourneySnapshot = { page: 0.4, chapter: 'projects', chapterProgress: 0.33, heroProgress: 1 }
    expect(fieldState(s)).toEqual(fieldState({ ...s }))
  })

  it('reaches full lattice order at 70% of the projects chapter and holds', () => {
    const at = (cp: number) => fieldState({ page: 0.5, chapter: 'projects', chapterProgress: cp, heroProgress: 1 })
    expect(at(0).order).toBeCloseTo(0.35)
    expect(at(0.7).order).toBeCloseTo(1)
    expect(at(1).order).toBeCloseTo(1)
    let prev = -1
    for (let cp = 0; cp <= 1.0001; cp += 0.05) {
      const o = at(cp).order
      expect(o).toBeGreaterThanOrEqual(prev - 1e-9)
      prev = o
    }
  })

  it('experience ramps order from 0 to 0.35 (the authored silence before the peak)', () => {
    expect(fieldState({ page: 0.3, chapter: 'experience', chapterProgress: 0, heroProgress: 1 }).order).toBeCloseTo(0)
    expect(fieldState({ page: 0.3, chapter: 'experience', chapterProgress: 1, heroProgress: 1 }).order).toBeCloseTo(0.35)
  })

  it('settles to a sparse, loose sky at the end of contact', () => {
    const s = fieldState({ page: 1, chapter: 'contact', chapterProgress: 1, heroProgress: 1 })
    expect(s.density).toBeCloseTo(0.35)
    expect(s.order).toBeCloseTo(0.15)
    expect(s.dolly).toBeCloseTo(11)
  })

  it('clamps out-of-range inputs', () => {
    const s = fieldState({ page: 2, chapter: 'about', chapterProgress: -1, heroProgress: 5 })
    expect(s.density).toBe(1)
    expect(s.spin).toBeCloseTo(SPIN_HERO + SPIN_DRIFT)
  })
})
