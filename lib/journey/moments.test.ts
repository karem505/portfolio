import { describe, expect, it } from 'vitest'
import { momentPose, momentProgress, MOMENTS } from './moments'

describe('personal portfolio scroll sculpture', () => {
  it('has a personal introduction, career depth, three products, and a personal signature', () => {
    expect(MOMENTS).toEqual(['portrait', 'expertise', 'experience', 'tornix', 'oravex', 'costra', 'signature'])
  })
  it('clamps progress including malformed input and never generates NaN', () => {
    for (const input of [-5, 0, .5, 1, 7, NaN]) for (const kind of MOMENTS) {
      const pose = momentPose(kind, input)
      expect(Object.values(pose).every(Number.isFinite)).toBe(true)
      expect(pose.assembly).toBeGreaterThanOrEqual(0)
      expect(pose.assembly).toBeLessThanOrEqual(1)
    }
  })
  it('is reversible and deterministic, not a time-based autoplay', () => {
    const start = momentPose('expertise', .25)
    momentPose('expertise', .85)
    expect(momentPose('expertise', .25)).toEqual(start)
    expect(momentPose('expertise', .8).assembly).toBeGreaterThan(start.assembly)
  })
  it('settles on a front-facing personal signature', () => {
    expect(momentPose('signature', 1)).toMatchObject({ x: 0, y: 0, z: 0, assembly: 1 })
  })
  it('keeps portrait frame still so geometry cannot sweep across the face', () => {
    expect(momentPose('portrait', 0)).toEqual(momentPose('portrait', 1))
  })
  it('uses the real section viewport position, with finite zero-size fallback', () => {
    expect(momentProgress(800, 400, 800)).toBe(0)
    expect(momentProgress(-400, 400, 800)).toBe(1)
    expect(Number.isFinite(momentProgress(0,0,0))).toBe(true)
  })
})
