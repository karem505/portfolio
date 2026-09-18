'use client'

import { useEffect, useRef, useState } from 'react'

const WAKE_EVENTS = ['scroll', 'pointermove', 'touchstart', 'keydown'] as const
const DESKTOP_MOTION = '(min-width: 1024px) and (hover: hover) and (pointer: fine)'

/** A single desktop renderer, invalidated on preferences, breakpoints and unmount. */
export default function JourneyStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia(DESKTOP_MOTION)
    const allowed = () => !media.matches && desktop.matches
    let generation = 0, idle = 0
    let disposed = false, awakened = false, pending = false, failed = false
    let cleanup: (() => void) | undefined
    const cancelIdle = () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
    }
    const reset = () => {
      generation++; cancelIdle(); pending = false
      cleanup?.(); cleanup = undefined
      canvas.classList.remove('is-ready')
      document.documentElement.classList.remove('field-ready')
      if (!disposed) setReady(false)
    }
    const mount = async (version: number) => {
      if (disposed || version !== generation || !allowed() || document.hidden) { pending = false; return }
      try {
        const { GalaxyField } = await import('./GalaxyField')
        if (disposed || version !== generation || !allowed() || document.hidden) return
        const field = new GalaxyField(canvas, { dpr: Math.min(window.devicePixelRatio || 1, 1.5) })
        const resize = () => { if (!document.hidden) field.resize() }
        const visibility = () => document.hidden ? field.stop() : field.start()
        window.addEventListener('resize', resize)
        document.addEventListener('visibilitychange', visibility)
        cleanup = () => {
          window.removeEventListener('resize', resize)
          document.removeEventListener('visibilitychange', visibility)
          field.dispose()
        }
        field.start()
        setReady(true)
        document.documentElement.classList.add('field-ready')
      } catch {
        // Do not retry unsupported GPUs on every pointermove.
        if (version === generation) { reset(); failed = true }
      } finally { if (version === generation) pending = false }
    }
    const schedule = () => {
      if (!awakened || disposed || failed || !allowed() || document.hidden || pending || cleanup) return
      pending = true
      const version = generation
      idle = 'requestIdleCallback' in window
        ? window.requestIdleCallback(() => { void mount(version) }, { timeout: 1200 })
        : Number(globalThis.setTimeout(() => { void mount(version) }, 200))
    }
    const wake = () => { awakened = true; schedule() }
    const preference = () => {
      document.documentElement.classList.toggle('motion', allowed())
      reset(); failed = false; schedule()
    }
    const lost = (event: Event) => { event.preventDefault(); reset(); failed = true }
    const restored = () => { failed = false; schedule() }
    const visible = () => { if (!document.hidden) schedule() }
    media.addEventListener('change', preference)
    desktop.addEventListener('change', preference)
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', restored)
    document.addEventListener('visibilitychange', visible)
    WAKE_EVENTS.forEach(event => window.addEventListener(event, wake, { passive: true }))
    preference()
    return () => {
      disposed = true; reset()
      media.removeEventListener('change', preference)
      desktop.removeEventListener('change', preference)
      canvas.removeEventListener('webglcontextlost', lost)
      canvas.removeEventListener('webglcontextrestored', restored)
      document.removeEventListener('visibilitychange', visible)
      WAKE_EVENTS.forEach(event => window.removeEventListener(event, wake))
    }
  }, [])

  return <canvas ref={canvasRef} className={`journey-canvas${ready ? ' is-ready' : ''}`} aria-hidden="true" />
}
