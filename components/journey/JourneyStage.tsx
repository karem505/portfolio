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

/**
 * Fixed WebGL backdrop for the whole homepage. Never on the critical path:
 * mounts after hydration on idle, only under html.motion and WebGL2, and the
 * three.js chunk is a separate lazy import. Renders an empty canvas otherwise.
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

    idle(async () => {
      if (cancelled) return
      const { GalaxyField } = await import('./GalaxyField')
      if (cancelled) return
      const coarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024
      const field = new GalaxyField(canvas, {
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
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={`journey-canvas${ready ? ' is-ready' : ''}`} />
}
