import { useSyncExternalStore } from 'react'
import { CHAPTERS, type ChapterId } from './chapters'

export interface ChapterBounds {
  id: ChapterId
  /** Document-space top (px). */
  top: number
  height: number
}

export interface JourneyState {
  /** Whole-document progress 0..1. */
  page: number
  chapter: ChapterId
  /** Progress through the active chapter 0..1 (see resolveChapter). */
  chapterProgress: number
  /** 0 at page top, 1 once the hero has scrolled past. */
  heroProgress: number
  scrollY: number
  /** px per ms, signed. */
  velocity: number
}

export const SERVER_STATE: JourneyState = {
  page: 0,
  chapter: 'home',
  chapterProgress: 0,
  heroProgress: 0,
  scrollY: 0,
  velocity: 0,
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** 0 at the top, 1 when the document bottom meets the viewport bottom. */
export function computePageProgress(scrollY: number, scrollHeight: number, viewportH: number): number {
  return clamp01(scrollY / Math.max(scrollHeight - viewportH, 1))
}

/**
 * Active chapter = the last chapter whose top is above the viewport's 35% line.
 * Progress: for the first chapter (hero) it is how far the chapter has scrolled
 * past the viewport top (0 at page top, 1 once fully gone); for every other
 * chapter it is how far the viewport midline has travelled through it.
 */
export function resolveChapter(
  bounds: ChapterBounds[],
  scrollY: number,
  viewportH: number,
): { id: ChapterId; progress: number } {
  if (bounds.length === 0) return { id: 'home', progress: 0 }
  const line = scrollY + viewportH * 0.35
  let idx = 0
  for (let i = 0; i < bounds.length; i++) if (bounds[i].top <= line) idx = i
  const b = bounds[idx]
  const h = Math.max(b.height, 1)
  const progress =
    idx === 0 ? clamp01((scrollY - b.top) / h) : clamp01((scrollY + viewportH * 0.5 - b.top) / h)
  return { id: b.id, progress }
}

/** Reads the current document position of every chapter section that exists. */
export function measureBounds(): ChapterBounds[] {
  const y = window.scrollY
  const out: ChapterBounds[] = []
  for (const c of CHAPTERS) {
    const el = document.getElementById(c.id)
    if (!el) continue
    const r = el.getBoundingClientRect()
    out.push({ id: c.id, top: r.top + y, height: r.height })
  }
  return out
}

type Listener = (state: JourneyState) => void

export interface JourneyStore {
  get(): JourneyState
  subscribe(fn: Listener): () => void
  /** Re-measure section bounds (call after layout-affecting changes). */
  refresh(): void
  destroy(): void
}

export function createJourneyStore(): JourneyStore {
  const html = document.documentElement
  const listeners = new Set<Listener>()
  let state: JourneyState = SERVER_STATE
  let bounds: ChapterBounds[] = []
  let heroHeight = Math.max(window.innerHeight, 1)
  let raf = 0
  let lastY = window.scrollY
  let lastT = performance.now()

  const update = () => {
    raf = 0
    const y = window.scrollY
    const vh = window.innerHeight
    const now = performance.now()
    const page = computePageProgress(y, html.scrollHeight, vh)
    const { id, progress } = resolveChapter(bounds, y, vh)
    const velocity = (y - lastY) / Math.max(now - lastT, 1)
    lastY = y
    lastT = now
    const next: JourneyState = {
      page,
      chapter: id,
      chapterProgress: progress,
      heroProgress: clamp01(y / heroHeight),
      scrollY: y,
      velocity,
    }
    const changed =
      next.page !== state.page ||
      next.chapter !== state.chapter ||
      next.chapterProgress !== state.chapterProgress ||
      next.scrollY !== state.scrollY
    state = next
    html.style.setProperty('--journey-p', page.toFixed(4))
    html.style.setProperty('--chapter-p', progress.toFixed(4))
    if (changed) listeners.forEach((fn) => fn(state))
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }
  const refresh = () => {
    bounds = measureBounds()
    const hero = bounds.find((b) => b.id === 'home')
    heroHeight = Math.max(hero?.height ?? window.innerHeight, 1)
    schedule()
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', refresh)
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => refresh()) : null
  ro?.observe(document.body)
  if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {})
  refresh()

  return {
    get: () => state,
    subscribe: (fn) => {
      listeners.add(fn)
      return () => {
        listeners.delete(fn)
      }
    },
    refresh,
    destroy: () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', refresh)
      ro?.disconnect()
      if (raf) cancelAnimationFrame(raf)
      listeners.clear()
    },
  }
}

let singleton: JourneyStore | null = null

/** Client-only lazy singleton. */
export function getJourneyStore(): JourneyStore {
  if (typeof window === 'undefined') throw new Error('getJourneyStore is client-only')
  if (!singleton) singleton = createJourneyStore()
  return singleton
}

// Stable function identities so useSyncExternalStore does not resubscribe each render.
const subscribe = (cb: () => void) => getJourneyStore().subscribe(cb)
const getSnapshot = () => (singleton ? singleton.get() : SERVER_STATE)
const getServerSnapshot = () => SERVER_STATE
const getChapterSnapshot = () => (singleton ? singleton.get().chapter : SERVER_STATE.chapter)
const getServerChapter = () => SERVER_STATE.chapter

/** Full state; re-renders on every scroll frame. Prefer useJourneyChapter for chrome. */
export function useJourney(): JourneyState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Active chapter id only; re-renders only when the chapter changes. */
export function useJourneyChapter(): ChapterId {
  return useSyncExternalStore(subscribe, getChapterSnapshot, getServerChapter)
}
