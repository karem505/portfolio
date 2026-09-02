import type { ChapterId } from './chapters'

/** Target uniforms for the WebGL field. Lerped toward inside GalaxyField, never set directly. */
export interface FieldState {
  /** Galaxy rotation in radians. */
  spin: number
  /** 0 = galaxy, 1 = ordered lattice. */
  order: number
  /** Camera distance on z. */
  dolly: number
  /** Alpha multiplier (contrast guard behind text). */
  density: number
}

export interface JourneySnapshot {
  /** Whole-document progress 0..1. */
  page: number
  chapter: ChapterId
  /** Progress through the active chapter 0..1 (see store.resolveChapter). */
  chapterProgress: number
  /** Hero-only progress: 0 at page top, 1 once the hero has scrolled past. */
  heroProgress: number
}

/** 1.2 turns over the hero, like the retired scroll-scrubbed clip. */
export const SPIN_HERO = 1.2 * Math.PI * 2
/** Extra radians of slow drift across the rest of the page. */
export const SPIN_DRIFT = 0.8

const DOLLY_HERO = 8
const DOLLY_FAR = 11
const DOLLY_PEAK = 9.5

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t)
const smooth = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

export function fieldState(s: JourneySnapshot): FieldState {
  const page = clamp01(s.page)
  const cp = clamp01(s.chapterProgress)
  const hp = clamp01(s.heroProgress)
  // ×2 sensitivity: the full rotation completes over the first half of the hero.
  const spin = clamp01(hp * 2) * SPIN_HERO + page * SPIN_DRIFT

  switch (s.chapter) {
    case 'home':
      return { spin, order: 0, dolly: lerp(DOLLY_HERO, DOLLY_FAR, (hp - 0.6) / 0.4), density: 1 }
    case 'about':
      return { spin, order: 0, dolly: DOLLY_FAR, density: lerp(1, 0.6, cp * 2) }
    case 'experience':
      return { spin, order: cp * 0.35, dolly: DOLLY_FAR, density: 0.6 }
    case 'projects':
      return {
        spin,
        order: 0.35 + smooth(cp / 0.7) * 0.65,
        dolly: lerp(DOLLY_FAR, DOLLY_PEAK, cp / 0.7),
        density: 0.75,
      }
    case 'services':
      return { spin, order: lerp(1, 0.5, cp), dolly: lerp(DOLLY_PEAK, DOLLY_FAR, cp), density: 0.6 }
    case 'blog':
      return { spin, order: 0.5, dolly: DOLLY_FAR, density: 0.55 }
    case 'faq':
      return { spin, order: lerp(0.5, 0.3, cp), dolly: DOLLY_FAR, density: 0.45 }
    case 'contact':
      return { spin, order: lerp(0.3, 0.15, cp), dolly: DOLLY_FAR, density: lerp(0.45, 0.35, cp) }
  }
}
