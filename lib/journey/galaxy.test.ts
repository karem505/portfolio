import { describe, it, expect } from 'vitest'
import { buildFieldGeometry, createRng, PALETTE, SIGNAL_RATIO } from './galaxy'

describe('createRng', () => {
  it('is deterministic and in [0,1)', () => {
    const a = createRng(42), b = createRng(42)
    for (let i = 0; i < 100; i++) {
      const v = a()
      expect(v).toBe(b())
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('buildFieldGeometry', () => {
  it('is deterministic for a seed and differs across seeds', () => {
    const a = buildFieldGeometry({ count: 500, seed: 7 })
    const b = buildFieldGeometry({ count: 500, seed: 7 })
    const c = buildFieldGeometry({ count: 500, seed: 8 })
    expect(Array.from(a.galaxy)).toEqual(Array.from(b.galaxy))
    expect(Array.from(a.color)).toEqual(Array.from(b.color))
    expect(Array.from(a.galaxy)).not.toEqual(Array.from(c.galaxy))
  })

  it('has the right buffer lengths', () => {
    const g = buildFieldGeometry({ count: 1000 })
    expect(g.count).toBe(1000)
    expect(g.galaxy.length).toBe(3000)
    expect(g.lattice.length).toBe(3000)
    expect(g.color.length).toBe(3000)
    expect(g.size.length).toBe(1000)
    expect(g.seed.length).toBe(1000)
  })

  it('keeps the galaxy inside 1.15×radius as a thin disc', () => {
    const radius = 5
    const g = buildFieldGeometry({ count: 4000, radius })
    for (let i = 0; i < g.count; i++) {
      const x = g.galaxy[i * 3], y = g.galaxy[i * 3 + 1], z = g.galaxy[i * 3 + 2]
      expect(Math.hypot(x, y)).toBeLessThanOrEqual(radius * 1.15)
      expect(Math.abs(z)).toBeLessThanOrEqual(0.3)
    }
  })

  it('keeps lattice points inside the lattice cube', () => {
    const latticeSize = 9
    const g = buildFieldGeometry({ count: 4000, latticeSize })
    for (let i = 0; i < g.lattice.length; i++) {
      expect(Math.abs(g.lattice[i])).toBeLessThanOrEqual(latticeSize / 2 + 0.2)
    }
  })

  it('colours about 9% of points signal-red', () => {
    const g = buildFieldGeometry({ count: 6000 })
    let signal = 0
    for (let i = 0; i < g.count; i++) {
      if (g.color[i * 3] === 1 && Math.abs(g.color[i * 3 + 1] - PALETTE.signal[1]) < 1e-6) signal++
    }
    const ratio = signal / g.count
    expect(ratio).toBeGreaterThan(SIGNAL_RATIO - 0.02)
    expect(ratio).toBeLessThan(SIGNAL_RATIO + 0.02)
  })

  it('sizes points between 0.6 and 2.4', () => {
    const g = buildFieldGeometry({ count: 2000 })
    for (const s of g.size) {
      expect(s).toBeGreaterThanOrEqual(0.6)
      expect(s).toBeLessThanOrEqual(2.4)
    }
  })
})
