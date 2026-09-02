# Scroll Journey Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage into a scroll-driven, layered journey (anime.js scroll-linked motion + a lazy three.js particle field that morphs from galaxy to lattice) without losing a single SEO signal.

**Architecture:** A tiny scroll store (`lib/journey/store.ts`) publishes page/chapter progress; a fixed WebGL canvas (`components/journey/JourneyStage.tsx` → `GalaxyField.ts`, lazy-loaded) consumes it through a pure mapping (`field.ts`); every homepage section keeps its exact DOM/copy and replaces Framer Motion reveals with anime.js scopes (`useAnimeScope` + `reveal.ts`). Projects becomes a CSS-sticky pinned act driven by one scroll-synced anime timeline on desktop only. All hidden pre-animation states are applied by JS after hydration, so the SSR HTML contains more visible content than before.

**Tech Stack:** Next.js 14 App Router · React 18 · TypeScript · Tailwind 3 · anime.js 4.5 (`animejs`) · three.js 0.185 (`three`, `@types/three`) · vitest 2 · Framer Motion stays only for Navbar/FAQ accordion/blog.

**Spec:** `docs/superpowers/specs/2026-09-02-scroll-journey-redesign-design.md`

## Global Constraints

- No copy, identity, section order, or JSON-LD changes. Section ids stay `home, about, experience, projects, services, blog, faq, contact`.
- SEO gate on the SSR HTML of `/`: ≥ 2 `<h1`, ≥ 10 `<h2`, ≥ 33 `<h3`, ≥ 12 `application/ld+json`, ≥ 64 `<a `, `sr-only-seo` present, title/canonical/hreflang unchanged; Lighthouse SEO 100; Performance (mobile) within −5 of baseline; CLS ≤ 0.05.
- No inline `opacity:0` on content in SSR HTML (JS applies hidden states after hydration, only when `html.motion`).
- Hero H1 and `profile.jpg` remain first paint; three.js loads only after hydration on idle and only if `html.motion` and WebGL2.
- Bilingual/RTL: text splitting by lines/words only; x-motion uses logical direction; scopes rebuild on language change.
- Reduced motion / no WebGL / mobile degrade to a complete page (poster in hero, no canvas, no pinned act).
- Palette unchanged (`ink #0c0a09, slate #141211, graphite #1c1917, wire #2a2522, paper #f5f1ea, ash #a09690, signal #ff3b1f, moss #2f9e44`). Corners ≤ 2px.
- Node 20+ (local is v26), npm. Tests: `npm test` (vitest). Path alias `@/*`.
- Work on branch `feat/scroll-journey`. Never `git add -A`: the working tree has unrelated uncommitted edits (`.gitignore`, `components/blog/BlogContent.tsx`, `proposals/`). Stage files explicitly. Do not push.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

### Task 1: Capture the pre-change baseline (SSR counts, Lighthouse, bundle)

**Files:**
- Create: `/tmp/journey-baseline/` (not committed)

**Interfaces:**
- Produces: `/tmp/journey-baseline/summary.json` with `{ h1, h2, h3, jsonld, links, imgs, opacity0, firstLoadKb, lh: { mobile: {...}, desktop: {...} } }` used by Task 16.

- [x] **Step 1: Build the current code and start a production server**

```bash
cd "/home/karem505/side projects/mywebsite"
mkdir -p /tmp/journey-baseline
npm run build 2>&1 | tee /tmp/journey-baseline/build.log | tail -30
# Note the line for route "/" → "First Load JS" (e.g. "○ /  12.3 kB  150 kB"). Record the 150 kB figure.
(npm start -- -p 3000 > /tmp/journey-baseline/server.log 2>&1 &)
sleep 5 && curl -sI http://localhost:3000/ | head -1
```
Expected: `HTTP/1.1 200 OK`.

- [x] **Step 2: Save SSR HTML counts**

```bash
curl -s http://localhost:3000/ -o /tmp/journey-baseline/home.html
curl -s "http://localhost:3000/?lang=ar" -o /tmp/journey-baseline/home-ar.html
node -e '
const fs=require("fs");const h=fs.readFileSync("/tmp/journey-baseline/home.html","utf8");
const c=(re)=>(h.match(re)||[]).length;
const out={h1:c(/<h1/g),h2:c(/<h2/g),h3:c(/<h3/g),jsonld:c(/application\/ld\+json/g),links:c(/<a /g),imgs:c(/<img/g),opacity0:c(/opacity:0/g),srOnlySeo:c(/sr-only-seo/g),title:(h.match(/<title>([^<]*)<\/title>/)||[])[1],hreflang:c(/hreflang=/g)};
fs.writeFileSync("/tmp/journey-baseline/summary.json",JSON.stringify(out,null,2));console.log(out)'
```
Expected: numbers close to production (`h1 2, h2 10, h3 33, jsonld 12, links 64, imgs 9`). `opacity0` will be > 0 (Framer's SSR'd hidden state) — that is the number we must reduce.

- [x] **Step 3: Lighthouse mobile + desktop**

```bash
npx --yes lighthouse@12 http://localhost:3000/ --output=json --output-path=/tmp/journey-baseline/lh-mobile.json --chrome-flags="--headless=new --no-sandbox" --quiet --only-categories=performance,accessibility,best-practices,seo
npx --yes lighthouse@12 http://localhost:3000/ --preset=desktop --output=json --output-path=/tmp/journey-baseline/lh-desktop.json --chrome-flags="--headless=new --no-sandbox" --quiet --only-categories=performance,accessibility,best-practices,seo
node -e '
for (const k of ["mobile","desktop"]) { const r=require("/tmp/journey-baseline/lh-"+k+".json");
 const s=Object.fromEntries(Object.entries(r.categories).map(([n,c])=>[n,Math.round(c.score*100)]));
 const a=r.audits; console.log(k, s, {lcp:a["largest-contentful-paint"].displayValue, cls:a["cumulative-layout-shift"].displayValue, tbt:a["total-blocking-time"].displayValue}) }'
```
Expected: prints four category scores per mode. Append them by hand to `/tmp/journey-baseline/summary.json` under `lh` (edit the file), then stop the server:

```bash
pkill -f "next start" ; sleep 1; (ss -ltn | grep -q ':3000' && echo "still up" || echo "stopped")
```

**Baseline recorded (local prod build of 9b3ea5b + spec/plan commits, 2026-09-02):**

```
SSR HTML of / (local; the journal section is absent locally because .env.local points at a stub Supabase URL):
  h1 2 · h2 9 · h3 24 · jsonld 12 · links 54 · imgs 2 · sr-only-seo 2 · hrefLang 5 · inline opacity:0 66 · 192,805 bytes
Build: route "/" 26.4 kB, First Load JS 180 kB (shared 87.3 kB)
Lighthouse mobile:  performance 85 · accessibility 96 · best-practices 100 · seo 100 · LCP 3.8 s · CLS 0 · TBT 90 ms · SI 4.5 s
Lighthouse desktop: performance 99 · accessibility 96 · best-practices 100 · seo 100 · LCP 0.8 s · CLS 0 · TBT 0 ms
Production reference (aboelmakarem.pro, includes 9 journal posts): h1 2 · h2 10 · h3 33 · jsonld 12 · links 64 · imgs 9
```

- [x] **Step 4: Record the baseline in the plan**

Edit this plan file: under this task, add a fenced block with the printed numbers (SSR counts, First Load JS, Lighthouse scores, LCP/CLS/TBT). Commit:

```bash
git add docs/superpowers/plans/2026-09-02-scroll-journey-redesign.md
git commit -m "docs(journey): record pre-change SEO/perf baseline

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Chapter registry

**Files:**
- Create: `lib/journey/chapters.ts`
- Test: `lib/journey/chapters.test.ts`

**Interfaces:**
- Produces: `type ChapterId`, `interface Chapter { id; number; en; ar }`, `const CHAPTERS: readonly Chapter[]` (DOM order), `getChapter(id: ChapterId): Chapter`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/journey/chapters.test.ts
import { describe, it, expect } from 'vitest'
import { CHAPTERS, getChapter } from './chapters'

describe('CHAPTERS', () => {
  it('has unique ids and numbers', () => {
    const ids = CHAPTERS.map((c) => c.id)
    const nums = CHAPTERS.map((c) => c.number)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(nums).size).toBe(nums.length)
  })

  it('has non-empty EN and AR labels for every chapter', () => {
    for (const c of CHAPTERS) {
      expect(c.en.length).toBeGreaterThan(0)
      expect(c.ar.length).toBeGreaterThan(0)
    }
  })

  it('follows the homepage DOM order', () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual([
      'home', 'about', 'experience', 'projects', 'services', 'blog', 'faq', 'contact',
    ])
  })

  it('getChapter resolves known ids and throws on unknown', () => {
    expect(getChapter('projects').number).toBe('004')
    expect(() => getChapter('nope' as never)).toThrow(/Unknown chapter/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/journey/chapters.test.ts`
Expected: FAIL — cannot find module `./chapters`.

- [ ] **Step 3: Implement**

```ts
// lib/journey/chapters.ts
export type ChapterId =
  | 'home'
  | 'about'
  | 'experience'
  | 'projects'
  | 'services'
  | 'blog'
  | 'faq'
  | 'contact'

export interface Chapter {
  id: ChapterId
  /** The numbered eyebrow already used by each section (001…008). */
  number: string
  en: string
  ar: string
}

/**
 * Homepage sections in DOM order. `blog` is optional at runtime: RecentPosts
 * renders nothing when there are no published posts, so consumers must tolerate
 * a missing `#blog` element.
 */
export const CHAPTERS: readonly Chapter[] = [
  { id: 'home', number: '001', en: 'engineer.profile', ar: 'ملف.المهندس' },
  { id: 'about', number: '002', en: 'about', ar: 'نبذة' },
  { id: 'experience', number: '003', en: 'experience', ar: 'الخبرات' },
  { id: 'projects', number: '004', en: 'shipped · work', ar: 'الأعمال · المنشورة' },
  { id: 'services', number: '005', en: 'services', ar: 'الخدمات' },
  { id: 'blog', number: '008', en: 'journal', ar: 'المدونة' },
  { id: 'faq', number: '006', en: 'faq', ar: 'أسئلة شائعة' },
  { id: 'contact', number: '007', en: 'contact', ar: 'تواصل' },
]

export function getChapter(id: ChapterId): Chapter {
  const chapter = CHAPTERS.find((c) => c.id === id)
  if (!chapter) throw new Error(`Unknown chapter: ${id}`)
  return chapter
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/journey/chapters.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/journey/chapters.ts lib/journey/chapters.test.ts
git commit -m "feat(journey): add chapter registry for the homepage scroll journey

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Field state mapping (scroll → WebGL uniforms)

**Files:**
- Create: `lib/journey/field.ts`
- Test: `lib/journey/field.test.ts`

**Interfaces:**
- Consumes: `ChapterId` from Task 2.
- Produces: `interface FieldState { spin; order; dolly; density }`, `interface JourneySnapshot { page; chapter; chapterProgress; heroProgress }`, `fieldState(s: JourneySnapshot): FieldState`, constants `SPIN_HERO`, `SPIN_DRIFT`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/journey/field.test.ts
import { describe, it, expect } from 'vitest'
import { fieldState, SPIN_HERO, SPIN_DRIFT, type JourneySnapshot } from './field'

const top: JourneySnapshot = { page: 0, chapter: 'home', chapterProgress: 0, heroProgress: 0 }

describe('fieldState', () => {
  it('starts still, dense and close at the top of the page', () => {
    expect(fieldState(top)).toEqual({ spin: 0, order: 0, dolly: 8, density: 1 })
  })

  it('spins 1.2 turns over the first half of the hero (×2 sensitivity) and holds', () => {
    expect(fieldState({ ...top, heroProgress: 0.5 }).spin).toBeCloseTo(SPIN_HERO, 6)
    expect(fieldState({ ...top, heroProgress: 1 }).spin).toBeCloseTo(SPIN_HERO, 6)
    expect(fieldState({ ...top, heroProgress: 0.25 }).spin).toBeCloseTo(SPIN_HERO / 2, 6)
  })

  it('pulls the camera back during the last 40% of the hero', () => {
    expect(fieldState({ ...top, heroProgress: 0.6 }).dolly).toBeCloseTo(8)
    expect(fieldState({ ...top, heroProgress: 1 }).dolly).toBeCloseTo(11)
  })

  it('is a pure function (same input, same output)', () => {
    const s: JourneySnapshot = { page: 0.4, chapter: 'projects', chapterProgress: 0.33, heroProgress: 1 }
    expect(fieldState(s)).toEqual(fieldState({ ...s }))
  })

  it('reaches full lattice order at 70% of the projects chapter and holds', () => {
    const at = (cp: number) => fieldState({ page: 0.5, chapter: 'projects', chapterProgress: cp, heroProgress: 1 })
    expect(at(0).order).toBeCloseTo(0.35)
    expect(at(0.7).order).toBeCloseTo(1)
    expect(at(1).order).toBeCloseTo(1)
    let prev = -1
    for (let cp = 0; cp <= 1.0001; cp += 0.05) {
      const o = at(cp).order
      expect(o).toBeGreaterThanOrEqual(prev - 1e-9)
      prev = o
    }
  })

  it('experience ramps order from 0 to 0.35 (the authored silence before the peak)', () => {
    expect(fieldState({ page: 0.3, chapter: 'experience', chapterProgress: 0, heroProgress: 1 }).order).toBeCloseTo(0)
    expect(fieldState({ page: 0.3, chapter: 'experience', chapterProgress: 1, heroProgress: 1 }).order).toBeCloseTo(0.35)
  })

  it('settles to a sparse, loose sky at the end of contact', () => {
    const s = fieldState({ page: 1, chapter: 'contact', chapterProgress: 1, heroProgress: 1 })
    expect(s.density).toBeCloseTo(0.35)
    expect(s.order).toBeCloseTo(0.15)
    expect(s.dolly).toBeCloseTo(11)
  })

  it('clamps out-of-range inputs', () => {
    const s = fieldState({ page: 2, chapter: 'about', chapterProgress: -1, heroProgress: 5 })
    expect(s.density).toBe(1)
    expect(s.spin).toBeCloseTo(SPIN_HERO + SPIN_DRIFT)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/journey/field.test.ts`
Expected: FAIL — cannot find module `./field`.

- [ ] **Step 3: Implement**

```ts
// lib/journey/field.ts
import type { ChapterId } from './chapters'

/** Target uniforms for the WebGL field. Lerped toward inside GalaxyField, never set directly. */
export interface FieldState {
  /** Galaxy rotation in radians. */
  spin: number
  /** 0 = galaxy, 1 = ordered lattice. */
  order: number
  /** Camera distance on z. */
  dolly: number
  /** Alpha multiplier (contrast guard behind text). */
  density: number
}

export interface JourneySnapshot {
  /** Whole-document progress 0..1. */
  page: number
  chapter: ChapterId
  /** Progress through the active chapter 0..1 (see store.resolveChapter). */
  chapterProgress: number
  /** Hero-only progress: 0 at page top, 1 once the hero has scrolled past. */
  heroProgress: number
}

/** 1.2 turns over the hero, like the retired scroll-scrubbed clip. */
export const SPIN_HERO = 1.2 * Math.PI * 2
/** Extra radians of slow drift across the rest of the page. */
export const SPIN_DRIFT = 0.8

const DOLLY_HERO = 8
const DOLLY_FAR = 11
const DOLLY_PEAK = 9.5

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t)
const smooth = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

export function fieldState(s: JourneySnapshot): FieldState {
  const page = clamp01(s.page)
  const cp = clamp01(s.chapterProgress)
  const hp = clamp01(s.heroProgress)
  // ×2 sensitivity: the full rotation completes over the first half of the hero.
  const spin = clamp01(hp * 2) * SPIN_HERO + page * SPIN_DRIFT

  switch (s.chapter) {
    case 'home':
      return { spin, order: 0, dolly: lerp(DOLLY_HERO, DOLLY_FAR, (hp - 0.6) / 0.4), density: 1 }
    case 'about':
      return { spin, order: 0, dolly: DOLLY_FAR, density: lerp(1, 0.6, cp * 2) }
    case 'experience':
      return { spin, order: cp * 0.35, dolly: DOLLY_FAR, density: 0.6 }
    case 'projects':
      return {
        spin,
        order: 0.35 + smooth(cp / 0.7) * 0.65,
        dolly: lerp(DOLLY_FAR, DOLLY_PEAK, cp / 0.7),
        density: 0.75,
      }
    case 'services':
      return { spin, order: lerp(1, 0.5, cp), dolly: lerp(DOLLY_PEAK, DOLLY_FAR, cp), density: 0.6 }
    case 'blog':
      return { spin, order: 0.5, dolly: DOLLY_FAR, density: 0.55 }
    case 'faq':
      return { spin, order: lerp(0.5, 0.3, cp), dolly: DOLLY_FAR, density: 0.45 }
    case 'contact':
      return { spin, order: lerp(0.3, 0.15, cp), dolly: DOLLY_FAR, density: lerp(0.45, 0.35, cp) }
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/journey/field.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/journey/field.ts lib/journey/field.test.ts
git commit -m "feat(journey): pure scroll→field-state mapping for the WebGL backdrop

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Deterministic galaxy / lattice geometry

**Files:**
- Create: `lib/journey/galaxy.ts`
- Test: `lib/journey/galaxy.test.ts`

**Interfaces:**
- Produces: `createRng(seed): () => number`, `buildFieldGeometry(opts: GalaxyOptions): FieldGeometry` where `FieldGeometry = { count; galaxy: Float32Array; lattice: Float32Array; color: Float32Array; size: Float32Array; seed: Float32Array }`, `PALETTE`, `SIGNAL_RATIO`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/journey/galaxy.test.ts
import { describe, it, expect } from 'vitest'
import { buildFieldGeometry, createRng, PALETTE, SIGNAL_RATIO } from './galaxy'

describe('createRng', () => {
  it('is deterministic and in [0,1)', () => {
    const a = createRng(42), b = createRng(42)
    for (let i = 0; i < 100; i++) {
      const v = a()
      expect(v).toBe(b())
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('buildFieldGeometry', () => {
  it('is deterministic for a seed and differs across seeds', () => {
    const a = buildFieldGeometry({ count: 500, seed: 7 })
    const b = buildFieldGeometry({ count: 500, seed: 7 })
    const c = buildFieldGeometry({ count: 500, seed: 8 })
    expect(Array.from(a.galaxy)).toEqual(Array.from(b.galaxy))
    expect(Array.from(a.color)).toEqual(Array.from(b.color))
    expect(Array.from(a.galaxy)).not.toEqual(Array.from(c.galaxy))
  })

  it('has the right buffer lengths', () => {
    const g = buildFieldGeometry({ count: 1000 })
    expect(g.count).toBe(1000)
    expect(g.galaxy.length).toBe(3000)
    expect(g.lattice.length).toBe(3000)
    expect(g.color.length).toBe(3000)
    expect(g.size.length).toBe(1000)
    expect(g.seed.length).toBe(1000)
  })

  it('keeps the galaxy inside 1.15×radius as a thin disc', () => {
    const radius = 5
    const g = buildFieldGeometry({ count: 4000, radius })
    for (let i = 0; i < g.count; i++) {
      const x = g.galaxy[i * 3], y = g.galaxy[i * 3 + 1], z = g.galaxy[i * 3 + 2]
      expect(Math.hypot(x, y)).toBeLessThanOrEqual(radius * 1.15)
      expect(Math.abs(z)).toBeLessThanOrEqual(0.3)
    }
  })

  it('keeps lattice points inside the lattice cube', () => {
    const latticeSize = 9
    const g = buildFieldGeometry({ count: 4000, latticeSize })
    for (let i = 0; i < g.lattice.length; i++) {
      expect(Math.abs(g.lattice[i])).toBeLessThanOrEqual(latticeSize / 2 + 0.2)
    }
  })

  it('colours about 9% of points signal-red', () => {
    const g = buildFieldGeometry({ count: 6000 })
    let signal = 0
    for (let i = 0; i < g.count; i++) {
      if (g.color[i * 3] === 1 && Math.abs(g.color[i * 3 + 1] - PALETTE.signal[1]) < 1e-6) signal++
    }
    const ratio = signal / g.count
    expect(ratio).toBeGreaterThan(SIGNAL_RATIO - 0.02)
    expect(ratio).toBeLessThan(SIGNAL_RATIO + 0.02)
  })

  it('sizes points between 0.6 and 2.4', () => {
    const g = buildFieldGeometry({ count: 2000 })
    for (const s of g.size) {
      expect(s).toBeGreaterThanOrEqual(0.6)
      expect(s).toBeLessThanOrEqual(2.4)
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/journey/galaxy.test.ts`
Expected: FAIL — cannot find module `./galaxy`.

- [ ] **Step 3: Implement**

```ts
// lib/journey/galaxy.ts
export interface FieldGeometry {
  count: number
  /** xyz per point, face-on log-spiral galaxy in the XY plane. */
  galaxy: Float32Array
  /** xyz per point, jittered cubic lattice (the "ordered" state). */
  lattice: Float32Array
  /** rgb per point, 0..1. */
  color: Float32Array
  /** point size multiplier, 0.6..2.4. */
  size: Float32Array
  /** twinkle phase, 0..2π. */
  seed: Float32Array
}

export interface GalaxyOptions {
  count: number
  seed?: number
  arms?: number
  radius?: number
  latticeSize?: number
}

/** Site palette in linear-ish 0..1 (paper #f5f1ea, signal #ff3b1f, ash #a09690). */
export const PALETTE = {
  paper: [0.961, 0.945, 0.918],
  signal: [1.0, 0.231, 0.122],
  ash: [0.627, 0.588, 0.565],
} as const

export const SIGNAL_RATIO = 0.09
export const ASH_RATIO = 0.03

/** mulberry32: tiny deterministic PRNG so the field is identical on every load. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildFieldGeometry({
  count,
  seed = 20260902,
  arms = 3,
  radius = 5,
  latticeSize = 9,
}: GalaxyOptions): FieldGeometry {
  const rng = createRng(seed)
  const galaxy = new Float32Array(count * 3)
  const lattice = new Float32Array(count * 3)
  const color = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const seedArr = new Float32Array(count)

  const side = Math.ceil(Math.cbrt(count))
  const cell = latticeSize / side
  const jitter = () => (rng() - 0.5) * cell * 0.16

  for (let i = 0; i < count; i++) {
    // --- galaxy: dense core, three twisted arms, thin disc ---
    const r = radius * (0.04 + 0.96 * Math.pow(rng(), 0.75))
    const armAngle = (i % arms) * ((Math.PI * 2) / arms)
    const twist = r * 0.85
    const spread = (1 - r / radius) * 0.35 + 0.08
    const sgn = () => (rng() < 0.5 ? 1 : -1)
    const rx = Math.pow(rng(), 3) * sgn() * spread * radius * 0.3
    const ry = Math.pow(rng(), 3) * sgn() * spread * radius * 0.3
    const rz = Math.pow(rng(), 3) * sgn() * spread * radius * 0.12
    const a = armAngle + twist
    galaxy[i * 3] = Math.cos(a) * r + rx
    galaxy[i * 3 + 1] = Math.sin(a) * r + ry
    galaxy[i * 3 + 2] = rz

    // --- lattice: centred cube grid with slight jitter ---
    const ix = i % side
    const iy = Math.floor(i / side) % side
    const iz = Math.floor(i / (side * side))
    lattice[i * 3] = (ix + 0.5) * cell - latticeSize / 2 + jitter()
    lattice[i * 3 + 1] = (iy + 0.5) * cell - latticeSize / 2 + jitter()
    lattice[i * 3 + 2] = (iz + 0.5) * cell - latticeSize / 2 + jitter()

    // --- colour: mostly paper, ~9% signal, ~3% ash; warm the core ---
    const roll = rng()
    const base =
      roll < SIGNAL_RATIO ? PALETTE.signal : roll < SIGNAL_RATIO + ASH_RATIO ? PALETTE.ash : PALETTE.paper
    const core = r < radius * 0.2 ? 0.25 : 0
    color[i * 3] = base[0] * (1 - core) + PALETTE.signal[0] * core
    color[i * 3 + 1] = base[1] * (1 - core) + PALETTE.signal[1] * core
    color[i * 3 + 2] = base[2] * (1 - core) + PALETTE.signal[2] * core

    size[i] = 0.6 + rng() * 1.8
    seedArr[i] = rng() * Math.PI * 2
  }

  return { count, galaxy, lattice, color, size, seed: seedArr }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/journey/galaxy.test.ts`
Expected: PASS (6 tests). If the "signal-red" test fails, note that core-blended signal points still have `r = 1` and `g = 0.231` exactly (signal blended with itself), so the count is exact; a failure means the PRNG changed.

- [ ] **Step 5: Commit**

```bash
git add lib/journey/galaxy.ts lib/journey/galaxy.test.ts
git commit -m "feat(journey): deterministic galaxy/lattice point geometry

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Journey scroll store + React bindings

**Files:**
- Create: `lib/journey/store.ts`
- Test: `lib/journey/store.test.ts`

**Interfaces:**
- Consumes: `CHAPTERS`, `ChapterId` (Task 2).
- Produces: `interface ChapterBounds { id; top; height }`, `interface JourneyState { page; chapter; chapterProgress; heroProgress; scrollY; velocity }`, `SERVER_STATE`, `computePageProgress(scrollY, scrollHeight, viewportH)`, `resolveChapter(bounds, scrollY, viewportH): { id; progress }`, `measureBounds()`, `createJourneyStore()`, `getJourneyStore()`, hooks `useJourney()` and `useJourneyChapter()`. Sets CSS vars `--journey-p` and `--chapter-p` on `<html>`.

- [ ] **Step 1: Write the failing test**

```ts
// lib/journey/store.test.ts
import { describe, it, expect } from 'vitest'
import { computePageProgress, resolveChapter, type ChapterBounds } from './store'

describe('computePageProgress', () => {
  it('is 0 at the top and 1 at the bottom', () => {
    expect(computePageProgress(0, 5000, 900)).toBe(0)
    expect(computePageProgress(4100, 5000, 900)).toBe(1)
    expect(computePageProgress(2050, 5000, 900)).toBeCloseTo(0.5)
  })
  it('clamps and tolerates short documents', () => {
    expect(computePageProgress(9999, 5000, 900)).toBe(1)
    expect(computePageProgress(-5, 5000, 900)).toBe(0)
    expect(computePageProgress(0, 800, 900)).toBe(0)
  })
})

describe('resolveChapter', () => {
  const vh = 900
  const bounds: ChapterBounds[] = [
    { id: 'home', top: 0, height: 900 },
    { id: 'about', top: 900, height: 1200 },
    { id: 'projects', top: 2100, height: 3400 },
  ]

  it('starts on home with progress 0', () => {
    expect(resolveChapter(bounds, 0, vh)).toEqual({ id: 'home', progress: 0 })
  })

  it('measures hero progress as how far the hero has scrolled past the top', () => {
    expect(resolveChapter(bounds, 450, vh)).toEqual({ id: 'home', progress: 0.5 })
  })

  it('switches chapters when the next top crosses the 35% viewport line', () => {
    expect(resolveChapter(bounds, 584, vh).id).toBe('home')
    expect(resolveChapter(bounds, 585, vh).id).toBe('about')
  })

  it('measures mid-page chapters by the viewport midline', () => {
    // midline = 900 + 450 = 1350; about spans 900..2100 → (1350-900)/1200
    expect(resolveChapter(bounds, 900, vh).progress).toBeCloseTo(0.375)
  })

  it('clamps progress to [0,1]', () => {
    expect(resolveChapter(bounds, 9000, vh)).toEqual({ id: 'projects', progress: 1 })
  })

  it('returns home when nothing is measured yet', () => {
    expect(resolveChapter([], 300, vh)).toEqual({ id: 'home', progress: 0 })
  })

  it('works when optional chapters (blog) are absent', () => {
    const noBlog: ChapterBounds[] = [
      { id: 'faq', top: 0, height: 600 },
      { id: 'contact', top: 600, height: 800 },
    ]
    expect(resolveChapter(noBlog, 700, vh).id).toBe('contact')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/journey/store.test.ts`
Expected: FAIL — cannot find module `./store`.

- [ ] **Step 3: Implement**

```ts
// lib/journey/store.ts
import { useSyncExternalStore } from 'react'
import { CHAPTERS, type ChapterId } from './chapters'

export interface ChapterBounds {
  id: ChapterId
  /** Document-space top (px). */
  top: number
  height: number
}

export interface JourneyState {
  /** Whole-document progress 0..1. */
  page: number
  chapter: ChapterId
  /** Progress through the active chapter 0..1 (see resolveChapter). */
  chapterProgress: number
  /** 0 at page top, 1 once the hero has scrolled past. */
  heroProgress: number
  scrollY: number
  /** px per ms, signed. */
  velocity: number
}

export const SERVER_STATE: JourneyState = {
  page: 0,
  chapter: 'home',
  chapterProgress: 0,
  heroProgress: 0,
  scrollY: 0,
  velocity: 0,
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** 0 at the top, 1 when the document bottom meets the viewport bottom. */
export function computePageProgress(scrollY: number, scrollHeight: number, viewportH: number): number {
  return clamp01(scrollY / Math.max(scrollHeight - viewportH, 1))
}

/**
 * Active chapter = the last chapter whose top is above the viewport's 35% line.
 * Progress: for the first chapter (hero) it is how far the chapter has scrolled
 * past the viewport top (0 at page top, 1 once fully gone); for every other
 * chapter it is how far the viewport midline has travelled through it.
 */
export function resolveChapter(
  bounds: ChapterBounds[],
  scrollY: number,
  viewportH: number,
): { id: ChapterId; progress: number } {
  if (bounds.length === 0) return { id: 'home', progress: 0 }
  const line = scrollY + viewportH * 0.35
  let idx = 0
  for (let i = 0; i < bounds.length; i++) if (bounds[i].top <= line) idx = i
  const b = bounds[idx]
  const h = Math.max(b.height, 1)
  const progress =
    idx === 0 ? clamp01((scrollY - b.top) / h) : clamp01((scrollY + viewportH * 0.5 - b.top) / h)
  return { id: b.id, progress }
}

/** Reads the current document position of every chapter section that exists. */
export function measureBounds(): ChapterBounds[] {
  const y = window.scrollY
  const out: ChapterBounds[] = []
  for (const c of CHAPTERS) {
    const el = document.getElementById(c.id)
    if (!el) continue
    const r = el.getBoundingClientRect()
    out.push({ id: c.id, top: r.top + y, height: r.height })
  }
  return out
}

type Listener = (state: JourneyState) => void

export interface JourneyStore {
  get(): JourneyState
  subscribe(fn: Listener): () => void
  /** Re-measure section bounds (call after layout-affecting changes). */
  refresh(): void
  destroy(): void
}

export function createJourneyStore(): JourneyStore {
  const html = document.documentElement
  const listeners = new Set<Listener>()
  let state: JourneyState = SERVER_STATE
  let bounds: ChapterBounds[] = []
  let heroHeight = Math.max(window.innerHeight, 1)
  let raf = 0
  let lastY = window.scrollY
  let lastT = performance.now()

  const update = () => {
    raf = 0
    const y = window.scrollY
    const vh = window.innerHeight
    const now = performance.now()
    const page = computePageProgress(y, html.scrollHeight, vh)
    const { id, progress } = resolveChapter(bounds, y, vh)
    const velocity = (y - lastY) / Math.max(now - lastT, 1)
    lastY = y
    lastT = now
    const next: JourneyState = {
      page,
      chapter: id,
      chapterProgress: progress,
      heroProgress: clamp01(y / heroHeight),
      scrollY: y,
      velocity,
    }
    const changed =
      next.page !== state.page ||
      next.chapter !== state.chapter ||
      next.chapterProgress !== state.chapterProgress ||
      next.scrollY !== state.scrollY
    state = next
    html.style.setProperty('--journey-p', page.toFixed(4))
    html.style.setProperty('--chapter-p', progress.toFixed(4))
    if (changed) listeners.forEach((fn) => fn(state))
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }
  const refresh = () => {
    bounds = measureBounds()
    const hero = bounds.find((b) => b.id === 'home')
    heroHeight = Math.max(hero?.height ?? window.innerHeight, 1)
    schedule()
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', refresh)
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => refresh()) : null
  ro?.observe(document.body)
  if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {})
  refresh()

  return {
    get: () => state,
    subscribe: (fn) => {
      listeners.add(fn)
      return () => {
        listeners.delete(fn)
      }
    },
    refresh,
    destroy: () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', refresh)
      ro?.disconnect()
      if (raf) cancelAnimationFrame(raf)
      listeners.clear()
    },
  }
}

let singleton: JourneyStore | null = null

/** Client-only lazy singleton. */
export function getJourneyStore(): JourneyStore {
  if (typeof window === 'undefined') throw new Error('getJourneyStore is client-only')
  if (!singleton) singleton = createJourneyStore()
  return singleton
}

// Stable function identities so useSyncExternalStore does not resubscribe each render.
const subscribe = (cb: () => void) => getJourneyStore().subscribe(cb)
const getSnapshot = () => (singleton ? singleton.get() : SERVER_STATE)
const getServerSnapshot = () => SERVER_STATE
const getChapterSnapshot = () => (singleton ? singleton.get().chapter : SERVER_STATE.chapter)
const getServerChapter = () => SERVER_STATE.chapter

/** Full state; re-renders on every scroll frame. Prefer useJourneyChapter for chrome. */
export function useJourney(): JourneyState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** Active chapter id only; re-renders only when the chapter changes. */
export function useJourneyChapter(): ChapterId {
  return useSyncExternalStore(subscribe, getChapterSnapshot, getServerChapter)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run lib/journey/store.test.ts`
Expected: PASS (9 tests). Then run the whole suite: `npm test` → all green.

- [ ] **Step 5: Commit**

```bash
git add lib/journey/store.ts lib/journey/store.test.ts
git commit -m "feat(journey): scroll store with chapter resolution and React bindings

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Motion gate (head script), journey CSS, and `main` overflow fix

**Files:**
- Modify: `app/layout.tsx` (the `<html>` tag and `<head>` block, lines 175-192)
- Modify: `app/page.tsx` (the `<main>` tag, line 48)
- Modify: `app/globals.css` (append a new block after the `.tap-44` rule at the end of the file)

**Interfaces:**
- Produces: `html.motion` class (JS on + no reduced-motion) before first paint; CSS classes `.journey-main`, `.journey-canvas(.is-ready)`, `html.field-ready .hero-poster`, `html.motion .hero-rise/.hero-rule/.hero-stack-icon/.hero-scroll-wire`, `.pin-act[data-pinned="true"] > .pin-stage`, `.watermark-num`, `.journey-wire`, `.journey-readout-wire`, `.silence-beat`, `.split-line`.

- [ ] **Step 1: Add the inline motion script and suppress the html hydration warning**

In `app/layout.tsx`, change the `<html ...>` opening tag to:

```tsx
    <html
      lang="en"
      className={`scroll-smooth ${jetBrainsMono.variable} ${rubik.variable}`}
      suppressHydrationWarning
    >
```

and add as the first child of `<head>` (before the two `<link rel="preconnect">` lines):

```tsx
        {/* Motion gate: marks the document motion-capable before first paint so CSS can
            hold decorative pre-states (hero intro transforms) without ever hiding
            content. Reduced-motion users and no-JS crawlers never get the class. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}}catch(e){}",
          }}
        />
```

- [ ] **Step 2: Let sticky work inside `main`**

In `app/page.tsx` replace

```tsx
    <main className="relative min-h-screen overflow-hidden bg-ink">
```

with

```tsx
    <main className="journey-main relative min-h-screen bg-ink">
```

(`overflow: hidden` on an ancestor turns it into the scroll container and breaks `position: sticky`; `.journey-main` uses `overflow-x: clip` instead.)

- [ ] **Step 3: Append the journey CSS**

Append to the end of `app/globals.css`:

```css
/* =========================================================================
   Journey — scroll-driven homepage (spec: docs/superpowers/specs/2026-09-02-*)
   Rules of the road:
   - Nothing here hides content in the SSR HTML. Pre-animation hidden states
     are applied by JS after hydration, only under html.motion.
   - Transforms and opacity only. Sticky, never scroll-jacking.
   ========================================================================= */

/* `overflow: hidden` on <main> would make it the scroll container and kill
   position: sticky for the pinned act. `clip` clips without scrolling. */
.journey-main {
  overflow-x: clip;
}

/* Fixed WebGL layer behind the whole page (z-0; content wrapper is z-10). */
.journey-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.4s linear;
}
.journey-canvas.is-ready {
  opacity: 1;
}

/* Hero poster is the instant paint + the no-WebGL/reduced-motion fallback.
   It fades out once the field is live. */
.hero-poster {
  transition: opacity 1.4s linear;
}
html.field-ready .hero-poster {
  opacity: 0;
}

/* Hero intro pre-states (transform only, never opacity, so the LCP paints).
   anime.js animates these to identity on mount and reverts on language switch. */
html.motion .hero-rise {
  transform: translateY(18px);
}
html.motion .hero-rule,
html.motion .hero-scroll-wire {
  transform: scaleX(0);
  transform-origin: left center;
}
html.motion[dir="rtl"] .hero-rule,
html.motion[dir="rtl"] .hero-scroll-wire {
  transform-origin: right center;
}
html.motion .hero-stack-icon {
  transform: translateX(8px);
}
html.motion[dir="rtl"] .hero-stack-icon {
  transform: translateX(-8px);
}
.hero-photo {
  transform-style: preserve-3d;
  will-change: transform;
}

/* Pinned act: a tall section whose stage sticks for the travel.
   Only when JS decided to pin (desktop + motion); otherwise plain flow. */
.pin-act {
  position: relative;
}
html.motion .pin-act[data-pinned="true"] {
  height: calc(var(--span, 3.8) * 100vh);
}
html.motion .pin-act[data-pinned="true"] > .pin-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-top: 5rem;
  padding-bottom: 2rem;
}
html.motion .pin-act[data-pinned="true"] .pin-heading {
  font-size: clamp(2rem, 3.6vw, 3.25rem);
}

/* Big mono chapter numeral on a far plane behind a section header. */
.watermark-num {
  position: absolute;
  inset-inline-end: -0.05em;
  top: -0.55em;
  z-index: -1;
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: clamp(6rem, 18vw, 16rem);
  line-height: 1;
  letter-spacing: -0.06em;
  color: var(--paper);
  opacity: 0.045;
  pointer-events: none;
  user-select: none;
}

/* 1px page-progress wire under the navbar; driven by a CSS var the store sets. */
.journey-wire {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--signal);
  transform-origin: left center;
  transform: scaleX(var(--journey-p, 0));
  pointer-events: none;
}
[dir="rtl"] .journey-wire {
  transform-origin: right center;
}

/* Chapter-progress wire in the fixed readout. */
.journey-readout-wire {
  position: relative;
  width: 120px;
  height: 1px;
  background: var(--wire);
  overflow: hidden;
}
.journey-readout-wire > span {
  position: absolute;
  inset: 0;
  background: var(--signal);
  transform-origin: left center;
  transform: scaleX(var(--chapter-p, 0));
}
[dir="rtl"] .journey-readout-wire > span {
  transform-origin: right center;
}

/* Authored silence: field-only beat before the peak (desktop, motion only). */
@media (min-width: 1024px) {
  html.motion .silence-beat {
    padding-bottom: 50vh;
  }
}

/* anime.js splitText line wrappers. */
.split-line {
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .journey-canvas {
    display: none;
  }
}
```

- [ ] **Step 4: Verify the build and the gate**

```bash
npm run build 2>&1 | tail -15
(npm start -- -p 3000 > /tmp/next.log 2>&1 &) ; sleep 5
curl -s http://localhost:3000/ | grep -o "classList.add('motion')" | head -1
curl -s http://localhost:3000/ | grep -o 'class="journey-main[^"]*"'
pkill -f "next start"
```
Expected: build succeeds; both greps print a match.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/page.tsx app/globals.css
git commit -m "feat(journey): motion gate, sticky-safe main, and journey CSS utilities

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: anime.js scope hook and reveal helpers

**Files:**
- Create: `lib/journey/useAnimeScope.ts`
- Create: `lib/journey/reveal.ts`
- Test: `lib/journey/reveal.test.ts` (pure helpers only)

**Interfaces:**
- Produces:
  - `isMotionEnabled(): boolean`
  - `useAnimeScope<T>(build: (scope: Scope, ctx: { motion: boolean; rtl: boolean; desktop: boolean }) => void, deps): RefObject<T>`
  - `EASE_OUT`, `PARALLAX_PX = 220`
  - `viewportRelation(rect, vh): 'above' | 'in' | 'below'`, `parallaxRange(depth, amplitude?): [number, number]`
  - `revealUp(targets, { y?, duration?, staggerMs?, delay?, trigger? })`
  - `revealSlide(el, side: 'start' | 'end', rtl, { trigger? })`
  - `revealLines(el, { staggerMs?, duration? })`
  - `parallax(el, depth, trigger, { enter?, leave?, fromZero?, amplitude? })`, `parallaxLayers(root, opts?)`

- [ ] **Step 1: Write the failing test for the pure helpers**

```ts
// lib/journey/reveal.test.ts
import { describe, it, expect } from 'vitest'
import { viewportRelation, parallaxRange, PARALLAX_PX } from './reveal'

describe('viewportRelation', () => {
  const vh = 1000
  it('is above when the element has fully scrolled past', () => {
    expect(viewportRelation({ top: -500, bottom: -10 }, vh)).toBe('above')
  })
  it('is in when the top is inside the first 90% of the viewport', () => {
    expect(viewportRelation({ top: 100, bottom: 400 }, vh)).toBe('in')
    expect(viewportRelation({ top: 899, bottom: 1200 }, vh)).toBe('in')
    expect(viewportRelation({ top: -50, bottom: 300 }, vh)).toBe('in')
  })
  it('is below beyond the 90% line', () => {
    expect(viewportRelation({ top: 900, bottom: 1300 }, vh)).toBe('below')
    expect(viewportRelation({ top: 5000, bottom: 5300 }, vh)).toBe('below')
  })
})

describe('parallaxRange', () => {
  it('far planes lag (negative → positive), near planes lead', () => {
    expect(parallaxRange(0.1)).toEqual([-0.1 * PARALLAX_PX, 0.1 * PARALLAX_PX])
    expect(parallaxRange(-0.2)).toEqual([0.2 * PARALLAX_PX, -0.2 * PARALLAX_PX])
  })
  it('depth 0 is static and amplitude scales', () => {
    expect(parallaxRange(0)).toEqual([-0, 0])
    expect(parallaxRange(0.5, 100)).toEqual([-50, 50])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/journey/reveal.test.ts`
Expected: FAIL — cannot find module `./reveal`.

- [ ] **Step 3: Implement the scope hook**

```ts
// lib/journey/useAnimeScope.ts
'use client'

import { useEffect, useRef, type DependencyList, type RefObject } from 'react'
import { createScope, type Scope } from 'animejs'

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
): RefObject<T> {
  const root = useRef<T>(null)
  useEffect(() => {
    if (!root.current) return
    const scope = createScope({
      root,
      mediaQueries: {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 1024px)',
      },
    })
    scope.add((self) => {
      build(self, {
        motion: isMotionEnabled() && !self.matches.reduceMotion,
        rtl: document.documentElement.dir === 'rtl',
        desktop: !!self.matches.desktop,
      })
    })
    return () => scope.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return root
}
```

- [ ] **Step 4: Implement the reveal helpers**

```ts
// lib/journey/reveal.ts
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
function playOnce(list: HTMLElement[], trigger: Element, make: () => JSAnimation): JSAnimation | null {
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
  return playOnce(list, trigger, () => {
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
  return playOnce([el], trigger, () => {
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
    accessible: true,
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
```

- [ ] **Step 5: Run the tests and typecheck**

Run: `npx vitest run lib/journey/reveal.test.ts && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "journey|error" | head -20`
Expected: PASS (5 tests); no TypeScript errors in `lib/journey/*`.

- [ ] **Step 6: Commit**

```bash
git add lib/journey/useAnimeScope.ts lib/journey/reveal.ts lib/journey/reveal.test.ts
git commit -m "feat(journey): anime.js scope hook and reveal/parallax helpers

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: three.js galaxy field + lazy stage mounted on the homepage

**Files:**
- Create: `components/journey/GalaxyField.ts`
- Create: `components/journey/JourneyStage.tsx`
- Modify: `app/page.tsx` (imports + `<main>` children)

**Interfaces:**
- Consumes: `buildFieldGeometry` (Task 4), `fieldState`/`FieldState` (Task 3), `getJourneyStore` (Task 5), `isMotionEnabled` (Task 7).
- Produces: `class GalaxyField { constructor(canvas, { count, dpr }); setTarget(state: FieldState); setPointer(x, y); resize(); start(); stop(); dispose() }`, default export `JourneyStage` (client component), `html.field-ready` class once the canvas renders.

- [ ] **Step 1: Write the field class**

```ts
// components/journey/GalaxyField.ts
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { buildFieldGeometry } from '@/lib/journey/galaxy'
import type { FieldState } from '@/lib/journey/field'

const VERT = /* glsl */ `
attribute vec3 aGalaxy;
attribute vec3 aLattice;
attribute vec3 aColor;
attribute float aSize;
attribute float aSeed;
uniform float uSpin;
uniform float uOrder;
uniform float uTime;
uniform float uPixelRatio;
uniform float uDensity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float c = cos(uSpin);
  float s = sin(uSpin);
  vec3 g = vec3(aGalaxy.x * c - aGalaxy.y * s, aGalaxy.x * s + aGalaxy.y * c, aGalaxy.z);
  float k = uOrder * uOrder * (3.0 - 2.0 * uOrder);
  vec3 p = mix(g, aLattice, k);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (16.0 / -mv.z);
  float tw = 0.7 + 0.3 * sin(uTime * 0.9 + aSeed);
  vColor = aColor;
  vAlpha = tw * uDensity;
}`

const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float r2 = dot(d, d);
  if (r2 > 0.25) discard;
  float a = smoothstep(0.25, 0.02, r2);
  gl_FragColor = vec4(vColor, a * vAlpha * 0.6);
}`

export interface GalaxyFieldOptions {
  count: number
  dpr: number
}

const KEYS = ['spin', 'order', 'dolly', 'density'] as const

/**
 * One Points mesh whose vertices carry both a galaxy position and a lattice
 * position; `uOrder` mixes between them. Renders on demand: full rate while
 * the state or pointer is moving, ≤ 20 fps twinkle when idle.
 */
export class GalaxyField {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera: PerspectiveCamera
  private geometry: BufferGeometry
  private material: ShaderMaterial
  private current: FieldState = { spin: 0, order: 0, dolly: 8, density: 1 }
  private target: FieldState = { spin: 0, order: 0, dolly: 8, density: 1 }
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  private raf = 0
  private running = false
  private lastRender = 0
  private readonly t0 = performance.now()
  private readonly onLost = (e: Event) => {
    e.preventDefault()
    this.stop()
  }
  private readonly onRestored = () => this.start()

  constructor(private canvas: HTMLCanvasElement, opts: GalaxyFieldOptions) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
      premultipliedAlpha: false,
    })
    this.renderer.setPixelRatio(opts.dpr)
    this.renderer.setClearColor(0x000000, 0)

    this.camera = new PerspectiveCamera(50, 1, 0.1, 100)
    this.camera.position.z = this.current.dolly

    const g = buildFieldGeometry({ count: opts.count })
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute('position', new BufferAttribute(g.galaxy, 3))
    this.geometry.setAttribute('aGalaxy', new BufferAttribute(g.galaxy, 3))
    this.geometry.setAttribute('aLattice', new BufferAttribute(g.lattice, 3))
    this.geometry.setAttribute('aColor', new BufferAttribute(g.color, 3))
    this.geometry.setAttribute('aSize', new BufferAttribute(g.size, 1))
    this.geometry.setAttribute('aSeed', new BufferAttribute(g.seed, 1))

    this.material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
      uniforms: {
        uSpin: { value: 0 },
        uOrder: { value: 0 },
        uTime: { value: 0 },
        uPixelRatio: { value: opts.dpr },
        uDensity: { value: 1 },
      },
    })

    const points = new Points(this.geometry, this.material)
    points.frustumCulled = false
    this.scene.add(points)

    canvas.addEventListener('webglcontextlost', this.onLost)
    canvas.addEventListener('webglcontextrestored', this.onRestored)
    this.resize()
  }

  setTarget(state: FieldState) {
    this.target = state
  }

  /** x, y in -0.5..0.5 (viewport-relative pointer). */
  setPointer(x: number, y: number) {
    this.pointer.tx = x
    this.pointer.ty = y
  }

  resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.render(performance.now())
  }

  start() {
    if (this.running) return
    this.running = true
    this.raf = requestAnimationFrame(this.tick)
  }

  stop() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  dispose() {
    this.stop()
    this.canvas.removeEventListener('webglcontextlost', this.onLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored)
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }

  private readonly tick = (now: number) => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.tick)
    const c = this.current
    const t = this.target
    let delta = 0
    for (const k of KEYS) {
      const d = t[k] - c[k]
      c[k] += d * 0.08
      delta += Math.abs(d)
    }
    const p = this.pointer
    const pd = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y)
    p.x += (p.tx - p.x) * 0.06
    p.y += (p.ty - p.y) * 0.06
    const busy = delta > 1e-3 || pd > 1e-3
    if (!busy && now - this.lastRender < 50) return
    this.render(now)
  }

  private render(now: number) {
    this.lastRender = now
    const c = this.current
    const u = this.material.uniforms
    u.uSpin.value = c.spin
    u.uOrder.value = c.order
    u.uDensity.value = c.density
    u.uTime.value = (now - this.t0) / 1000
    this.camera.position.set(this.pointer.x * 0.9, -this.pointer.y * 0.6, c.dolly)
    this.camera.lookAt(0, 0, 0)
    this.renderer.render(this.scene, this.camera)
  }
}
```

- [ ] **Step 2: Write the stage component (lazy, gated)**

```tsx
// components/journey/JourneyStage.tsx
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
```

- [ ] **Step 3: Mount it on the homepage**

In `app/page.tsx` add the import after `ArabicSeoContent`:

```tsx
import JourneyStage from '@/components/journey/JourneyStage'
```

and replace the comment block + `<ArabicSeoContent />` region inside `<main>` so it reads:

```tsx
      {/* Fixed WebGL depth field (galaxy → lattice), behind the z-10 content.
          Lazy, idle-mounted, gated on html.motion + WebGL2. Never SSR content. */}
      <JourneyStage />

      {/* Always-rendered Arabic SEO block — keeps Arabic queries indexable
          regardless of the EN/AR toggle state on first render. */}
      <ArabicSeoContent />
```

- [ ] **Step 4: Verify in the browser**

```bash
npm run build 2>&1 | grep -E "Compiled|error|/ +" | head; (npm start -- -p 3000 > /tmp/next.log 2>&1 &); sleep 5
```
Then with the chrome-devtools MCP: `new_page` → `http://localhost:3000/`, `resize_page` 1440×900, wait 3 s, `list_console_messages` (expect no errors), `take_screenshot` (expect faint warm particles behind the hero; poster faded), `evaluate_script` → `document.documentElement.classList.contains('field-ready')` → `true`. Then `evaluate_script` → `performance.getEntriesByType('resource').filter(r=>r.name.includes('_next/static/chunks')).map(r=>[r.name.split('/').pop(), Math.round(r.transferSize/1024)])` and confirm the largest chunk (three) is loaded after the page chunks. Stop the server afterwards.

- [ ] **Step 5: Commit**

```bash
git add components/journey/GalaxyField.ts components/journey/JourneyStage.tsx app/page.tsx
git commit -m "feat(journey): lazy three.js galaxy→lattice field behind the homepage

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Hero — retire the video, add layered parallax and the intro

**Files:**
- Modify: `components/Hero.tsx` (full rewrite; copy is unchanged)

**Interfaces:**
- Consumes: `useAnimeScope`, `EASE_OUT`, `parallax`, `PARALLAX_PX` (Task 7).
- Produces: hero markup with classes `hero-poster`, `hero-rise`, `hero-rule`, `hero-stack-icon`, `hero-scroll-wire`, `hero-photo` and `data-depth` layers (all styled by Task 6 CSS).

- [ ] **Step 1: Replace `components/Hero.tsx` with**

```tsx
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { animate, createTimeline, stagger } from 'animejs'
import { FaLinkedin, FaGithub, FaArrowDown } from 'react-icons/fa'
import { SiTypescript, SiPython, SiReact, SiNextdotjs, SiOpenai, SiDocker } from 'react-icons/si'
import { useLanguage } from '@/lib/LanguageContext'
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { EASE_OUT, parallax } from '@/lib/journey/reveal'

const orbitIcons = [
  { Icon: SiTypescript, label: 'TypeScript' },
  { Icon: SiPython, label: 'Python' },
  { Icon: SiReact, label: 'React' },
  { Icon: SiNextdotjs, label: 'Next.js' },
  { Icon: SiOpenai, label: 'OpenAI' },
  { Icon: SiDocker, label: 'Docker' },
]

export default function Hero() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  // Intro (transform-only, so the LCP text paints before hydration) + layered
  // parallax as the hero scrolls out. The WebGL galaxy behind is driven by the
  // journey store, not by this component.
  const root = useAnimeScope<HTMLElement>((_, { motion, rtl }) => {
    const section = root.current
    if (!section || !motion) return

    createTimeline({ defaults: { ease: EASE_OUT } })
      .add('.hero-rise', { translateY: [18, 0], duration: 800, delay: stagger(80) }, 0)
      .add('.hero-rule', { scaleX: [0, 1], duration: 900 }, 0)
      .add('.hero-stack-icon', { translateX: [rtl ? -8 : 8, 0], duration: 500, delay: stagger(60) }, 200)
      .add('.hero-scroll-wire', { scaleX: [0, 1], duration: 700 }, 600)

    section.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
      parallax(el, parseFloat(el.dataset.depth || '0'), section, {
        enter: 'top top',
        leave: 'bottom top',
        fromZero: true,
      })
    })
  }, [language])

  // Pointer tilt on the photo frame (fine pointers only). Listeners live in
  // their own effect so they are removed independently of the anime scope.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (!document.documentElement.classList.contains('motion')) return
    const frame = root.current?.querySelector<HTMLElement>('.hero-photo')
    if (!frame) return
    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      animate(frame, { rotateY: x * 10, rotateX: -y * 8, duration: 500, ease: EASE_OUT })
    }
    const onLeave = () => animate(frame, { rotateY: 0, rotateX: 0, duration: 700, ease: EASE_OUT })
    frame.addEventListener('pointermove', onMove)
    frame.addEventListener('pointerleave', onLeave)
    return () => {
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerleave', onLeave)
    }
  }, [root])

  return (
    <section
      ref={root}
      id="home"
      className="relative min-h-screen flex items-center px-6 lg:px-10 pt-24 pb-16 border-b border-wire"
    >
      {/* Poster = instant paint (LCP-safe) and the no-WebGL / reduced-motion
          fallback. The fixed WebGL field lives behind the page; once it is live
          (html.field-ready) this poster fades out. */}
      <div
        aria-hidden="true"
        className="hero-poster absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.55]"
      >
        <Image src="/galaxy-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      {/* Scrims: darken the text side and anchor the bottom into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-ink via-ink/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-ink via-transparent to-ink/30"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div
          data-depth="0.05"
          className="relative grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pb-8 mb-12 text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
          <span aria-hidden="true" className="hero-rule absolute inset-x-0 bottom-0 h-px bg-wire" />
          <div>
            <span className="text-ash/60">{t('file', 'الملف')}</span>{' '}
            <span className="text-paper">/karem.profile</span>
          </div>
          <div>
            <span className="text-ash/60">{t('role', 'الدور')}</span>{' '}
            <span className="text-paper">{t('full-stack · devops', 'مطور · ديف-أوبس')}</span>
          </div>
          <div>
            <span className="text-ash/60">{t('based', 'المقر')}</span>{' '}
            <span className="text-paper">{t('cairo · eg', 'القاهرة · مصر')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot" aria-hidden="true" />
            <span className="text-paper">{t('open · for · work', 'متاح · للعمل')}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <span className="tab-eyebrow mb-8">
              001 · {t('engineer.profile', 'ملف.المهندس')}
            </span>

            {/* Name. Arabic uses Rubik (Arabic-pairing) at same scale. The two
                lines carry `hero-rise` (CSS-gated 18px transform → 0 on intro). */}
            {ar ? (
              <h1 className="font-rubik font-extrabold tracking-[-0.02em] leading-[1.05] text-paper mt-6 mb-8">
                <span className="hero-rise block text-[2.75rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.5rem] xl:text-[6rem]">
                  ابوالمكارم
                </span>
                <span className="hero-rise block text-[2.75rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.5rem] xl:text-[6rem]">
                  شهود
                  <span className="text-signal" aria-hidden="true">.</span>
                </span>
              </h1>
            ) : (
              <h1 className="font-mono font-extrabold tracking-[-0.05em] leading-[0.92] text-paper mt-6 mb-8">
                <span className="hero-rise block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                  Abo-Elmakarem
                </span>
                <span className="hero-rise block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                  Shohoud
                  <span className="text-signal" aria-hidden="true">.</span>
                </span>
              </h1>
            )}

            <div
              data-depth="0.08"
              className={`text-base md:text-lg text-ash mb-10 leading-relaxed max-w-xl ${ar ? 'font-rubik' : 'font-mono'}`}
            >
              <p>
                {ar ? (
                  <>
                    مطور Full-Stack ومهندس DevOps وScrum Master في{' '}
                    <span className="text-paper underline decoration-signal decoration-1 underline-offset-4">
                      Ailigent
                    </span>
                    . أُشغّل ثلاث منصات SaaS مدعومة بالذكاء الاصطناعي (Tornix.ai، Oravex.app، Costra) لعملاء في مصر والإمارات والسعودية.
                  </>
                ) : (
                  <>
                    Full-Stack Developer, DevOps Engineer and Scrum Master at{' '}
                    <span className="text-paper underline decoration-signal decoration-1 underline-offset-4">
                      Ailigent
                    </span>
                    . Shipping three production AI SaaS (Tornix.ai, Oravex.app, Costra) across EG · UAE · KSA.
                  </>
                )}
              </p>
            </div>

            <div data-depth="0.12" className="flex flex-wrap gap-3 mb-10">
              <a
                href="/Aboelmakarem_Portfolio.pdf"
                download="Aboelmakarem_Portfolio.pdf"
                className={`group inline-flex items-center gap-3 px-5 py-3 border border-paper bg-paper text-ink text-sm font-medium tracking-wide hover:bg-signal hover:text-paper hover:border-signal transition-colors duration-150 ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <span>{t('Download my portfolio', 'تحميل البورتفوليو')}</span>
                <span className="text-ink group-hover:text-paper">{ar ? '←' : '→'}</span>
              </a>
              <a
                href="https://wa.me/201008867488"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp (opens in new tab)"
                className={`group inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper text-sm font-medium tracking-wide hover:border-signal hover:text-signal transition-colors duration-150 ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <span>{t('Contact me on WhatsApp', 'راسلني على واتساب')}</span>
                <span dir="ltr" className={`text-xs ${ar ? 'font-mono' : ''} text-ash group-hover:text-signal`}>+20 100 886 7488</span>
                <span className="text-ash group-hover:text-signal">↗</span>
              </a>
              <a
                href="#projects"
                className={`group inline-flex items-center gap-3 px-5 py-3 border border-wire text-ash text-sm tracking-wide hover:border-signal hover:text-signal transition-colors duration-150 ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <span>{t('View shipped work', 'استعرض المشاريع المنشورة')}</span>
              </a>
            </div>

            <div data-depth="0.14" className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.18em] text-ash">
              <span>{t('find ↦', 'تابعني ↦')}</span>
              <a
                href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ash hover:text-signal transition-colors duration-150 min-h-[44px]"
                aria-label="LinkedIn (opens in new tab)"
              >
                <FaLinkedin size={16} aria-hidden="true" />
                <span>linkedin</span>
              </a>
              <span aria-hidden="true" className="text-wire">/</span>
              <a
                href="https://github.com/karem505"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ash hover:text-signal transition-colors duration-150 min-h-[44px]"
                aria-label="GitHub (opens in new tab)"
              >
                <FaGithub size={16} aria-hidden="true" />
                <span>github</span>
              </a>
            </div>
          </div>

          {/* The profile photo is the LCP element — no enter animation. It sits on
              a near plane (negative depth) so it leads the scroll, and tilts under
              a fine pointer. */}
          <div data-depth="-0.18" className="order-1 lg:order-2 relative flex justify-center" style={{ perspective: '900px' }}>
            <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px]">
              <span aria-hidden="true" className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-signal" />
              <span aria-hidden="true" className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-signal" />

              <div className="hero-photo relative w-full h-full overflow-hidden border border-wire bg-graphite">
                <Image
                  src="/profile.jpg"
                  alt={t('Abo-Elmakarem Shohoud', 'ابوالمكارم شهود')}
                  fill
                  className="object-cover grayscale contrast-110 hover:grayscale-0 transition-[filter] duration-700"
                  priority
                  sizes="(max-width: 768px) 280px, 320px"
                />
                <div className="absolute bottom-2 left-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-paper/80 mix-blend-difference">
                  frame 01 · 2026
                </div>
              </div>

              <div
                data-depth="-0.28"
                className="hidden lg:grid absolute -right-14 top-0 bottom-0 grid-rows-6 gap-2"
                aria-label="Tech stack"
              >
                {orbitIcons.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="hero-stack-icon w-10 h-10 border border-wire flex items-center justify-center text-ash hover:border-signal hover:text-signal transition-colors duration-150"
                    title={label}
                  >
                    <Icon size={16} />
                  </div>
                ))}
              </div>

              <div className="lg:hidden absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
                {orbitIcons.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="w-9 h-9 border border-wire flex items-center justify-center text-ash"
                    title={label}
                  >
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          data-depth="0.2"
          className="mt-24 lg:mt-20 flex items-center gap-3 text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
          <span>{t('scroll', 'مرر')}</span>
          <FaArrowDown className="text-signal" size={10} />
          <span className="hero-scroll-wire h-px flex-1 max-w-[200px] bg-wire" />
          <span className="text-ash/60">002 / {t('about', 'نبذة')}</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck and run in the browser**

```bash
npx tsc --noEmit 2>&1 | grep -E "Hero|journey" ; npm run build 2>&1 | grep -E "error|Compiled" ; (npm start -- -p 3000 > /tmp/next.log 2>&1 &); sleep 5
```
chrome-devtools MCP at 1440×900: reload; the name lines rise into place, the meta rule draws, stack icons slide in; scroll 600px — the photo/icons move faster than the copy (parallax); move the pointer over the photo — it tilts; no console errors. Also check `?lang=ar`: intro replays, stack icons enter from the left. Take one screenshot at scrollY 0 and one at 500 for the record. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): replace scrubbed video with WebGL field, layered parallax and transform-only intro

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: About — line reveal, depth planes, watermark numeral

**Files:**
- Modify: `components/About.tsx`

**Interfaces:**
- Consumes: `useAnimeScope`, `revealUp`, `revealLines`, `parallaxLayers` (Task 7).

- [ ] **Step 1: Swap the imports and the scope**

Replace lines 1-15 of `components/About.tsx` (`'use client'` through `const ar = ...`) with:

```tsx
'use client'

import {
  FaCode, FaServer, FaUsers, FaMicrophone, FaChartLine, FaClipboardList
} from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { parallaxLayers, revealLines, revealUp } from '@/lib/journey/reveal'

export default function About() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const root = useAnimeScope<HTMLElement>((_, { motion }) => {
    const el = root.current
    if (!el || !motion) return
    const h2 = el.querySelector<HTMLElement>('[data-lines]')
    if (h2) revealLines(h2)
    revealUp(el.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: h2 ?? el })
    revealUp(el.querySelectorAll('[data-reveal-tile]'), { staggerMs: 60, y: 32 })
    const stack = el.querySelector<HTMLElement>('[data-stack]')
    if (stack) {
      revealUp(stack.querySelectorAll('[data-reveal-stack-head]'), { trigger: stack })
      revealUp(stack.querySelectorAll('[data-reveal-cell]'), { staggerMs: 40, y: 12, trigger: stack })
    }
    parallaxLayers(el)
  }, [language])
```

(`skillCategories` and `expertise` arrays stay exactly as they are.)

- [ ] **Step 2: Rewrite the JSX**

Replace everything from `return (` to the end of the component with:

```tsx
  return (
    <section id="about" ref={root} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative text-center mb-20">
          <span aria-hidden="true" className="watermark-num" data-depth="-0.35">002</span>
          <span data-reveal-head className="tab-eyebrow mb-6">002 · {t('about', 'نبذة')}</span>
          <h2
            data-lines
            className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}
          >
            {ar ? (
              <>
                مهندس بثلاث منصات<br />
                في الإنتاج<span className="text-signal">.</span>
              </>
            ) : (
              <>
                Engineer with three<br />
                shipped products<span className="text-signal">.</span>
              </>
            )}
          </h2>
          <p data-reveal-head className={`text-ash max-w-3xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {ar ? (
              <>
                مطور Full-Stack وخبير أتمتة بالذكاء الاصطناعي مقيم في القاهرة، مصر، بخبرة تتجاوز السنتين.
                في <span className="text-paper font-semibold">Ailigent</span> أعمل بشكل متزامن كـ Scrum Master ومهندس
                DevOps ومطور Full-Stack على ثلاث منصات SaaS حيّة —
                <span className="text-paper font-semibold"> Tornix.ai</span>،
                <span className="text-paper font-semibold"> Oravex.app</span>،
                و<span className="text-paper font-semibold"> Costra.net</span> —
                أُسلّم مشاريع تحول رقمي في مصر والإمارات والسعودية.
              </>
            ) : (
              <>
                Full-Stack Developer and AI automation expert based in Cairo, Egypt with 2+ years of experience.
                At <span className="text-paper font-semibold">Ailigent</span> I serve concurrently as Scrum Master,
                DevOps Engineer, and Full-Stack Developer across three live SaaS products —
                <span className="text-paper font-semibold"> Tornix.ai</span>,
                <span className="text-paper font-semibold"> Oravex.app</span>, and
                <span className="text-paper font-semibold"> Costra.net</span> — delivering digital
                transformation engagements across Egypt, UAE, and KSA.
              </>
            )}
          </p>
        </div>

        {/* Six expertise tiles on three depth planes (outer wrapper parallaxes,
            inner tile reveals) so the grid reads as layered, not flat. */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {expertise.map((item, index) => (
            <div key={item.title} data-depth={[0.06, 0.14, 0.22][index % 3]}>
              <div
                data-reveal-tile
                className="group relative h-full p-6 bg-graphite border border-wire hover:border-signal transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors duration-200">
                    <item.icon className="text-lg" />
                  </div>
                  <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className={`font-bold text-lg mb-2 text-paper group-hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}>
                  {item.title}
                </h3>
                <p className={`text-ash text-sm leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div data-stack className="mb-20">
          <div data-reveal-stack-head className="mb-8 flex items-baseline gap-4">
            <h3 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t('technical · stack', 'الحزمة · التقنية')}
            </h3>
            <span className="h-px flex-1 bg-wire" />
            <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash">
              {skillCategories.length} {t('categories', 'فئات')}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-wire border border-wire max-w-5xl mx-auto">
            {skillCategories.map((category) => (
              <div
                key={category.title}
                data-reveal-cell
                className="p-6 bg-ink hover:bg-graphite transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-wire">
                  <h4 className={`font-bold text-sm tracking-[0.04em] uppercase text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>{category.title}</h4>
                  <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash">{category.items.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <span key={item} className="tag-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
```

- [ ] **Step 3: Verify**

`npx tsc --noEmit 2>&1 | grep About`; build + start; in the browser scroll to About: the headline rises line by line, tiles stagger in and drift at three rates, the faint `002` numeral moves opposite to the tiles; toggle to AR and confirm the Arabic heading splits into whole words (no broken letters) and the numeral sits at the left edge. Confirm `document.querySelectorAll('.split-line').length` equals the visible line count and does not double after toggling EN → AR → EN. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add components/About.tsx
git commit -m "feat(about): anime line reveal, three-plane tile parallax, watermark numeral

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Experience — sliding plates, ticking bullets, overlap note, authored silence

**Files:**
- Modify: `components/Experience.tsx`

**Interfaces:**
- Consumes: `useAnimeScope`, `revealUp`, `revealSlide`, `revealLines`, `parallaxLayers`.

- [ ] **Step 1: Replace lines 1-13 (imports through `const ar`) with**

```tsx
'use client'

import { FaCode, FaClipboardList, FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { parallaxLayers, revealLines, revealSlide, revealUp } from '@/lib/journey/reveal'

export default function Experience() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const root = useAnimeScope<HTMLElement>((_, { motion, rtl }) => {
    const el = root.current
    if (!el || !motion) return
    const h2 = el.querySelector<HTMLElement>('[data-lines]')
    if (h2) revealLines(h2)
    revealUp(el.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: h2 ?? el })
    el.querySelectorAll<HTMLElement>('[data-plate]').forEach((plate) => {
      revealSlide(plate, plate.dataset.plate === 'end' ? 'end' : 'start', rtl)
      revealUp(plate.querySelectorAll('li'), { staggerMs: 30, y: 8, duration: 500, trigger: plate })
    })
    revealUp(el.querySelectorAll('[data-reveal-note]'), { y: 32 })
    parallaxLayers(el)
  }, [language])
```

(`roles` stays unchanged.)

- [ ] **Step 2: Rewrite the JSX from `return (` to the end**

```tsx
  return (
    <section id="experience" ref={root} className="silence-beat relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative text-center mb-16">
          <span aria-hidden="true" className="watermark-num" data-depth="-0.35">003</span>
          <span data-reveal-head className="tab-eyebrow mb-6">003 · {t('experience', 'الخبرات')}</span>
          <h2
            data-lines
            className={`font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}
          >
            {t('Roles at Ailigent', 'أدواري في Ailigent')}
            <span className="text-signal">.</span>
          </h2>
          <p data-reveal-head className={`text-ash max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
            {t(
              'Two concurrent roles: full-stack engineering and delivery, plus business analysis on digital transformation engagements.',
              'دوران متزامنان: هندسة Full-Stack وتسليم المنتج، بالإضافة إلى تحليل الأعمال في مشاريع التحول الرقمي.'
            )}
          </p>
        </div>

        <div data-reveal-head className="flex justify-center mb-14">
          <div className={`inline-flex items-center gap-4 px-5 py-3 border border-wire bg-graphite text-sm ${ar ? 'font-rubik' : 'font-mono'}`}>
            <FaBuilding className="text-signal" />
            <span className="font-bold text-paper tracking-[-0.02em]">Ailigent</span>
            <span className="text-wire">·</span>
            <span className="text-ash text-xs tracking-[0.04em] uppercase">
              {t('AI Automation Solutions', 'حلول أتمتة بالذكاء الاصطناعي')}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <div
              key={role.title}
              data-plate={index === 0 ? 'start' : 'end'}
              className="group relative p-7 md:p-8 bg-graphite border border-wire hover:border-signal transition-colors duration-200"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-wire">
                  <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors">
                    <role.icon className="text-base" />
                  </div>
                  <span className={`text-[0.65rem] tracking-[0.18em] uppercase text-signal border border-signal px-2 py-1 ${ar ? 'font-rubik' : 'font-mono'}`}>
                    {role.focus}
                  </span>
                  <span className="ml-auto font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                    {t('role', 'دور')} · {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className={`font-extrabold tracking-[-0.03em] text-xl md:text-2xl mb-4 text-paper leading-tight ${ar ? 'font-rubik' : 'font-mono'}`}>
                  {role.title}
                </h3>

                <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 mb-6 text-xs text-ash ${ar ? 'font-rubik' : 'font-mono'}`}>
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-signal text-[0.7rem]" />
                    {role.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-signal text-[0.7rem]" />
                    {role.location}
                  </span>
                </div>

                <ul className="space-y-2">
                  {role.bullets.map((bullet, i) => (
                    <li key={i} className={`flex gap-3 text-ash text-sm leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
                      <span className="text-signal flex-shrink-0 font-bold mt-0.5">›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Note plate rides up over the plates' lower edge (overlap = depth). */}
        <div data-depth="0.1" className="relative z-[2] -mt-10 mx-4 md:mx-10">
          <div data-reveal-note className="p-8 md:p-10 border border-signal bg-graphite">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 mb-4">
              <h3 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>
                {t('Concurrent delivery, end to end', 'تسليم متزامن من الألف إلى الياء')}
                <span className="text-signal">.</span>
              </h3>
              <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-signal">
                / {t('note', 'ملاحظة')}
              </span>
            </div>
            <p className={`text-ash max-w-3xl leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t(
                'Concurrent delivery across three SaaS products, plus business analysis on digital transformation engagements across Egypt, UAE, and KSA.',
                'تسليم متزامن لثلاث منصات SaaS، بالإضافة إلى تحليل الأعمال على مشاريع التحول الرقمي في مصر والإمارات والسعودية.'
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
```

- [ ] **Step 3: Verify**

Typecheck, build, browser: the two plates enter from opposite edges (mirrored under `?lang=ar`), bullets tick in, the red-bordered note overlaps the plates' bottom edge and drifts slightly; on desktop the section ends with ~half a viewport of field-only space (the silence) and the particles begin to straighten (order 0 → 0.35). Stop the server.

- [ ] **Step 4: Commit**

```bash
git add components/Experience.tsx
git commit -m "feat(experience): sliding role plates, ticking bullets, overlapping note, silence beat

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Projects — the pinned peak (desktop) with flow fallback

**Files:**
- Create: `lib/journey/usePinned.ts`
- Modify: `components/Projects.tsx`

**Interfaces:**
- Consumes: `useAnimeScope`, `revealUp`, `revealLines`, `parallaxLayers` (Task 7), `isMotionEnabled`.
- Produces: `usePinned(): boolean`; `section#projects.pin-act[data-pinned][style=--span]` with `.pin-stage`, `[data-pin-header]`, `[data-pin-grid]`, `[data-pin-card]`, `.pin-heading`.

- [ ] **Step 1: The pin decision hook**

```ts
// lib/journey/usePinned.ts
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
```

- [ ] **Step 2: Rewrite `components/Projects.tsx` header, card and scope**

Replace lines 1-166 (from `'use client'` through the end of `ProjectCard`) with:

```tsx
'use client'

import type { CSSProperties } from 'react'
import { createTimeline, onScroll } from 'animejs'
import { FaGithub, FaExternalLinkAlt, FaRocket, FaTasks, FaLanguage, FaCalculator, FaCreditCard, FaBookMedical } from 'react-icons/fa'
import { SiPython, SiJavascript, SiRust } from 'react-icons/si'
import type { IconType } from 'react-icons'
import { useLanguage } from '@/lib/LanguageContext'
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { usePinned } from '@/lib/journey/usePinned'
import { parallaxLayers, revealLines, revealUp } from '@/lib/journey/reveal'

type Project = {
  title: string
  tagline: string
  description: string
  tech: string[]
  roles: string[]
  icon: IconType
  result: string
  link?: string
  github?: string
}

type ProjectCardProps = {
  project: Project
  index: number
  size?: 'flagship' | 'notable'
  ar: boolean
  outcomeLabel: string
  pinCard?: boolean
}

function ProjectCard({ project, index, size = 'flagship', ar, outcomeLabel, pinCard = false }: ProjectCardProps) {
  const isFlagship = size === 'flagship'
  const primaryLink = project.link ?? project.github ?? '#'

  return (
    <div className="group relative h-full" data-pin-card={pinCard ? '' : undefined} data-reveal-card={pinCard ? undefined : ''}>
      <div
        className={`relative h-full ${isFlagship ? 'p-7 md:p-8' : 'p-6'} bg-graphite border border-wire hover:border-signal transition-colors duration-200 overflow-hidden`}
      >
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-wire">
            <div
              className={`${isFlagship ? 'w-12 h-12' : 'w-11 h-11'} border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors`}
            >
              <project.icon className={isFlagship ? 'text-xl' : 'text-lg'} />
            </div>

            <div className="flex items-center gap-1">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
                  aria-label={`${project.title} GitHub`}
                >
                  <FaGithub size={14} />
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
                  aria-label={project.title}
                >
                  <FaExternalLinkAlt size={12} />
                </a>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                {String(index + 1).padStart(2, '0')} ·
              </span>
              <h3
                className={`font-extrabold tracking-[-0.04em] ${isFlagship ? 'text-2xl md:text-[1.75rem]' : 'text-xl'} text-paper group-hover:text-signal transition-colors leading-none font-mono`}
              >
                {project.title}
              </h3>
            </div>
            <p className={`text-ash text-xs md:text-sm ${ar ? 'font-rubik' : 'font-mono'}`}>{project.tagline}</p>
          </div>

          {project.roles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.roles.map((role) => (
                <span
                  key={role}
                  className={`px-2 py-1 text-[0.65rem] uppercase tracking-[0.04em] border border-wire text-ash ${ar ? 'font-rubik' : 'font-mono'}`}
                >
                  {role}
                </span>
              ))}
            </div>
          )}

          <p className={`text-ash leading-relaxed mb-5 ${isFlagship ? 'text-sm' : 'text-xs md:text-sm'} ${ar ? 'font-rubik' : 'font-mono'}`}>
            {project.description}
          </p>

          {project.result && (
            <div className="mb-5 pl-3 border-l border-signal">
              <span className="block font-mono text-[0.65rem] tracking-[0.18em] uppercase text-signal mb-1">
                / {outcomeLabel}
              </span>
              <span className={`text-sm text-paper font-medium ${ar ? 'font-rubik' : 'font-mono'}`}>
                {project.result}
              </span>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span key={tech} className="tag-chip">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <a
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hover-only absolute bottom-5 right-5 text-signal opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
          tabIndex={-1}
        >
          <FaExternalLinkAlt size={14} />
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Replace the start of the `Projects` component (lines 168-178) with**

```tsx
export default function Projects() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'
  const pinned = usePinned()

  // Desktop: one scroll-synced timeline brings the three flagships forward out of
  // the field one at a time (FLIP: measured slot → grid centre), ending exactly in
  // the static grid layout so releasing the pin changes nothing. Elsewhere: flow.
  const root = useAnimeScope<HTMLElement>((_, { motion }) => {
    const el = root.current
    if (!el || !motion) return
    const header = el.querySelector<HTMLElement>('[data-pin-header]')
    const grid = el.querySelector<HTMLElement>('[data-pin-grid]')
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-pin-card]'))
    if (!header || !grid || cards.length === 0) return
    parallaxLayers(el)

    if (!pinned) {
      const h2 = header.querySelector<HTMLElement>('[data-lines]')
      if (h2) revealLines(h2)
      revealUp(header.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: header })
      revealUp(cards, { staggerMs: 100, y: 40, trigger: grid })
      return
    }

    const g = grid.getBoundingClientRect()
    const cx = g.left + g.width / 2
    const cy = g.top + g.height / 2
    const offsets = cards.map((c) => {
      const r = c.getBoundingClientRect()
      return { dx: cx - (r.left + r.width / 2), dy: cy - (r.top + r.height / 2) }
    })
    // [arrive start, arrive end / travel start, travel end] in timeline ms (0..1000 = pin progress)
    const windows: [number, number, number][] = [
      [120, 360, 620],
      [360, 620, 860],
      [620, 860, 1000],
    ]
    const tl = createTimeline({
      defaults: { ease: 'linear' },
      autoplay: onScroll({ target: el, enter: 'top top', leave: 'bottom bottom', sync: true }),
    })
    tl.add(header, { opacity: [0, 1], translateY: [24, 0], duration: 120 }, 0)
    cards.forEach((card, i) => {
      const { dx, dy } = offsets[i]
      const [a0, a1, a2] = windows[i]
      card.style.zIndex = String(i + 1)
      tl.set(card, { translateX: dx, translateY: dy, scale: 1.18, opacity: 0, filter: 'blur(10px)' }, 0)
      tl.add(card, { opacity: [0, 1], filter: ['blur(10px)', 'blur(0px)'], scale: [1.18, 1.1], duration: a1 - a0 }, a0)
      tl.add(card, { translateX: [dx, 0], translateY: [dy, 0], scale: [1.1, 1], duration: a2 - a1 }, a1)
    })
  }, [language, pinned])
```

- [ ] **Step 4: Replace the JSX from `return (` to the end of the file with**

```tsx
  return (
    <>
      <section
        id="projects"
        ref={root}
        data-pinned={pinned ? 'true' : 'false'}
        style={{ '--span': 3.8 } as CSSProperties}
        className="pin-act px-6"
      >
        <div className="pin-stage max-w-7xl mx-auto w-full py-32">
          <div data-pin-header className="relative text-center mb-12">
            <span aria-hidden="true" className="watermark-num" data-depth="-0.3">004</span>
            <span data-reveal-head className="tab-eyebrow mb-6">004 · {t('shipped · work', 'الأعمال · المنشورة')}</span>
            <h2
              data-lines
              className={`pin-heading font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] ${ar ? 'font-rubik' : 'font-mono'}`}
            >
              {t('Three production SaaS', 'ثلاث منصات SaaS في الإنتاج')}
              <span className="text-signal">.</span>
            </h2>
            <p data-reveal-head className={`text-ash max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t(
                'Live products I architect, ship, and run as Full-Stack Developer, DevOps Engineer, and Scrum Master at Ailigent.',
                'منتجات حيّة أُصمّمها وأُطلقها وأُشغّلها كمطور Full-Stack ومهندس DevOps و Scrum Master في Ailigent.'
              )}
            </p>
          </div>

          <div data-pin-grid className="grid lg:grid-cols-3 gap-6">
            {flagships.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                size="flagship"
                ar={ar}
                outcomeLabel={outcomeLabel}
                pinCard
              />
            ))}
          </div>
        </div>
      </section>

      {/* Notable builds flow after the pinned act (never inside the sticky stage). */}
      <div ref={notableRoot} className="relative px-6 pb-32 pt-4 lg:pt-12">
        <div className="max-w-7xl mx-auto">
          <div data-reveal-notable-head className="flex items-center gap-4 mb-8">
            <FaRocket className="text-signal" />
            <h3 className={`font-extrabold tracking-[-0.03em] text-2xl text-paper ${ar ? 'font-rubik' : 'font-mono'}`}>
              {t('notable · builds', 'أعمال · مميزة')}
            </h3>
            <span className="flex-1 h-px bg-wire" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notableBuilds.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                size="notable"
                ar={ar}
                outcomeLabel={outcomeLabel}
              />
            ))}
          </div>

          <div data-reveal-notable-cta className="text-center mt-12">
            <a
              href="https://github.com/karem505"
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper text-sm tracking-wide hover:border-signal hover:text-signal transition-colors ${ar ? 'font-rubik' : 'font-mono'}`}
            >
              <FaGithub size={16} />
              <span>{t('More on GitHub', 'المزيد على GitHub')}</span>
              <span className="text-ash group-hover:text-signal">↗</span>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 section-divider" />
      </div>
    </>
  )
}
```

and add the notable-builds scope right after the `root` scope declaration (before `return`):

```tsx
  const notableRoot = useAnimeScope<HTMLDivElement>((_, { motion }) => {
    const el = notableRoot.current
    if (!el || !motion) return
    revealUp(el.querySelectorAll('[data-reveal-notable-head]'))
    revealUp(el.querySelectorAll('[data-reveal-card]'), { staggerMs: 80, y: 32 })
    revealUp(el.querySelectorAll('[data-reveal-notable-cta]'))
  }, [language])
```

Remove the now-unused `useRef`/`useState`/`useInView`/`motion` imports if any remain, and delete the old `hoveredKey` state (hover arrow is now pure CSS via `group-hover`).

- [ ] **Step 5: Verify the peak**

Typecheck, build, start. Browser at 1440×900, scroll to `#projects`:
- The section pins; at ~15% Tornix blurs in at the centre, sharpens, then slides to the left slot as Oravex arrives; Costra last; at the end all three sit in the normal grid and the page releases into "notable builds" with no jump. Take screenshots at pin progress 0, 0.3, 0.6, 1 (use `evaluate_script` to set `window.scrollTo(0, top + fraction * (height - innerHeight))` where `top/height` come from `document.getElementById('projects').getBoundingClientRect()`).
- Behind, the particles straighten into a lattice.
- At 1366×768: still pins (≥ 720) and the stage does not clip the cards; if it clips, lower `pin-heading` size in the CSS rule from Task 6 rather than hiding copy.
- At 390×844 (`resize_page`): no pin, cards reveal on scroll.
- `?lang=ar`: identical behaviour, Arabic heading.
- Reduced motion (`emulate` with reduced motion, or add `?` and toggle DevTools rendering): plain grid, everything visible.
Stop the server.

- [ ] **Step 6: Commit**

```bash
git add lib/journey/usePinned.ts components/Projects.tsx
git commit -m "feat(projects): pinned peak — flagships come forward out of the field one by one

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Services, Journal, FAQ, Contact — reveals and depth (no pin)

**Files:**
- Modify: `components/Services.tsx`
- Modify: `components/RecentPostsClient.tsx`
- Modify: `components/FAQ.tsx`
- Modify: `components/Contact.tsx`

**Interfaces:**
- Consumes: `useAnimeScope`, `revealUp`, `revealSlide`, `revealLines`, `parallaxLayers`.

- [ ] **Step 1: Services**

In `components/Services.tsx`:
1. Replace the imports/scope (lines 1-13) with:
```tsx
'use client'

import Link from 'next/link'
import { FaChartLine, FaChalkboardTeacher, FaCode } from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { parallaxLayers, revealLines, revealUp } from '@/lib/journey/reveal'

export default function Services() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const root = useAnimeScope<HTMLElement>((_, { motion }) => {
    const el = root.current
    if (!el || !motion) return
    const h2 = el.querySelector<HTMLElement>('[data-lines]')
    if (h2) revealLines(h2)
    revealUp(el.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: h2 ?? el })
    revealUp(el.querySelectorAll('[data-reveal-card]'), { staggerMs: 90, y: 32 })
    parallaxLayers(el)
  }, [language])
```
2. `<section id="services" ref={ref} ...>` → `<section id="services" ref={root} ...>`.
3. Header: change `<motion.div initial=... className="text-center mb-20">` to `<div className="relative text-center mb-20">`, add `<span aria-hidden="true" className="watermark-num" data-depth="-0.35">005</span>` as its first child, add `data-reveal-head` to the eyebrow `<span>` and to the `<p>`, add `data-lines` to the `<h2>`, and close with `</div>`.
4. Cards: replace the `cards.map` block with
```tsx
          {cards.map((card, index) => (
            <div key={card.href} data-depth={[0.06, 0.16, 0.06][index]} className={index === 1 ? 'lg:-mt-6' : ''}>
              <Link
                href={card.href}
                dir={ar ? 'rtl' : 'ltr'}
                data-reveal-card
                className="group relative flex h-full flex-col p-6 bg-graphite border border-wire hover:border-signal transition-colors duration-200"
              >
                {/* unchanged Link children */}
              </Link>
            </div>
          ))}
```
keeping the existing children of `<Link>` verbatim.

- [ ] **Step 2: Journal (RecentPostsClient)**

In `components/RecentPostsClient.tsx`:
1. Imports: remove `motion, useInView` and `useRef`; add
```tsx
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { parallaxLayers, revealLines, revealUp } from '@/lib/journey/reveal'
```
2. Replace `const ref = useRef(null)` / `const isInView = ...` with
```tsx
  const root = useAnimeScope<HTMLElement>((_, { motion }) => {
    const el = root.current
    if (!el || !motion) return
    const h2 = el.querySelector<HTMLElement>('[data-lines]')
    if (h2) revealLines(h2)
    revealUp(el.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: h2 ?? el })
    revealUp(el.querySelectorAll('[data-reveal-post]'), { staggerMs: 120, y: 40 })
    revealUp(el.querySelectorAll('[data-reveal-cta]'))
    parallaxLayers(el)
  }, [posts.length])
```
(keep the `if (posts.length === 0) return null` guard **after** the hook call — hooks must run unconditionally).
3. `ref={ref}` → `ref={root}`; header `motion.div` → `<div className="relative text-center mb-20">` with `<span aria-hidden="true" className="watermark-num" data-depth="-0.35">008</span>` first, `data-reveal-head` on the eyebrow and `<p>`, `data-lines` on the `<h2>`.
4. Each post: wrap the anchor —
```tsx
            <div key={post.id} data-depth={[0.05, 0.15, 0.25][index % 3]}>
              <a
                href={`/blog/${post.slug}`}
                data-reveal-post
                className="group relative block h-full bg-graphite border border-wire hover:border-signal transition-colors duration-200 overflow-hidden font-mono"
              >
                {/* unchanged children */}
              </a>
            </div>
```
5. View-all wrapper `motion.div` → `<div data-reveal-cta className="text-center mt-12">`.

- [ ] **Step 3: FAQ (keep the accordion's Framer pieces)**

In `components/FAQ.tsx`:
1. Change the Framer import to `import { motion, AnimatePresence } from 'framer-motion'` (drop `useInView`), drop `useRef`, add the two journey imports (`useAnimeScope`; `revealLines, revealUp` from reveal).
2. Replace `const ref = useRef(null)` / `isInView` with
```tsx
  const root = useAnimeScope<HTMLElement>((_, { motion: allowMotion }) => {
    const el = root.current
    if (!el || !allowMotion) return
    const h2 = el.querySelector<HTMLElement>('[data-lines]')
    if (h2) revealLines(h2)
    revealUp(el.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: h2 ?? el })
    revealUp(el.querySelectorAll('[data-reveal-row]'), { staggerMs: 40, y: 12, duration: 500 })
  }, [language])
```
3. `ref={ref}` → `ref={root}`; header `motion.div` → plain `<div className="text-center mb-20">` with `data-reveal-head` on the eyebrow and `<p>`, `data-lines` on the `<h2>`.
4. Each row: `<motion.div key={index} initial=... className="border-b border-wire transition-colors duration-200">` → `<div key={index} data-reveal-row className="border-b border-wire transition-colors duration-200">` (closing tag too). The chevron `motion.span` and the `AnimatePresence` panel stay.

- [ ] **Step 4: Contact**

In `components/Contact.tsx`:
1. Imports: remove `motion`, `useInView`, `useRef`; keep `useState`; add `useAnimeScope` and `parallaxLayers, revealLines, revealSlide, revealUp`.
2. Replace `const ref = useRef(null)` / `isInView` with
```tsx
  const root = useAnimeScope<HTMLElement>((_, { motion, rtl }) => {
    const el = root.current
    if (!el || !motion) return
    const h2 = el.querySelector<HTMLElement>('[data-lines]')
    if (h2) revealLines(h2)
    revealUp(el.querySelectorAll('[data-reveal-head]'), { staggerMs: 80, trigger: h2 ?? el })
    const form = el.querySelector<HTMLElement>('[data-col-start]')
    const info = el.querySelector<HTMLElement>('[data-col-end]')
    if (form) revealSlide(form, 'start', rtl)
    if (info) {
      revealSlide(info, 'end', rtl)
      revealUp(info.querySelectorAll('[data-reveal-row]'), { staggerMs: 60, y: 12, trigger: info })
      revealUp(info.querySelectorAll('[data-reveal-plate]'), { y: 32, trigger: info })
    }
    parallaxLayers(el)
  }, [language, isSubmitted])
```
3. `ref={ref}` → `ref={root}`; header `motion.div` → `<div className="relative text-center mb-20">` with `<span aria-hidden="true" className="watermark-num" data-depth="-0.35">007</span>`, `data-reveal-head` on eyebrow and `<p>`, `data-lines` on `<h2>`.
4. Form column `motion.div` (initial x) → `<div data-col-start>`; inside, the success `motion.div` → plain `<div className=...>` (same classes).
5. Info column `motion.div` → `<div data-col-end className="space-y-8">`; each contact row `motion.div` → `<div key={info.label} data-reveal-row className="border-b border-wire group">`; the red plate `motion.div` → `<div data-depth="0.18"><div data-reveal-plate className="p-8 bg-signal text-ink">…</div></div>`.

- [ ] **Step 5: Verify all four**

```bash
npx tsc --noEmit 2>&1 | grep -E "Services|RecentPosts|FAQ|Contact|journey" ; grep -n "framer-motion" components/Services.tsx components/RecentPostsClient.tsx components/Contact.tsx
```
Expected: no type errors; no `framer-motion` import remains in Services/RecentPostsClient/Contact (FAQ keeps it). Build, start, scroll the lower half of the page in EN and AR: headings split into lines, cards reveal and drift on their planes, FAQ rows fade in and the accordion still opens, the contact columns slide in from opposite edges (mirrored in AR), the red plate drifts; the field is sparse and still by the footer. Submit-state check: type into the form, do not submit. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add components/Services.tsx components/RecentPostsClient.tsx components/FAQ.tsx components/Contact.tsx
git commit -m "feat(sections): anime reveals + depth planes for services, journal, faq, contact

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Navbar active chapter + progress wire; fixed chapter readout

**Files:**
- Modify: `components/Navbar.tsx`
- Create: `components/journey/JourneyReadout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `useJourneyChapter` (Task 5), `getChapter` (Task 2), CSS `.journey-wire`, `.journey-readout-wire` (Task 6).

- [ ] **Step 1: Navbar**

In `components/Navbar.tsx`:
1. Add imports:
```tsx
import { usePathname } from 'next/navigation'
import { useJourneyChapter } from '@/lib/journey/store'
```
2. Inside the component after `const [isMobileMenuOpen, ...]` add:
```tsx
  const pathname = usePathname()
  const chapter = useJourneyChapter()
  // Only the homepage has chapter sections; elsewhere nothing is "current".
  const currentHref = pathname === '/' ? `#${chapter}` : null
```
3. Desktop links: add `aria-current={link.href === currentHref ? 'page' : undefined}` to the `<a>` inside `navLinks.map` (the existing `.nav-link[aria-current="page"]` CSS draws the signal underline).
4. Add the wire as the last child of `<motion.nav …>` (after the `max-w-7xl` div):
```tsx
        <span className="journey-wire" aria-hidden="true" />
```

- [ ] **Step 2: Readout component**

```tsx
// components/journey/JourneyReadout.tsx
'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { getChapter } from '@/lib/journey/chapters'
import { useJourneyChapter } from '@/lib/journey/store'

/**
 * Timecode-style chapter readout (desktop only): "004 / shipped · work" plus a
 * chapter-progress wire driven by the --chapter-p CSS variable, so it only
 * re-renders when the chapter changes.
 */
export default function JourneyReadout() {
  const chapter = useJourneyChapter()
  const { language } = useLanguage()
  const ar = language === 'ar'
  const c = getChapter(chapter)

  return (
    <div
      aria-hidden="true"
      className="hidden lg:flex fixed bottom-6 start-6 z-40 items-center gap-3 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash pointer-events-none select-none"
    >
      <span className="text-paper tabular-nums">{c.number}</span>
      <span className="text-wire">/</span>
      <span className={ar ? 'font-rubik' : ''}>{ar ? c.ar : c.en}</span>
      <span className="journey-readout-wire">
        <span />
      </span>
    </div>
  )
}
```

- [ ] **Step 3: Mount the readout on the homepage**

In `app/page.tsx` add `import JourneyReadout from '@/components/journey/JourneyReadout'` and render `<JourneyReadout />` immediately after `<Navbar />` inside the `relative z-10` wrapper.

- [ ] **Step 4: Verify**

Typecheck, build, start. Browser 1440×900: the 1px signal wire under the navbar grows with scroll; the nav link for the current section is underlined; the bottom-left readout changes `001 · engineer.profile` → `002 / about` → … and its wire fills per chapter; under `?lang=ar` the readout sits bottom-right in Rubik. Visit `/blog`: no nav link is marked current, no console errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add components/Navbar.tsx components/journey/JourneyReadout.tsx app/page.tsx
git commit -m "feat(journey): active-chapter nav, page-progress wire, fixed chapter readout

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 15: Cleanup and documentation

**Files:**
- Delete: `public/galaxy.mp4`, `public/galaxy-mobile.mp4`
- Modify: `CLAUDE.md` (Tech Stack, Architecture, Design System sections)
- Modify: `package.json` / `package-lock.json` (already changed by the install — commit them here)

- [ ] **Step 1: Remove the retired hero clips**

```bash
grep -rn "galaxy.mp4\|galaxy-mobile" app components lib netlify.toml || echo "no references"
git rm public/galaxy.mp4 public/galaxy-mobile.mp4
```
Expected: "no references", then two deletions staged. `public/galaxy-poster.jpg` stays (hero fallback).

- [ ] **Step 2: Update CLAUDE.md**

1. Tech Stack line: append ` · anime.js 4 (scroll-linked motion) · three.js (lazy WebGL field)` after `Framer Motion`.
2. Architecture tree: add under `components/`:
```
  journey/ — JourneyStage (fixed three.js canvas, lazy), GalaxyField (scene), JourneyReadout (fixed chapter readout)
```
and under `lib/`:
```
  journey/ — chapters.ts, field.ts (scroll→uniforms), galaxy.ts (geometry), store.ts (scroll store + hooks), reveal.ts, useAnimeScope.ts, usePinned.ts
```
3. Add a new `## Motion System (homepage)` section after `## Design System`:
```markdown
## Motion System (homepage)

- **Gate:** an inline `<head>` script adds `html.motion` when JS runs and `prefers-reduced-motion` is off. All decorative pre-states key off it; SSR HTML never contains hidden content (no inline `opacity:0`).
- **Store:** `lib/journey/store.ts` — one passive scroll listener → page/chapter progress, `--journey-p` / `--chapter-p` CSS vars on `<html>`, `useJourney()` / `useJourneyChapter()`.
- **Reveals:** sections use `useAnimeScope` + `reveal.ts` (`revealUp`, `revealSlide`, `revealLines`, `parallax`/`parallaxLayers` via `data-depth`). Scopes rebuild on language change. Text splits by lines/words only (Arabic-safe).
- **Pinned act:** Projects only, desktop ≥1024×720 with motion (`usePinned`). CSS-sticky stage inside `section.pin-act[data-pinned]`; one anime timeline linked to `onScroll({ sync: true })`; end state = static grid.
- **WebGL:** `components/journey/JourneyStage.tsx` mounts `GalaxyField` on idle, only with `html.motion` + WebGL2; three.js is a separate lazy chunk. Uniforms come from `fieldState()` (pure, tested). Hero keeps `galaxy-poster.jpg` as the instant paint + fallback; the old scrubbed `galaxy*.mp4` clips were removed.
- **Invariants:** `main` uses `overflow-x: clip` (not `hidden`, or sticky breaks); Framer Motion remains only in Navbar, FAQ accordion, blog and service pages; never move copy into the canvas.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md package.json package-lock.json
git commit -m "chore(journey): remove retired hero clips, document the motion system, lock deps

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 16: Verification against the baseline (SEO, performance, visuals, a11y)

**Files:**
- Create: `/tmp/journey-after/` (not committed)
- Modify: this plan (record results)

- [ ] **Step 1: Unit tests and typecheck**

```bash
npm test 2>&1 | tail -8 && npx tsc --noEmit && echo TSC_OK
```
Expected: all vitest suites pass; `TSC_OK`.

- [ ] **Step 2: Build, First Load JS, SSR counts**

```bash
mkdir -p /tmp/journey-after
npm run build 2>&1 | tee /tmp/journey-after/build.log | grep -E "^\s*[○ƒ●]\s+/\s" 
(npm start -- -p 3000 > /tmp/journey-after/server.log 2>&1 &); sleep 5
curl -s http://localhost:3000/ -o /tmp/journey-after/home.html
curl -s "http://localhost:3000/?lang=ar" -o /tmp/journey-after/home-ar.html
node -e '
const fs=require("fs");const h=fs.readFileSync("/tmp/journey-after/home.html","utf8");
const c=(re)=>(h.match(re)||[]).length;
const out={h1:c(/<h1/g),h2:c(/<h2/g),h3:c(/<h3/g),jsonld:c(/application\/ld\+json/g),links:c(/<a /g),imgs:c(/<img/g),opacity0:c(/opacity:0/g),srOnlySeo:c(/sr-only-seo/g),title:(h.match(/<title>([^<]*)<\/title>/)||[])[1],hreflang:c(/hreflang=/g),canvasSSR:c(/<canvas/g),threeInHtml:c(/three/g)};
const base=JSON.parse(fs.readFileSync("/tmp/journey-baseline/summary.json","utf8"));
console.table({baseline:base,after:out});
const gates=[["h1",out.h1>=base.h1],["h2",out.h2>=base.h2],["h3",out.h3>=base.h3],["jsonld",out.jsonld>=base.jsonld],["links",out.links>=base.links],["srOnlySeo",out.srOnlySeo>=1],["opacity0 reduced",out.opacity0<=base.opacity0],["title same",out.title===base.title],["hreflang same",out.hreflang===base.hreflang]];
console.log(gates); if(gates.some(g=>!g[1])) process.exit(1)'
```
Expected: the script exits 0 with every gate `true`; `opacity0` is lower than baseline (Framer's SSR'd hidden states are gone); First Load JS for `/` grew by ≤ 15 kB (three.js is not in it — confirm the largest new chunk only appears in `/tmp/journey-after/build.log` as a shared/lazy chunk, not under `/`).

- [ ] **Step 3: Lighthouse after**

```bash
npx --yes lighthouse@12 http://localhost:3000/ --output=json --output-path=/tmp/journey-after/lh-mobile.json --chrome-flags="--headless=new --no-sandbox" --quiet --only-categories=performance,accessibility,best-practices,seo
npx --yes lighthouse@12 http://localhost:3000/ --preset=desktop --output=json --output-path=/tmp/journey-after/lh-desktop.json --chrome-flags="--headless=new --no-sandbox" --quiet --only-categories=performance,accessibility,best-practices,seo
node -e '
for (const k of ["mobile","desktop"]) { for (const w of ["baseline","after"]) { const r=require("/tmp/journey-"+w+"/lh-"+k+".json");
 const s=Object.fromEntries(Object.entries(r.categories).map(([n,c])=>[n,Math.round(c.score*100)]));
 const a=r.audits; console.log(k,w, s, {lcp:a["largest-contentful-paint"].displayValue, cls:a["cumulative-layout-shift"].displayValue, tbt:a["total-blocking-time"].displayValue}) } }'
```
Expected: SEO 100 in both modes; mobile performance ≥ baseline − 5; CLS ≤ 0.05; accessibility not lower than baseline. If mobile performance regressed by more than 5: lower the mobile particle count to 2000 in `JourneyStage.tsx`, or delay the idle mount timeout to 3000 ms, rebuild and re-measure.

- [ ] **Step 4: Visual pass (chrome-devtools MCP)**

For each of `http://localhost:3000/` and `http://localhost:3000/?lang=ar`, at 1440×900 and 390×844: take screenshots at hero, about, experience, projects p=0/0.3/0.6/1, services, contact/footer (scroll with `evaluate_script`, wait ~800 ms for lerps to settle). Check: text over the field is readable (sample a body-copy pixel region and confirm the field stays faint), nothing overlaps wrongly, RTL mirrors the slides and readout position, the last screen holds the footer. Emulate reduced motion once (`emulate`), reload: poster visible, no canvas, all content visible with no pin. Save screenshots to `/tmp/journey-after/shots/`.

- [ ] **Step 5: Keyboard and console**

`press_key Tab` ×12 from the top and `take_snapshot`: focus moves nav → hero CTAs → … in DOM order; the pinned section does not trap focus. `list_console_messages`: no errors or React hydration warnings (a single "Extra attributes from the server: class" warning would indicate the html hydration suppression is missing — fix in `layout.tsx`).

Scroll-frame budget: `performance_start_trace` (reload: false), scroll from top to bottom over ~6 s via `evaluate_script` (`window.scrollBy` in 40 steps with 150 ms waits), `performance_stop_trace`, then `performance_analyze_insight` for the main-thread summary. Expected: no long tasks > 50 ms during the scroll and scripting per frame ≤ 8 ms on average. If exceeded: reduce `parallaxLayers` targets (drop the tile-level `data-depth` in About) or cap the desktop particle count at 8000.

- [ ] **Step 6: SEO technical pass (project agent)**

Stop the server, then dispatch the project `seo` agent (Agent tool, `subagent_type: seo`) with: "Run a technical SEO review of the local build of `/` and `/?lang=ar` after the scroll-journey redesign on branch feat/scroll-journey. Compare `/tmp/journey-baseline/home.html` vs `/tmp/journey-after/home.html`: headings, JSON-LD, links, hreflang, ArabicSeoContent, no hidden-content regressions, lazy three.js chunk not in critical path. Do NOT request indexing, submit IndexNow, deploy, or push. Report findings only." Address any blocking finding, re-run Steps 2-3 if code changed.

- [ ] **Step 7: Record results and commit**

Append the after-numbers table (SSR counts, First Load JS, Lighthouse, LCP/CLS/TBT, screenshot list) under this task in the plan and commit:

```bash
git add docs/superpowers/plans/2026-09-02-scroll-journey-redesign.md
git commit -m "docs(journey): record post-change verification results

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Then stop: do not merge or push. Summarise for the owner: what changed, the baseline vs after table, and the one-line `git push` / merge instruction they can run when they approve.
