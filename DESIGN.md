---
name: aboelmakarem.pro
description: Personal portfolio and bilingual blog for Abo-Elmakarem Shohoud
lane: vercel-after-midnight
colors:
  ink: "#0c0a09"           # page background, warm near-black
  slate: "#141211"         # surface, scrolled nav
  graphite: "#1c1917"      # card body
  wire: "#2a2522"          # hairline borders, dividers
  paper: "#f5f1ea"         # emphasis text, warm off-white
  ash: "#a09690"           # body copy, warm muted neutral
  signal: "#ff3b1f"        # the single saturated accent — signal red
  signal-deep: "#c92a10"   # signal hover
  moss: "#2f9e44"          # available-for-work dot, only non-signal saturated hue
typography:
  display:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "clamp(2.5rem, 8vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.05em"
  display-ar:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: "-0.04em"
  title:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  body-ar:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    letterSpacing: "0.18em"
    textTransform: uppercase
  code:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.8125rem"
rounded:
  none: "0"
  hairline: "2px"
  card: "2px"
  pill: "9999px"   # reserved for the live-status dot ONLY
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  section: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.paper}"
    rounded: "0"
    padding: "0.75rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.paper}"
    border: "1px solid {colors.signal}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    border: "1px solid {colors.wire}"
    rounded: "0"
    padding: "0.75rem 1.25rem"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.signal}"
    border: "1px solid {colors.signal}"
  card:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper}"
    border: "1px solid {colors.wire}"
    rounded: "0"
    padding: "1.75rem"
  card-hover:
    backgroundColor: "{colors.graphite}"
    border: "1px solid {colors.signal}"
  nav:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ash}"
    border: "1px solid {colors.wire}"
    rounded: "0"
    padding: "0 1.5rem"
  tag-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ash}"
    border: "1px solid {colors.wire}"
    rounded: "0"
    padding: "0.3rem 0.6rem"
  tag-chip-hover:
    textColor: "{colors.signal}"
    border: "1px solid {colors.signal}"
  input:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.paper}"
    border: "1px solid {colors.wire}"
    rounded: "0"
    padding: "0.75rem 1rem"
  input-focus:
    border: "1px solid {colors.signal}"
  status-dot:
    backgroundColor: "{colors.moss}"
    rounded: "{rounded.pill}"
    size: "6px"
---

# Design System: aboelmakarem.pro

## 1. Overview

**Lane: "Vercel-after-midnight"**

A warm near-black ink canvas, set in a single mono family at extreme weight contrast (200 vs 800), dressed like an engineer's spec sheet at 2am. Numbered section tabs, all-caps mono labels, hairline-bordered rectangles instead of soft glass cards, and a single saturated accent — signal red, not indigo, not violet — used as a brand mark on one period after the name and on hover states. The reader walks in on a craftsperson reading a printout: rectilinear, ordered, no glow, no orbs, no chrome.

The system is **Monochrome on the canvas, drenched in one place.** The neutrals carry 95%+ of every screen and stay warm-tinted (chroma 0.005–0.012 in OKLCH) so the page never reads as default-dark-mode. Signal red is the only saturated color, deployed once on the punctuation after the name, on the contact-section drenched block, and on hover transitions. It is not a palette — it is a single signal treated as a brand mark.

This system explicitly rejects the "generic AI tool landing page" aesthetic that lives next door in design space (purple gradients on every heading, glassmorphism on every panel, glow shadows on every card, animated orbs as wallpaper). It also rejects the corporate-enterprise (navy + grey + stock photo) and Wix-template ("Hi, I'm X" + identical project cards) anti-references called out in PRODUCT.md. The reference is Vercel/Linear build dashboards meets a Riso print-shop spec sheet.

**Key Characteristics:**
- Warm-tinted ink canvas (`#0c0a09` → `#1c1917`); no `#000`, no `#fff` anywhere on the site.
- A single saturated accent: **signal red** `#ff3b1f`. No indigo. No violet. No magenta. No gradient text.
- Single-family typographic system — JetBrains Mono Variable for all English roles, Rubik for all Arabic roles. The weight contrast (200 light / 800 extra-bold) IS the typographic voice.
- Hard, rectilinear corners (`2px` max, usually `0`). The only `9999px` radius on the site is the live-status dot. No pill buttons. No rounded-3xl cards.
- Hairline-bordered rectangles replace glass cards; flat ink replaces animated gradient backgrounds.
- Motion is restrained: opacity, transform-y on first reveal, hover = border-color shift over 150–200ms. No `scale(1.05)` on hover, no `translateY(-8px) scale(1.02)` card-lift, no gradient drift, no orbits-on-orbits.
- The bilingual surface is co-equal: Rubik for Arabic display + body matches the Latin sibling's tonal register; Arabic glyphs are not forced through a Latin mono.

## 2. Colors

A warm-tinted near-black neutral ramp, one saturated accent — signal red — and a single status hue. The palette is intentionally narrow. No indigo, no violet, no pink. No `#000` or `#fff`.

### Accent (the only saturated color)
- **Signal** (`#ff3b1f`): The system's voice. Used on the period after the name in the hero, on the contact-section drenched block, on borders during hover states, on focused-input borders, on link underlines, on small marker treatments (`▍`, `›`, `↗`), and on the primary CTA's hover-state. Treated as a single saturated mark, not a gradient stop.
- **Signal Deep** (`#c92a10`): Reserved for the rare interaction where signal red on signal red needs an active-state distinction. Not used decoratively.

### Neutral (warm ink ramp)
- **Ink** (`#0c0a09`): Page background. Warm-tinted near-black; sits naturally with signal red without going magenta-cool.
- **Slate** (`#141211`): Surface — scrolled nav background, elevated panels, code blocks.
- **Graphite** (`#1c1917`): Card body — every framed rectangle on the page.
- **Wire** (`#2a2522`): Hairline border color and divider color. The grid line of the system.
- **Ash** (`#a09690`): All body copy, captions, "muted" voice, navigation links at rest.
- **Paper** (`#f5f1ea`): Reserved for headings, hovered nav links, emphasized words inside body copy ("70%", "Ailigent"), the wordmark, and the primary button's resting fill (button is paper-on-ink, hover is signal-on-paper). Paper is rare on purpose.

### Status
- **Moss** (`#2f9e44`): The "Available for work" dot only. The only non-signal saturated hue in the system. Renders as a 6px circle (the only `9999px` radius on the site), with a soft pulsing ring. No pill, no glass, no badge framing.

### Named Rules

**The One Signal Rule.** Signal red is the system's brand mark. It appears at most three times per viewport: the punctuation period after the hero name, one drenched signal block (the contact CTA card), and the hover state of the focused interactive element. The signal loses its meaning the moment it becomes a habit. There are no signal gradient stops — only flat signal red.

**The 95% Quiet Rule.** Roughly 95% of any given screen is in the ink/slate/graphite/wire/ash/paper neutral ramp. Signal carries the remaining ≤5%. If a viewport has signal on more than three surfaces simultaneously, redesign.

**The Paper Is Rare Rule.** Default body copy is Ash (`#a09690`), not Paper. Paper (`#f5f1ea`) is reserved for headings, primary button fills, the wordmark, and one or two emphasized words per paragraph. A wall of paper-colored body text reads as a generic dark-mode template; ash with paper emphasis reads as composed.

**The Warm-Tint Rule.** Neutrals are tuned warm (oklch chroma 0.005–0.012, hue ~50–60°) so the system never lands on a default cool dark mode. Cool greys + signal red would read as cliché tech; warm greys + signal red reads as printed-paper-and-iron.

## 3. Typography

**Display Font (English):** JetBrains Mono Variable, weight 800 (ExtraBold), letter-spacing −0.05em.
**Body Font (English):** JetBrains Mono Variable, weight 400 (Regular). Same family, different weight — the contrast (200 vs 800) IS the typographic system.
**Display Font (Arabic):** Rubik, weight 800.
**Body Font (Arabic):** Rubik, weight 400.
**Code:** JetBrains Mono Variable (already body — code is treated as body in this system, with a slate-fill chip on inline use).

**Character:** Mono-everything. The system reads as an engineer's printout — terminal output, not magazine spread. Display = extreme weight, extreme size, extreme negative tracking. Body = regular weight, monospaced cadence, generous line-height (1.65). Labels = uppercase, letter-spacing 0.18em — used short, never on body copy. The Arabic pairing (Rubik) is chosen because it has a tonal sibling-quality with Latin mono-alphas at body weights and matches the Latin extrema at heading weight; the bilingual surface stays unified rather than splitting into "English engineer / Arabic editorial".

### Hierarchy

- **Display** (`JetBrains Mono 800`, `clamp(2.5rem, 8vw, 6.5rem)`, `line-height 0.92`, `letter-spacing -0.05em`): The hero name only. One per page.
- **Headline** (`JetBrains Mono 800`, `1.75rem` → `3rem` responsive, `line-height 0.95–1.0`, `letter-spacing -0.04em`): Section titles ("About", "Experience", "Projects", etc.). Always followed by a signal-red period.
- **Title** (`JetBrains Mono 700`, `1.25rem`, `letter-spacing -0.02em`): Card titles, project names.
- **Body** (`JetBrains Mono 400`, `0.9375rem` body / `0.8125rem` small, `line-height 1.65`): Default copy. Line length capped at 65–75 characters.
- **Label / Tab Eyebrow** (`JetBrains Mono 500`, `0.7rem`, `letter-spacing 0.18em`, `text-transform: uppercase`): Section numbering ("001 · engineer.profile"), spec-row keys, status labels, button micro-copy. Always short — never on running prose.
- **Code** (`JetBrains Mono 400`, `0.8125rem`): Same family as body, no swap. Inline code gets a slate-fill chip with signal-red text; block code gets a slate background and paper-colored text.

### Named Rules

**The Single-Family Rule.** One mono family carries every English role. Stacking a serif against a sans against a mono inside one viewport flattens the system; the weight contrast does the work that font-mixing usually does.

**The Bilingual Equality Rule.** Arabic does not reuse the Latin mono. Rubik carries every Arabic role (display + body) at matching weights to the Latin extrema. RTL is a parallel typography system, not a stylesheet patch on top of mono.

**The Tab Eyebrow Rule.** Every section opens with a numbered tab eyebrow (`▍ 003 · experience`). The eyebrow does the work that a "section subtitle in indigo" used to do, without the chromatic spend.

## 4. Elevation

The system uses **tonal layering as the primary depth strategy and box-shadow only as a state response**, never as a default ambient treatment. Surfaces are flat at rest; shadow appears under three conditions only:

1. **Hover** on cards and CTAs (a focused indigo glow that signals interactivity).
2. **Focus** on inputs and links (a soft indigo ring for accessibility).
3. **The hero portrait** (an ambient indigo glow that reads as stage lighting, not as a card shadow).

The neutrals form a 3-step ramp — Obsidian Base → Obsidian Surface → Obsidian Card — and that ramp does most of the depth work without any shadow at all. A card sits on the page because it is one step lighter, not because it floats.

### Shadow Vocabulary

- **Hover Glow** (`box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.25)`): Cards and primary CTAs on hover. The lift is a `translateY(-8px) scale(1.02)` combined with this shadow, eased over `0.4s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Stage Glow** (`box-shadow: 0 0 40px rgba(99, 102, 241, 0.3), 0 0 80px rgba(139, 92, 246, 0.2), 0 0 120px rgba(99, 102, 241, 0.1)`): The hero portrait only. Three-stop layered glow that reads as ambient stage lighting. Not used elsewhere.
- **Focus Ring** (`box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5)`): Inputs and keyboard-focused links. Always rendered alongside the default focus outline; never replaces it.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadow is a state response (hover, focus, the hero portrait), never a decorative ambient treatment on every card.

**The No-Generic-Glow Rule.** Glow is reserved for the hero portrait and hover states. Sprinkling glow shadows under every section heading or feature card is the AI-tool-landing-page tell. If a glow doesn't have a state reason, remove it.

## 5. Components

### Buttons

- **Shape:** Pill (`rounded-full`, `9999px`).
- **Primary:** Electric Indigo fill (`#6366f1`), white text, weight 500–600, padding `1rem 2rem`. Hover transitions toward Signal Violet over `0.3s` and adds the Hover Glow shadow. The hero's two primary CTAs are the only place the full indigo→violet gradient fill is used; subsequent primaries on lower sections use a flat indigo fill.
- **Ghost:** Transparent fill, `1px` border `rgba(255, 255, 255, 0.20)`, white text, same padding. Hover lifts the border to `rgba(255, 255, 255, 0.35)` and tints the background to Obsidian Surface. Used as the secondary CTA next to a Primary.
- **Hover/Focus:** No size jump (no `scale(1.05)` — pill buttons that grow on hover read as toy-like). State change happens via background, border, and shadow only. Focus uses the system focus ring (3px indigo at 50% opacity).

### Tech Badges

- **Style:** Obsidian Card background tinted with a `linear-gradient` of indigo→violet at ~10% opacity, `1px` border at `rgba(99, 102, 241, 0.3)`, indigo text or icon, padding `0.5rem 1rem`, `lg` radius (`0.75rem`).
- **Hover:** Border brightens to solid Electric Indigo, background tint doubles to ~20%, badge translates `-2px` on Y. Used on the homepage to enumerate the stack (TypeScript, Python, React, Next.js, Docker, etc.).

### Cards / Containers

- **Corner Style:** `xl` radius (`1rem`).
- **Background:** Obsidian Card (`#1a1a1a`), with optional gradient overlays at 10–20% opacity for project cards (each flagship project gets its own brand gradient, e.g. blue→cyan for Tornix.ai, indigo→violet for Oravex.app, orange→red for Costra).
- **Border:** None at rest; `1px` solid `rgba(255, 255, 255, 0.05)` if a hairline is needed.
- **Shadow Strategy:** Flat at rest. Hover Glow on interactive cards.
- **Internal Padding:** `1.5rem` standard, `2rem` for project cards.
- **Hover Behavior:** `translateY(-8px) scale(1.02)` over `0.4s cubic-bezier(0.4, 0, 0.2, 1)` plus Hover Glow shadow. Non-interactive cards do not lift.

### Inputs / Fields

- **Style:** Obsidian Surface background (`#111111`), `1px` border `rgba(255, 255, 255, 0.1)`, white text, `md` radius (`0.5rem`), padding `0.875rem 1rem`.
- **Placeholder:** Ash Text (`#a1a1aa`).
- **Focus:** Border shifts to Electric Indigo, system focus ring renders at 3px indigo/50%. No background change.
- **Error / Disabled:** Error border `#ef4444`; disabled drops to 50% opacity.

### Navigation

- **Style:** Fixed top, transparent at scroll position 0, transitions to a `glass` treatment (Obsidian Surface at 60% with `backdrop-filter: blur(20px)`, `1px` border `rgba(255, 255, 255, 0.1)`) once scrolled past 50px.
- **Logo:** "AE" monogram in Syne 700, sized at `1.5rem`, in Pure White. The brand-beam underline appears on hover only — not at rest.
- **Links:** Ash Text at rest, Pure White on hover, with a brand-beam underline that animates from `0` to `100%` width over `0.3s`. **The current site uses `gradient-text` on the logo monogram itself; future revisions should drop that to a flat white wordmark per the No-Gradient-Text Rule below.**
- **Mobile:** Slide-from-right full-screen menu with `backdrop-filter: blur(20px)` over Obsidian Base at 95%. Links rendered in display type at `1.875rem`.
- **Default → Active:** Active link uses Pure White text, an underline always visible at full width, and a subtle `1px` indigo bottom border.

### Signature Components

#### Hero Orbital Tech Stack

The hero portrait is encircled by 6 floating tech-stack icons (TypeScript, Python, React, Next.js, OpenAI, Docker) on independent orbital paths (each with a slightly different `animation-duration` between 25–40s). Each icon sits inside a glass pill at `rounded-xl`. This is the system's signature — it reads as "the work in motion around the maker" and is the one place in the design where decorative motion is the point. Do not duplicate this metaphor elsewhere; it dilutes if reused.

#### Available-For-Work Status Pill

Glass-style pill anchored to the bottom-right of the hero portrait. A 2px Ready Green dot pulses gently next to a "Available for work" label in green text. The pulse is the only animated dot in the system — it carries semantic weight, not decoration.

## 6. Do's and Don'ts

### Do:
- **Do** keep ~90% of every screen in the obsidian neutral ramp. The accent beam is rare on purpose.
- **Do** treat the indigo→violet beam as a brand mark. Use it on the hero name once, on the primary CTA at most once per viewport, and nowhere else as a default fill.
- **Do** lead body copy in Ash Text (`#a1a1aa`) and reserve Pure White for headings and one-or-two emphasized words per paragraph.
- **Do** use Syne for English display, Cairo for Arabic display, Space Grotesk for English body, IBM Plex Sans Arabic for Arabic body. The pairings are deliberate — don't substitute.
- **Do** cap body line length at 65–75 characters.
- **Do** use the pill (`9999px`) on primary buttons and `xl` (`1rem`) on cards. Hard 90° corners belong only on code blocks and section dividers.
- **Do** ease motion with exponential ease-out (`cubic-bezier(0.4, 0, 0.2, 1)` or quart/quint/expo). State changes are quick (`0.2–0.4s`); ambient motion is slow (`6–25s`).
- **Do** respect `prefers-reduced-motion` — disable orbital animation, gradient drift, pulse rings, click radiate, and the custom cursor when the user opts out.
- **Do** treat the Arabic surface as co-equal — same hierarchy, same loading speed, same SEO indexability, same typographic care.
- **Do** make every interactive element keyboard-reachable with a visible focus ring (3px indigo at 50% opacity).

### Don't:
- **Don't** turn the indigo→violet beam into a habit. *Generic AI tool landing pages stamp purple gradients on every heading, every card border, every CTA — that is the most important anti-reference in PRODUCT.md and the trap this site is closest to falling into.* If the gradient appears in more than two places per page, redesign.
- **Don't** apply `gradient-text` (background-clip text + linear-gradient) anywhere except the hero name. The "rainbow heading" pattern across blog posts and section titles reads as decorative-AI by default — replace with flat Pure White and let weight or size carry emphasis.
- **Don't** use glassmorphism as a default. The current site uses `glass` on the navbar (justified), the social pill (justified), and the status pill (justified) — that is the ceiling. Adding `glass` to cards, sections, or feature panels crosses into the cliché.
- **Don't** use glow shadows decoratively. Glow is a state response (hover) or the hero portrait. A glow under every card or every section heading is the AI-tool-landing-page tell.
- **Don't** use animated background orbs as wallpaper on every section. The hero has them as a deliberate atmospheric move; subsequent sections should be flat.
- **Don't** use `border-left` greater than 1px as a colored accent stripe on cards, list items, or callouts. Use full borders, leading icons, or background tints instead. (The current blog blockquote uses a 3-4px indigo `border-left` and is the one tolerated exception — see how it scales before applying elsewhere.)
- **Don't** use the hero-metric template (big number + small label + supporting stats + gradient accent). The "70%" claim in the hero is OK as a single sentence emphasis; it must not become a 4-up metric grid.
- **Don't** use identical card grids — three feature cards with icon + heading + paragraph, repeated. Vary card size, content, and aspect ratio across the projects section.
- **Don't** use #000 or #fff at full saturation. The system uses `#0a0a0a` and Ash Text/Pure White for a reason — the slight cool tint and the muted neutral both pull the design out of "default dark mode."
- **Don't** reach for a modal as a first thought. Inline progressive disclosure beats a modal almost every time.
- **Don't** reintroduce CEO/Co-founder framing in any heading, badge, or copy treatment. The CV is the source of truth: Full-Stack Developer / DevOps / Scrum Master / Business Analyst at Ailigent.
- **Don't** let the design land on a generic "developer portfolio → dark + purple gradient" silhouette. If a redesign cannot defend itself against the category-reflex test in PRODUCT.md (could a recruiter guess the theme from the category alone?), it has to be reworked.
