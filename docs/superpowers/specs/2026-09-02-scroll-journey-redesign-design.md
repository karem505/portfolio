# Homepage Scroll Journey Redesign (anime.js + three.js) — Design Spec

**Date:** 2026-09-02
**Author:** Karem (Abo-Elmakarem Shohoud) + Claude
**Status:** Self-authored under an autonomous `/goal` run (not interviewed). Decisions below are
recorded so the owner can override any of them; none change copy, identity, or SEO surface.

## 1. Goal

Redesign the homepage (`/`) so scrolling is the experience: a hooking, scroll-driven journey with
real depth (layered planes, a 3D field behind the page, pinned chapter acts), built with
**anime.js v4** (scroll-linked timelines, staggered reveals, text splitting) and **three.js**
(one persistent WebGL scene), while **keeping or surpassing the current SEO level**.

References the owner named: animejs.com (component vocabulary), Apple iPhone Air (pinned
chapters, big statements, product reveals, chapter rhythm), flora.ai (cinematic layering).

## 2. Non-goals

- No copy, identity, or section-order changes. Hero title, About bio, Experience bullets, the
  three flagship products, services framing, FAQ, contact details all stay as they are (CV-aligned).
- No changes to blog, service pages, apps pages, feeds, sitemap, robots, JSON-LD content.
- No scroll-jacking (no wheel hijack, no smooth-scroll library). Native scroll only; pinning is
  CSS `position: sticky`.
- No new hue. The palette stays ink / slate / graphite / wire / paper / ash / signal (+ moss dot).

## 3. Hard constraints

1. **SEO parity or better.** Measured on the SSR HTML of `/` (no JS): heading counts (≥ 2 h1,
   ≥ 10 h2, ≥ 33 h3), ≥ 12 JSON-LD blocks, ≥ 64 anchors, `ArabicSeoContent` present, title,
   canonical + hreflang unchanged. Lighthouse SEO stays 100. Lighthouse Performance (mobile) must
   not drop more than 5 points vs the pre-change local build; CLS ≤ 0.05.
2. **Content is visible without JS.** The redesign removes Framer's SSR-rendered inline
   `opacity:0` from sections. Pre-animation hidden states are applied by JS after hydration, only
   to elements below the fold, only when motion is allowed.
3. **LCP unchanged or better.** The hero H1 and `profile.jpg` remain the first paint; the WebGL
   canvas never blocks it (loaded after hydration on idle).
4. **Bilingual + RTL.** Everything works under `?lang=ar` / the toggle. Text splitting is by
   lines/words only (never characters) so Arabic shaping is preserved. Horizontal motion mirrors
   under `dir="rtl"`.
5. **Reduced motion, no-WebGL, and mobile all degrade to a complete page.** Reduced motion:
   static layout, static poster in the hero, no canvas, opacity-only reveals. No WebGL: poster
   fallback. Mobile: lighter field, no pinned Projects act (flow + reveals instead).
6. **Identity rules from CLAUDE.md** hold (no CEO/founder framing; services are personal).

## 4. The journey (feeling curve, peak, tell-someone)

| # | Chapter (id) | Feeling | What causes it | Device |
|---|---|---|---|---|
| 001 | Hero `#home` | Arrival | The galaxy turns under the wheel; the name holds still while the photo, stack icons and stars drift at different rates | `parallax` layers + WebGL spin |
| 002 | About `#about` | Recognition | Headline assembles line by line; six expertise tiles land on three depth planes; a 20vw "002" numeral drifts behind | `kinetic` lines + `parallax` planes |
| 003 | Experience `#experience` | Weight | Two role plates slide in from opposite sides, bullets tick in like a changelog, the "note" plate overlaps the plates' lower edge (overlap = depth) | `reveal` + overlap |
| 004 | Projects `#projects` | **Awe (PEAK)** | Pinned: the field aligns into a lattice; Tornix, Oravex, Costra come forward out of it one at a time, hold centre with their outcome line, then settle into the grid; notable builds flow in after release | `pin` (sticky, ~380vh) + WebGL order morph |
| 005 | Services `#services` | Clarity | Quiet after the peak: plain type, headline words arrive, three doors with the middle one on a nearer plane | `kinetic` words + asymmetric depth |
| 008 | Journal `#blog` | Curiosity | Three posts drift in at three depths | `parallax` |
| 006 | FAQ `#faq` | Calm | Compressed: rows fade in fast, accordion unchanged | `flow` |
| 007 | Contact `#contact` | Resolve | The red plate holds on a nearer plane; the field settles into a still, sparse sky; the page ends on a stable frame and footer | `flow` + WebGL settle |

- **Peak:** Projects. Largest scroll span on the page. The act before it (Experience) ends on a
  quiet beat: the note plate, then ~0.5vh of field-only with the lattice beginning to form.
- **Tell-someone sentence:** "It's the site where the three products fly toward you out of the
  star field, one at a time, as you scroll."
- **Signature move:** the galaxy → lattice morph. The same particles that are the hero galaxy
  are the depth field and become the ordered lattice under the products. One mesh, one story
  (noise → system), which is literally what digital transformation work is.
- **Authored silence:** the field-only beat between Experience and the Projects pin.

## 5. Architecture

```
app/
  layout.tsx            + inline <head> script: html.motion class (JS on + no reduced-motion)
  page.tsx              + <JourneyStage/> (fixed canvas) + <JourneyReadout/>; main overflow-x: clip
  globals.css           + journey utilities (see §9)
components/journey/
  JourneyStage.tsx      'use client'. Mounts the three.js scene lazily (next/dynamic, ssr:false,
                        after idle). Gated on html.motion + WebGL2. Renders nothing otherwise.
  GalaxyField.ts        three.js scene class: geometry with aGalaxy/aLattice attributes,
                        ShaderMaterial (uSpin, uOrder, uTime, uDolly, uPointer, uDensity),
                        render-on-demand loop, resize, dispose.
  JourneyReadout.tsx    'use client'. Fixed timecode readout "004 / shipped · work" (desktop),
                        1px progress wire under the navbar (all sizes). Reads the journey store.
  PinnedAct.tsx         Sticky pin wrapper: <section style={{height: span*100vh}}><div sticky>…
                        Publishes progress via anime onScroll(sync) to a callback + --p CSS var.
                        Renders children plainly (no pin) when motion is off or viewport < 1024.
lib/journey/
  store.ts              Tiny subscribable store: page progress 0..1, velocity, active chapter,
                        per-chapter progress. Updated by one passive scroll listener + rAF.
                        Publishes --journey-p on <html>.
  field.ts              Pure: fieldState(pageProgress, chapters) → { spin, order, dolly, density }
                        piecewise mapping (tested).
  galaxy.ts             Pure: seeded generators for galaxy positions, lattice positions, colors,
                        sizes (tested, deterministic).
  chapters.ts           Chapter list: id, number, label EN/AR (single source for readout + nav).
  useAnimeScope.ts      React hook wrapping anime createScope({ root, mediaQueries }) with revert
                        on unmount and on deps change (language).
  reveal.ts             anime helpers: revealLines(el), revealStagger(els, opts), parallax(el, depth)
                        — each returns instances registered in the scope.
components/
  Navbar.tsx            active chapter → aria-current on the matching link
  Hero.tsx              galaxy video removed; poster only as fallback; parallax layers; intro
  About / Experience / Projects / Services / RecentPostsClient / FAQ / Contact
                        Framer reveals replaced by anime reveals (same DOM, same copy)
```

Dependencies added: `animejs@^4.5`, `three@^0.185`, `@types/three` (dev).

### Data flow

1. `store.ts` listens to `scroll` (passive) and `resize`; on rAF it computes page progress,
   velocity, and the active chapter from section offsets (measured once per resize + after fonts
   load), then notifies subscribers and sets `--journey-p`.
2. `JourneyStage` subscribes; on change it calls `field.setTarget(fieldState(...))`. The field
   lerps toward the target in its own rAF (0.08/frame) and renders only while the target differs
   from the current state, while the pointer is moving, or on a slow idle twinkle (≤ 20 fps).
3. Sections own their reveals through `useAnimeScope`. Scroll-linked pieces (parallax, the
   pinned act) use anime `onScroll({ target, enter, leave, sync: true })`. Enter-once reveals use
   anime `onScroll` with `sync: false` and `repeat: false` (plays forward once when the target
   enters at `enter: 'bottom-=80 top'`), so the whole motion system has one scroll engine.
4. `PinnedAct` (Projects, desktop only) links one anime `createTimeline` to `onScroll({ sync: true })`
   spanning the sticky section, and hands progress to the store so the WebGL `order` uniform is
   driven by the same number.

## 6. WebGL field (three.js)

- One `Points` mesh. Desktop: 12,000 points; mobile (< 1024px or coarse pointer): 3,500.
  DPR capped at 1.5 desktop / 1 mobile. Additive blending, depth test off, transparent.
- Attributes: `aGalaxy` (log-spiral: 3 arms, radius 0.2–6, arm spread, vertical thickness
  decreasing with radius), `aLattice` (points snapped to a 3D grid with jitter, same count),
  `aColor` (paper #f5f1ea for ~88%, signal #ff3b1f for ~9%, ash for the rest; galaxy core warmer),
  `aSize` (0.6–2.4), `aSeed` (twinkle phase).
- Uniforms: `uSpin` (radians; hero scroll drives 0 → ~1.2 turns, reversible), `uOrder` (0..1 mix
  galaxy → lattice), `uDolly` (camera z), `uPointer` (x,y ±0.5, desktop only, eased), `uTime`,
  `uDensity` (alpha multiplier; 1 in hero, 0.6 mid-page, 0.35 at Contact), `uPixelRatio`.
- Vertex: `pos = mix(rotateZ(aGalaxy, uSpin), aLattice, smoothstep(uOrder))`; size attenuates
  with distance; fragment: soft round sprite (`gl_PointCoord`), twinkle `0.7 + 0.3 sin(uTime + aSeed)`.
- Brightness ceiling: the field never exceeds ~28% perceived luminance behind body text; measured
  on the composited page (see §11). Hero keeps its existing left scrim for the copy column.
- Fallbacks: no WebGL2 → hero shows `galaxy-poster.jpg` (existing, dimmed 55%) and no canvas
  elsewhere. Reduced motion → same poster, no canvas. Canvas is `aria-hidden`, `pointer-events:none`,
  `position: fixed; inset: 0; z-index: 0`.
- Lifecycle: created after hydration on `requestIdleCallback` (fallback 1.5s timeout); paused when
  `document.hidden`; disposed on unmount (geometry, material, renderer, context loss handler).

## 7. Chapter behaviour (detail)

### 001 Hero
- Markup unchanged in order and content. Video elements and desktop/mobile split removed.
- Layers (`data-depth`): meta row 0.05, H1 0, paragraph 0.08, CTA row 0.12, photo −0.18, stack
  icon column −0.28, scroll line 0.2. As the hero scrolls out (progress 0..1 over its height),
  each layer translates `depth * 220px * progress` (sign gives direction). Photo also gets a
  pointer tilt (≤ 6°) on fine pointers.
- Intro (once, on mount, only with `html.motion`): transform-only rise of H1 lines (y 18 → 0,
  stagger 60 ms), eyebrow rule scaleX, stack icons slide in. No opacity-from-zero on anything
  above the fold.
- WebGL: `uSpin` follows hero progress (×2 sensitivity, like the old clip); `uDolly` starts
  pulling back at 0.6.

### 002 About
- `revealLines` on the H2 (anime `splitText` lines; mask-clip rise 100% → 0, 90 ms stagger).
- Paragraph fades/rises. Six expertise tiles: staggered entrance (40 ms) and persistent
  `parallax` at depths 0.06 / 0.14 / 0.22 repeating, so the grid reads as three planes.
- Watermark numeral "002" (`aria-hidden`, mono 800, ~18vw, ash at 5%) behind the header at
  depth −0.35. Stack grid rows reveal with 30 ms stagger.

### 003 Experience
- Header as About (lines). Role plates slide in from `inline-start`/`inline-end` (x ±40 → 0,
  logical, so RTL mirrors), then bullets stagger 30 ms with the `›` marker flashing signal.
- Note plate: `margin-top: -2.5rem`, `z-index: 2`, depth 0.1 so it rides up over the plates'
  bottom edge as you scroll. Section ends with a field-only beat: bottom padding grows to
  ~50vh on desktop (the authored silence) during which `uOrder` ramps 0 → 0.35.

### 004 Projects (peak, desktop ≥ 1024px with motion)
- `PinnedAct span=3.8`. Sticky stage = 100vh containing header + the 3-col flagship grid in its
  normal DOM position. Notable builds and the GitHub CTA sit after the pinned section, in flow.
- Timeline linked to scroll (`sync: true`), progress p:
  - 0.00–0.12 header lines + copy in.
  - 0.12–0.36 Tornix: from `translate(toCenter) scale(1.18)`, `opacity 0`, `filter blur(10px)`
    → centre, sharp. Oravex/Costra hidden.
  - 0.36–0.62 Tornix travels to its slot (scale → 1); Oravex forward to centre.
  - 0.62–0.86 Oravex to slot; Costra forward to centre.
  - 0.86–1.00 Costra to slot. End state = untouched grid layout (transforms identity).
  - FLIP measurement: on mount/resize, measure each card's slot rect and the stage centre;
    `toCenter` is the delta. Transforms only; no layout writes during scroll.
  - Outcome line of the centred card is emphasised (signal bar scaleY) while centred.
- WebGL: `uOrder` 0.35 → 1 over p 0..0.7, holds; `uDensity` 0.75; camera dolly slightly in.
- Mobile / reduced motion / no-JS: no sticky; the section is the ordinary grid with standard
  reveals.

### 005 Services
- Header words reveal (`splitText` words, 40 ms). Cards: middle card `lg:-translate-y-6` and
  depth 0.16, outer cards depth 0.06 (asymmetric trio). `uOrder` eases back to 0.5; density 0.6.

### 008 Journal
- Post cards at depths 0.05 / 0.15 / 0.25, staggered entrance. Header lines reveal.

### 006 FAQ
- Rows fade in with 40 ms stagger. Accordion logic and Framer `AnimatePresence` unchanged.

### 007 Contact
- Form column and info column slide in from logical start/end. Red plate depth 0.18.
- WebGL: `uOrder` → 0.15 (loose sky), `uDensity` → 0.35, `uSpin` idle drift only. Footer
  unchanged, so the last screen holds content.

## 8. Chrome

- **Navbar:** `aria-current="page"` on the link matching the active chapter (existing CSS shows
  the signal underline). Existing scrolled/blur behaviour kept. Mobile menu unchanged.
- **JourneyReadout:** fixed bottom-inline-start on desktop, mono 0.65rem uppercase, e.g.
  `004 / shipped · work` with a 120px wire whose fill = chapter progress. Hidden < 1024px.
  A 1px signal progress wire sits at the bottom edge of the navbar on all sizes
  (`transform: scaleX(--journey-p)`, transform-origin inline-start).
- The existing "scroll ↓ 002 / about" hero line stays (it is part of the lane) but its wire is
  drawn by anime on intro.

## 9. CSS additions (`globals.css`)

- `main` uses `overflow-x: clip` (not `hidden`) so `position: sticky` works inside it.
- `.journey-canvas` fixed layer styles; `.pin-act` (`height: calc(var(--span) * 100vh)`),
  `.pin-stage` (`position: sticky; top: 0; height: 100vh`) applied only on
  `html.motion` at ≥ 1024px; otherwise the section is `height: auto`.
- `.depth` (`will-change: transform` only while in view, set by JS), `.watermark-num`.
- `html.motion .reveal-pre` initial states are **not** in CSS for below-fold content; JS sets
  them on mount so no-JS/SEO HTML has no hidden content. Only the hero intro uses a CSS-gated
  transform (`html.motion .hero-rise { transform: translateY(18px) }`) which anime clears.
- `prefers-reduced-motion` block already present; add: `.journey-canvas { display: none }`.

## 10. Bilingual / RTL

- `useAnimeScope` reverts and rebuilds the scope when `language` changes (React re-renders the
  text nodes, so split-text spans must be rebuilt). Sections already in/past view apply final
  states immediately (no replay flash).
- All x-motion uses logical direction: `x: [dir === 'rtl' ? 40 : -40, 0]`.
- `splitText` uses `{ lines: true, words: true, chars: false }`; Arabic uses `font-rubik` inside
  split spans (class copied from parent).
- Readout labels come from `chapters.ts` with EN/AR pairs.

## 11. Performance budget and verification

| Metric | Gate |
|---|---|
| Main JS added to the initial route | ≤ 15 KB gz (anime core + journey store/hooks). three.js is a separate lazy chunk (~150 KB gz) loaded on idle. |
| Lighthouse (mobile, local prod build) | Perf within −5 of baseline; SEO 100; A11y no regression; CLS ≤ 0.05 |
| Scroll frame time | ≤ 8 ms scripting per scroll frame at 1440×900 (Performance panel trace) |
| GPU | Field render ≤ 2 ms/frame desktop; render-on-demand idle ≤ 20 fps |
| Text contrast over field | Body ≥ 4.5:1, large ≥ 3:1 measured on composited screenshots at 6 scroll positions |

Verification steps (implementation plan will encode them):
1. `npm run build` + `npm start`; capture SSR HTML of `/` and `/?lang=ar` with curl; compare
   heading/JSON-LD/link counts and `sr-only-seo` presence against the production baseline.
2. Lighthouse mobile + desktop on `/` before and after (same machine, same build mode).
3. Chrome DevTools MCP: screenshots at hero, about, experience, projects p=0/0.3/0.6/1, services,
   contact, at 1440×900 and 390×844, EN and AR; reduced-motion emulation once.
4. Keyboard tab-through: focus order unchanged; pinned act does not trap focus.
5. `/seo-technical` (project `seo` agent) pass after the change, per CLAUDE.md auto-trigger.

## 12. Testing (unit, vitest)

- `lib/journey/field.test.ts`: piecewise mapping is monotone within chapters, clamps at 0/1,
  hero spin reversible, contact density = 0.35, projects order reaches 1.
- `lib/journey/galaxy.test.ts`: deterministic for a seed, correct array lengths, radii within
  bounds, colour ratio ≈ 9% signal ± 2%, lattice points inside the box.
- `lib/journey/store.test.ts`: active chapter resolution from offsets, progress clamping,
  velocity sign.
- `lib/journey/chapters.test.ts`: every chapter has EN+AR labels and a unique number/id.
- UI is verified visually (§11) rather than with jsdom.

## 13. Files removed / kept

- Removed from the hero: `<video>` galaxy (desktop + mobile), the `DesktopGalaxy`/`MobileGalaxy`
  components, framer `useScroll` usage.
- `public/galaxy.mp4` and `public/galaxy-mobile.mp4` become unreferenced and are deleted in the
  final cleanup task (recoverable from git history). `public/galaxy-poster.jpg` stays as the
  no-WebGL / reduced-motion fallback.
- Framer Motion stays for Navbar, FAQ accordion, blog, service pages.

## 14. Risks and mitigations

- **Sticky inside overflow:hidden** → `overflow-x: clip` on `main`; verified in Safari 16+.
- **Language toggle rebuilding split text** → scope revert/rebuild keyed on `language`; final
  state applied instantly for already-revealed sections.
- **Three.js bundle** → lazy chunk on idle, never SSR; skipped for reduced motion / no WebGL.
- **Contrast over particles** → density uniform per chapter + hero scrim; measured in §11.
- **Pinned act on short viewports** → pin only when `innerHeight ≥ 640`; otherwise flow.
- **CLS from fonts/split text** → split spans keep the same box; `text-wrap: balance` on
  headings; heights measured after `document.fonts.ready`.

## 15. Documentation

- Update `CLAUDE.md`: tech stack (+ anime.js, three.js), architecture (`components/journey`,
  `lib/journey`), design-system motion notes, the `overflow-x: clip` requirement, and the SEO
  invariants for the homepage (no inline hidden content, canvas lazy).
