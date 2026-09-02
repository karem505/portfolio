'use client'

import { useEffect, useState } from 'react'
import { isMotionEnabled } from './useAnimeScope'

/**
 * True only when the pinned act is worth it: motion allowed, desktop width,
 * and a viewport height in the range the stage was designed for. The upper
 * bound also keeps headless renderers with very tall viewports (Googlebot
 * desktop) on the plain flow layout, where every card is visible at rest.
 * Always false on the server and on the first client render, so SSR HTML and
 * hydration see the plain flow layout.
 */
export function usePinned(): boolean {
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const decide = () =>
      setPinned(isMotionEnabled() && mq.matches && window.innerHeight >= 720 && window.innerHeight <= 1400)
    decide()
    mq.addEventListener('change', decide)
    window.addEventListener('resize', decide)
    return () => {
      mq.removeEventListener('change', decide)
      window.removeEventListener('resize', decide)
    }
  }, [])
  return pinned
}
