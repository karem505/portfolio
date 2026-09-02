'use client'

import { useEffect, useRef, useState } from 'react'
import { fieldState } from '@/lib/journey/field'
import { getJourneyStore } from '@/lib/journey/store'
import { isMotionEnabled } from '@/lib/journey/useAnimeScope'

function hasWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
}

const WAKE_EVENTS: (keyof WindowEventMap)[] = ['scroll', 'pointermove', 'touchstart', 'keydown', 'wheel']

/**
 * Fixed WebGL backdrop for the whole homepage. Never on the critical path:
 * the three.js chunk (a separate lazy import) is fetched only after the
 * visitor's first scroll/pointer/touch and then on idle, only under
 * html.motion and WebGL2. Until then the hero poster carries the backdrop.
 */
export default function JourneyStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isMotionEnabled() || !hasWebGL2()) return
    let cancelled = false
    let cleanup: (() => void) | null = null
    const w = window as IdleWindow
    const idle = (cb: () => void) =>
      w.requestIdleCallback ? w.requestIdleCallback(cb, { timeout: 1500 }) : window.setTimeout(cb, 400)

    const canvasEl: HTMLCanvasElement = canvas
    const mount = async () => {
      if (cancelled) return
      const { GalaxyField } = await import('./GalaxyField')
      if (cancelled) return
      const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024
      const field = new GalaxyField(canvasEl, {
        count: coarse ? 3500 : 12000,
        dpr: Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5),
      })
      const store = getJourneyStore()
      field.setTarget(fieldState(store.get()))
      const unsub = store.subscribe((s) => field.setTarget(fieldState(s)))
      const onResize = () => field.resize()
      const onVis = () => (document.hidden ? field.stop() : field.start())
      const onPointer = (e: PointerEvent) =>
        field.setPointer(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5)
      window.addEventListener('resize', onResize)
      document.addEventListener('visibilitychange', onVis)
      if (!coarse) window.addEventListener('pointermove', onPointer, { passive: true })
      field.start()
      setReady(true)
      document.documentElement.classList.add('field-ready')
      cleanup = () => {
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVis)
        window.removeEventListener('pointermove', onPointer)
        document.documentElement.classList.remove('field-ready')
        unsub()
        field.dispose()
      }
    }
    const wake = () => {
      WAKE_EVENTS.forEach((ev) => window.removeEventListener(ev, wake))
      idle(mount)
    }
    WAKE_EVENTS.forEach((ev) => window.addEventListener(ev, wake, { passive: true }))

    return () => {
      cancelled = true
      WAKE_EVENTS.forEach((ev) => window.removeEventListener(ev, wake))
      cleanup?.()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`journey-canvas${ready ? ' is-ready' : ''}`} />
}
