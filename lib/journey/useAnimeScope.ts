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
  return typeof document !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches
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
    let version = 0
    const cleanups = new Set<() => void>()
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    const clear = () => {
      cleanups.forEach(fn => fn())
      cleanups.clear()
      scope?.revert()
      scope = null
    }
    const rebuild = () => {
      const current = ++version
      clear()
      document.documentElement.classList.toggle('motion', !media.matches && desktop.matches)
      if (media.matches || !desktop.matches) return
      const setup = () => {
        if (cancelled || current !== version || media.matches || !desktop.matches || !root.current) return
        scope = createScope({ root })
        scope.add(() => {
          cleanupRegistry.current = cleanups
          try {
            build(scope!, { motion: true, rtl: document.documentElement.dir === 'rtl', desktop: desktop.matches })
          } finally { cleanupRegistry.current = null }
        })
      }
      if ('requestIdleCallback' in window) window.requestIdleCallback(setup, { timeout: 600 })
      else globalThis.setTimeout(setup, 0)
    }
    media.addEventListener('change', rebuild)
    desktop.addEventListener('change', rebuild)
    rebuild()
    return () => {
      cancelled = true
      version++
      clear()
      media.removeEventListener('change', rebuild)
      desktop.removeEventListener('change', rebuild)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return root
}
