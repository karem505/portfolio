'use client'

import { useEffect, useRef, type DependencyList, type RefObject } from 'react'
import { createScope, type Scope } from 'animejs'
import { cleanupRegistry } from './reveal'

export interface MotionContext {
  /** html.motion present AND the reduce-motion media query does not match. */
  motion: boolean
  rtl: boolean
  desktop: boolean
}

export type ScopeBuilder = (scope: Scope, ctx: MotionContext) => void

export function isMotionEnabled(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('motion')
}

/**
 * Runs `build` inside an anime.js scope rooted at the returned ref. Every
 * animation, ScrollObserver and TextSplitter created inside is reverted
 * (instances cancelled, inline styles removed, split markup restored) on
 * unmount and whenever `deps` change — e.g. the language toggle, which
 * re-renders every text node the split/parallax targets.
 */
export function useAnimeScope<T extends HTMLElement = HTMLElement>(
  build: ScopeBuilder,
  deps: DependencyList,
): RefObject<T | null> {
  const root = useRef<T>(null)
  useEffect(() => {
    if (!root.current) return
    let scope: Scope | null = null
    let cancelled = false
    const cleanups = new Set<() => void>()
    // Build off the hydration task: each section becomes its own short idle
    // task instead of one long blocking one (keeps TBT low on slow devices).
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const schedule = (cb: () => void) =>
      w.requestIdleCallback ? w.requestIdleCallback(cb, { timeout: 600 }) : window.setTimeout(cb, 0)
    schedule(() => {
      if (cancelled || !root.current) return
      scope = createScope({
        root,
        mediaQueries: {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          desktop: '(min-width: 1024px)',
        },
      })
      const s = scope
      // The constructor callback re-runs on media-query changes; `scope.matches`
      // is refreshed before each run.
      s.add(() => {
        cleanupRegistry.current = cleanups
        try {
          build(s, {
            motion: isMotionEnabled() && !s.matches.reduceMotion,
            rtl: document.documentElement.dir === 'rtl',
            desktop: !!s.matches.desktop,
          })
        } finally {
          cleanupRegistry.current = null
        }
      })
    })
    return () => {
      cancelled = true
      cleanups.forEach((fn) => fn())
      cleanups.clear()
      scope?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return root
}
