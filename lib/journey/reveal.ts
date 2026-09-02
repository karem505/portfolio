import {
  animate,
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

type Targets = Element | Element[] | NodeListOf<Element>
const toList = (t: Targets): HTMLElement[] =>
  (Array.isArray(t) ? t : t instanceof Element ? [t] : Array.from(t)) as HTMLElement[]

const ENTER = 'bottom-=80 top' // container bottom minus 80px meets target top

/**
 * Shared play-once logic: elements already scrolled past keep their final
 * state (no hidden content left behind), elements already in view play now,
 * elements below wait for a one-shot ScrollObserver.
 */
function playOnce(trigger: Element, make: () => JSAnimation): JSAnimation | null {
  const rel = viewportRelation(trigger.getBoundingClientRect(), window.innerHeight)
  if (rel === 'above') return null
  const anim = make()
  if (rel === 'in') {
    anim.play()
  } else {
    onScroll({ target: trigger, enter: ENTER, repeat: false, onEnter: () => anim.play() })
  }
  return anim
}

export interface RevealOptions {
  y?: number
  duration?: number
  staggerMs?: number
  delay?: number
  trigger?: Element
}

/** Fade + rise, once, when `trigger` (default: first target) enters. */
export function revealUp(targets: Targets, opts: RevealOptions = {}): JSAnimation | null {
  const list = toList(targets)
  if (!list.length) return null
  const { y = 24, duration = 700, staggerMs = 0, delay = 0, trigger = list[0] } = opts
  return playOnce(trigger, () => {
    utils.set(list, { opacity: 0, translateY: y })
    return animate(list, {
      opacity: [0, 1],
      translateY: [y, 0],
      duration,
      ease: EASE_OUT,
      delay: staggerMs ? stagger(staggerMs, { start: delay }) : delay,
      autoplay: false,
    })
  })
}

/** Slide in from the logical start/end edge (mirrors under RTL). */
export function revealSlide(
  el: HTMLElement,
  side: 'start' | 'end',
  rtl: boolean,
  opts: { trigger?: Element; duration?: number } = {},
): JSAnimation | null {
  const { trigger = el, duration = 800 } = opts
  const dir = (side === 'start' ? -1 : 1) * (rtl ? -1 : 1)
  const x = 40 * dir
  return playOnce(trigger, () => {
    utils.set(el, { opacity: 0, translateX: x })
    return animate(el, { opacity: [0, 1], translateX: [x, 0], duration, ease: EASE_OUT, autoplay: false })
  })
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
  const rel = viewportRelation(el.getBoundingClientRect(), window.innerHeight)
  const splitter = splitText(el, {
    lines: { wrap: 'clip', class: 'split-line' },
    words: true,
    chars: false,
    // Words stay whole, so screen readers cope without the sr-only clone that
    // `accessible: true` adds (it would duplicate heading text in the rendered DOM).
    accessible: false,
  })
  if (rel === 'above' || !splitter.lines.length) return splitter
  utils.set(splitter.lines, { opacity: 0, translateY: '110%' })
  const anim = animate(splitter.lines, {
    opacity: [0, 1],
    translateY: ['110%', '0%'],
    duration,
    ease: EASE_OUT,
    delay: stagger(staggerMs),
    autoplay: false,
  })
  if (rel === 'in') anim.play()
  else onScroll({ target: el, enter: ENTER, repeat: false, onEnter: () => anim.play() })
  return splitter
}

export interface ParallaxOptions {
  enter?: string
  leave?: string
  /** Start at 0 instead of the negative end (for the hero, which is already on screen). */
  fromZero?: boolean
  amplitude?: number
}

/** Scroll-synced translateY over the trigger's visible life. */
export function parallax(el: HTMLElement, depth: number, trigger: Element, opts: ParallaxOptions = {}): JSAnimation {
  const { enter = 'bottom top', leave = 'top bottom', fromZero = false, amplitude = PARALLAX_PX } = opts
  const [from, to] = parallaxRange(depth, amplitude)
  return animate(el, {
    translateY: fromZero ? [0, to * 2] : [from, to],
    ease: 'linear',
    autoplay: onScroll({ target: trigger, enter, leave, sync: true }),
  })
}

/** Applies parallax to every `[data-depth]` descendant of `root`, triggered by `root`. */
export function parallaxLayers(root: HTMLElement, opts: ParallaxOptions = {}): JSAnimation[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-depth]')).map((el) =>
    parallax(el, parseFloat(el.dataset.depth || '0'), root, opts),
  )
}
