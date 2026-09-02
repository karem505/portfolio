'use client'

import { useEffect, useState } from 'react'
import { isMotionEnabled } from './useAnimeScope'

/**
 * True only when the pinned act is worth it: motion allowed, desktop width,
 * and enough height for the whole stage (header + three flagship cards).
 * Always false on the server and on the first client render, so SSR HTML and
 * hydration see the plain flow layout.
 */
export function usePinned(): boolean {
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const decide = () => setPinned(isMotionEnabled() && mq.matches && window.innerHeight >= 720)
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
