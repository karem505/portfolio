'use client'

import { useEffect } from 'react'

/**
 * Lens for the glass navbar (Chromium desktop only; html.lg-lens).
 * Builds an edge-refraction displacement map for the navbar's size and exposes it as
 * the SVG filter #lg-lens, which liquid-glass.css uses as `backdrop-filter: url(#lg-lens)`.
 * Other browsers never get the class and keep the plain frosted blur.
 */
export default function LiquidLens() {
  useEffect(() => {
    const html = document.documentElement
    const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } })
      .userAgentData?.brands
    const chromium = !!brands?.some((b) => /Chromium/i.test(b.brand))
    const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    if (!html.classList.contains('lg') || !chromium) return

    const NS = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(NS, 'svg')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.style.position = 'absolute'
    svg.innerHTML =
      '<filter id="lg-lens" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">' +
      '<feImage id="lg-lens-map" x="0" y="0" preserveAspectRatio="none" result="map"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" scale="36" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter>'
    document.body.appendChild(svg)
    const feImage = svg.querySelector('#lg-lens-map') as SVGFEImageElement
    const filter = svg.querySelector('#lg-lens') as SVGFilterElement

    // Neutral grey (128,128) in the middle; the channels ramp near the edges so the
    // backdrop bends inward at the rim, like a thick glass slab.
    const build = (w: number, h: number) => {
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      if (!ctx) return
      const img = ctx.createImageData(w, h)
      const edge = Math.min(22, h / 2)
      const ease = (t: number) => 1 - Math.sqrt(1 - (1 - t) * (1 - t))
      for (let y = 0; y < h; y++) {
        const dy = y < edge ? -ease(y / edge) : y > h - edge ? ease((h - y) / edge) : 0
        for (let x = 0; x < w; x++) {
          const dx = x < edge ? -ease(x / edge) : x > w - edge ? ease((w - x) / edge) : 0
          const i = (y * w + x) * 4
          img.data[i] = 128 + dx * 127
          img.data[i + 1] = 128 + dy * 127
          img.data[i + 2] = 128
          img.data[i + 3] = 255
        }
      }
      ctx.putImageData(img, 0, 0)
      feImage.setAttribute('href', c.toDataURL())
      for (const el of [feImage, filter]) {
        el.setAttribute('width', String(w))
        el.setAttribute('height', String(h))
      }
    }

    const nav = document.querySelector('nav.nav-enter') as HTMLElement | null
    const sync = () => {
      if (!nav || !desktop.matches) {
        html.classList.remove('lg-lens')
        return
      }
      build(Math.round(nav.offsetWidth), Math.round(nav.offsetHeight))
      html.classList.add('lg-lens')
    }
    sync()
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(sync)
    }
    window.addEventListener('resize', onResize)
    desktop.addEventListener('change', sync)
    return () => {
      window.removeEventListener('resize', onResize)
      desktop.removeEventListener('change', sync)
      html.classList.remove('lg-lens')
      svg.remove()
    }
  }, [])

  return null
}
