import {
  animate,
  createTimeline,
  cubicBezier,
  onScroll,
  splitText,
  stagger,
  utils,
  type JSAnimation,
  type TextSplitter,
} from 'animejs'

export const EASE_OUT = cubicBezier(0.23, 1, 0.32, 1)
/** Total travel (px) of a depth-1 plane across a section's visible life. */
export const PARALLAX_PX = 220
/** Viewports taller than this belong to headless renderers (Google's, social
 *  scrapers), which never scroll. Above it every reveal is skipped so the
 *  rendered snapshot shows all copy at rest. */
export const TALL_VIEWPORT_PX = 1600

/** Pure: true when reveals should be skipped because nothing will ever scroll. */
export function revealAllImmediately(innerHeight: number): boolean {
  return innerHeight > TALL_VIEWPORT_PX
}

export type ViewportRelation = 'above' | 'in' | 'below'

/** Pure: where a rect sits relative to a viewport of height `vh`. The 90% band
 *  below the fold counts as "in" so elements about to enter animate immediately. */
export function viewportRelation(rect: { top: number; bottom: number }, vh: number): ViewportRelation {
  if (rect.bottom < 0) return 'above'
  if (rect.top < vh * 0.9) return 'in'
  return 'below'
}

/** Pure: translateY range for a depth plane. Positive depth = far (lags the
 *  scroll), negative depth = near (leads it). */
export function parallaxRange(depth: number, amplitude = PARALLAX_PX): [number, number] {
  return [-depth * amplitude, depth * amplitude]
}

/**
 * Cleanup registry. `useAnimeScope` installs a Set while a scope builds; the
 * helpers register IntersectionObserver disconnects there so a scope revert
 * (unmount, language switch) also tears down the observers anime does not own.
 */
export const cleanupRegistry: { current: Set<() => void> | null } = { current: null }
function registerCleanup(fn: () => void) {
  cleanupRegistry.current?.add(fn)
}

/**
 * Scroll-rest safety net. IntersectionObserver only reports on rendered
 * frames, so a scroll that finishes while the main thread is saturated can
 * leave a hidden trigger unreported. 300 ms after the last scroll event every
 * pending trigger is measured once (reads only, one layout pass) and anything
 * now in or above view plays.
 */
const pendingChecks = new Set<() => void>()
let restTimer = 0
let restListening = false
function armRestCheck() {
  if (restListening) return
  restListening = true
  window.addEventListener(
    'scroll',
    () => {
      window.clearTimeout(restTimer)
      restTimer = window.setTimeout(() => pendingChecks.forEach((fn) => fn()), 300)
    },
    { passive: true },
  )
}

type Targets = Element | Element[] | NodeListOf<Element>
const toList = (t: Targets): HTMLElement[] =>
  (Array.isArray(t) ? t : t instanceof Element ? [t] : Array.from(t)) as HTMLElement[]

/**
 * Enter-once trigger built on IntersectionObserver so geometry is read
 * asynchronously in one batch (no forced layout between our style writes).
 * The first callback classifies the trigger: already passed → leave the
 * targets untouched (nothing hidden), in view → hide + play now, below →
 * hide now and play when it enters ("enter" = 80px above the fold).
 */
function playOnce(trigger: Element, hide: () => void, make: () => JSAnimation) {
  let disposed = false
  let anim: JSAnimation | null = null
  const check = () => {
    if (disposed || !anim) return
    if (trigger.getBoundingClientRect().top < window.innerHeight - 80) fire()
  }
  const fire = () => {
    if (disposed || !anim) return
    anim.play()
    io.disconnect()
    pendingChecks.delete(check)
  }
  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1]
      if (disposed) return
      if (!anim) {
        const passed = !e.isIntersecting && e.boundingClientRect.bottom < 0
        // Already scrolled past, or a renderer that never scrolls: leave the
        // targets untouched (nothing hidden, no animation).
        if (passed || revealAllImmediately(window.innerHeight)) {
          io.disconnect()
          return
        }
        hide()
        anim = make()
        pendingChecks.add(check)
        armRestCheck()
      }
      if (e.isIntersecting) fire()
    },
    // The root extends three viewports upward: a fast scroll while the main
    // thread is busy can carry a hidden trigger through the viewport without a
    // rendered frame, and a plain viewport root would never report it. Anything
    // that slipped past still counts as intersecting on the next frame and plays.
    { rootMargin: '300% 0px -80px 0px', threshold: 0 },
  )
  io.observe(trigger)
  registerCleanup(() => {
    disposed = true
    io.disconnect()
    pendingChecks.delete(check)
  })
}

export interface RevealOptions {
  y?: number
  duration?: number
  staggerMs?: number
  delay?: number
  trigger?: Element
}

/** Fade + rise, once, when `trigger` (default: first target) enters. */
export function revealUp(targets: Targets, opts: RevealOptions = {}): void {
  const list = toList(targets)
  if (!list.length) return
  const { y = 24, duration = 700, staggerMs = 0, delay = 0, trigger = list[0] } = opts
  playOnce(
    trigger,
    () => utils.set(list, { opacity: 0, translateY: y }),
    () =>
      animate(list, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration,
        ease: EASE_OUT,
        delay: staggerMs ? stagger(staggerMs, { start: delay }) : delay,
        autoplay: false,
      }),
  )
}

/** Slide in from the logical start/end edge (mirrors under RTL). */
export function revealSlide(
  el: HTMLElement,
  side: 'start' | 'end',
  rtl: boolean,
  opts: { trigger?: Element; duration?: number } = {},
): void {
  const { trigger = el, duration = 800 } = opts
  const dir = (side === 'start' ? -1 : 1) * (rtl ? -1 : 1)
  const x = 40 * dir
  playOnce(
    trigger,
    () => utils.set(el, { opacity: 0, translateX: x }),
    () => animate(el, { opacity: [0, 1], translateX: [x, 0], duration, ease: EASE_OUT, autoplay: false }),
  )
}

/**
 * Split a heading into lines (words kept whole — Arabic shaping survives) and
 * rise each line out of a clipped wrapper. The splitter re-splits on resize;
 * a resize mid-animation simply lands the new lines in their final state.
 */
export function revealLines(
  el: HTMLElement,
  opts: { staggerMs?: number; duration?: number } = {},
): TextSplitter {
  const { staggerMs = 90, duration = 900 } = opts
  const splitter = splitText(el, {
    lines: { wrap: 'clip', class: 'split-line' },
    words: true,
    chars: false,
    // Words stay whole, so screen readers cope without the sr-only clone that
    // `accessible: true` adds (it would duplicate heading text in the rendered DOM).
    accessible: false,
  })
  if (!splitter.lines.length) return splitter
  playOnce(
    el,
    () => utils.set(splitter.lines, { opacity: 0, translateY: '110%' }),
    () =>
      animate(splitter.lines, {
        opacity: [0, 1],
        translateY: ['110%', '0%'],
        duration,
        ease: EASE_OUT,
        delay: stagger(staggerMs),
        autoplay: false,
      }),
  )
  return splitter
}

export interface ParallaxOptions {
  enter?: string
  leave?: string
  /** Start at 0 instead of the negative end (for the hero, which is already on screen). */
  fromZero?: boolean
  amplitude?: number
}

/**
 * Scroll-synced parallax for every `[data-depth]` descendant of `root`: ONE
 * ScrollObserver per section driving a timeline with one tween per layer,
 * instead of one observer (and one geometry read) per element.
 */
export function parallaxLayers(root: HTMLElement, opts: ParallaxOptions = {}): void {
  const { enter = 'bottom top', leave = 'top bottom', fromZero = false, amplitude = PARALLAX_PX } = opts
  const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]'))
  if (!layers.length) return
  const tl = createTimeline({
    defaults: { ease: 'linear', duration: 1000 },
    autoplay: onScroll({ target: root, enter, leave, sync: true }),
  })
  layers.forEach((el) => {
    const [from, to] = parallaxRange(parseFloat(el.dataset.depth || '0'), amplitude)
    tl.add(el, { translateY: fromZero ? [0, to * 2] : [from, to] }, 0)
  })
}
