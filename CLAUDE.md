# CLAUDE.md — aboelmakarem.pro Portfolio Website

## Project Overview

Personal portfolio and blog for **Abo-Elmakarem Shohoud** (Karem / كارم شهود) — Full-Stack Developer, DevOps Engineer, Scrum Master & Business Analyst at Ailigent. Ships AI-powered SaaS (Tornix.ai · Oravex.app · Costra.net) for clients across Egypt, UAE, and KSA. Cairo, Egypt.

- **Live**: https://aboelmakarem.pro
- **Netlify**: abo-elmakarem (`ccc54db2-f196-4526-8d58-849ab31b60f0`) — auto-deploys on push to `master`
- **GitHub**: karem505/portfolio
- **Supabase**: `zklvvwugirvwimxdvybw.supabase.co`
- **Identity source of truth**: `Abo-Elmakarem_CV-1.pdf` (project root, gitignored). Hero title, About bio, Experience roles/bullets, Projects (Tornix.ai · Oravex.app · Costra.net), layout metadata, JsonLd.tsx, Footer byline, and opengraph-image.tsx must stay aligned with this CV. Never reintroduce "CEO" / "Co-founder" framing — the CV positions Karem as Full-Stack Developer / DevOps / Scrum Master / Business Analyst at Ailigent. The `/ai-training` and `/digital-transformation` service pages frame these offerings as Karem's **personal, independent** services (independent consultant & corporate AI trainer) — never as an "agency" and never "via Ailigent"; this is an extension of his expertise, not a job-title change.

## Tech Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion (blog/subpages only) · anime.js 4 (homepage scroll-linked motion) · three.js (lazy WebGL field) · react-icons · Supabase (blog CMS, bilingual EN/AR) · react-markdown + rehype/remark · GA4 · Netlify Forms · `@netlify/plugin-nextjs` · Node 20 · npm

## Commands

```bash
npm run dev          # Dev server :3000
npm run build        # Production build
netlify deploy --prod  # Deploy to production
netlify status       # Check site status
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public, read-only) |
| `SUPABASE_SERVICE_KEY` | Service role key (server-side, bypasses RLS) |
| `REVALIDATE_SECRET` | ISR revalidation webhook secret |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID |

## Architecture

```
app/
  layout.tsx, page.tsx, fonts.ts, globals.css, robots.ts, sitemap.ts, opengraph-image.tsx
  feed.xml/route.ts, privacy/, refund/, contact-info/
  blog/ — layout.tsx, page.tsx (SSR links + BlogPageClient), BlogPageClient.tsx, [slug]/page.tsx + BlogPostClient.tsx
  apps/ — page.tsx (apps hub), pharmacy-manual/ (download page)
  api/ — og/route.tsx, revalidate/route.ts, newsletter/{subscribe,unsubscribe}/route.ts, download/pharmacy-manual/route.ts
components/ — Navbar, Hero, About, Experience, Projects, Services, ServicePage, Testimonials, RecentPosts, FAQ, Contact, Footer, Newsletter, ClickEffect, Analytics, JsonLd, SimplePageHeader, LanguageToggle, ArabicSeoContent
  blog/ — BlogCard, BlogContent, BlogHeader, BlogSidebar, LanguageToggle, ArticleJsonLd
  journey/ — JourneyStage (fixed three.js canvas, lazy), GalaxyField (scene + shaders), JourneyReadout (fixed chapter readout)
lib/ — supabase.ts, blog.ts, types.ts, LanguageContext.tsx, latestApk.ts
  journey/ — chapters.ts, field.ts (scroll→uniforms, tested), galaxy.ts (geometry, tested), store.ts (scroll store + hooks, tested), reveal.ts, useAnimeScope.ts, usePinned.ts
supabase/ — schema.sql
public/ — profile.jpg, cursor.png, favicons, __forms.html, GSC verification, IndexNow key
```

Path alias: `@/*` → project root.

## Supabase

**Tables**: `posts` (bilingual, dual fields `*_en`/`*_ar`, types: news/how-to/tutorial/analysis/tool-review/insights/trending, statuses: draft/published/archived, full-text search vectors), `categories`, `tags`, `newsletter_subscribers`

**RLS**: Public reads published posts/categories/tags. Service role has full access.

**Data flow**: SSG via `generateStaticParams` → ISR via `/api/revalidate?secret=XXX&path=/blog` → RSS revalidates hourly (full English article HTML in `content:encoded`, 30 newest indexable posts) → Sitemap includes EN + AR variants.

**Blog post SSR per language**: `app/blog/[slug]/page.tsx` reads `searchParams.lang` (the route is request-rendered because `generateMetadata` already does) and renders the requested language on the server: one `ArticleJsonLd` in that language, localized BreadcrumbList, `<div lang dir>` around the article, and a scoped `<LanguageProvider initialLanguage>` so `?lang=ar` ships Arabic HTML to crawlers. `LanguageProvider` nested under the root provider mirrors the root's later toggles and delegates `setLanguage` to it. Never render a second client-side `ArticleJsonLd`.

**Hidden SSR nav on `/blog`** lists indexable posts only (`!seo_noindex`); the `/blog` h1 lives in `BlogIntro`, outside the `useSearchParams` Suspense boundary, so it is in the SSR HTML. `postPath(slug, lang)` (`lib/postPath.ts`) is the only way to build post links: EN is the bare path, AR appends `?lang=ar`, never `?lang=en`.

## Bilingual (EN/AR)

`LanguageContext` provides `language`, `setLanguage`, `t()`, `dir`. Stored in `?lang=ar` param + localStorage. Sync `html lang/dir` on every switch. RTL CSS in globals.css.

**Scope**: `LanguageProvider` wraps the whole site at `app/layout.tsx` (not blog-only). `LanguageToggle` (EN/ع) lives in `Navbar.tsx` desktop + mobile.

**Fonts** (`app/fonts.ts`):
- EN — JetBrains Mono variable (weights 200–800). Display = ExtraBold mono, body = mono Regular/Light. Single-family system.
- AR — Rubik (latin + arabic subsets, weights 300–900). All Arabic strings use `font-rubik`; mono is reserved for Latin in AR mode.

**Hidden Arabic SEO block** (`components/ArabicSeoContent.tsx` + `.sr-only-seo` in globals.css): always-SSR'd Arabic copy on the homepage with the Arabic name (ابوالمكارم شهود), services, projects, contact. Visually hidden, fully indexable — fixes the case where client-rendered toggling made the AR surface invisible to Googlebot.

**Sitemap `lastmod`**: static routes use the real dates in `STATIC_LASTMOD` (`app/sitemap.ts`); bump the matching entry when a page's content changes. `/blog` uses the newest indexable post's `updated_at`. Never use `new Date()` for lastmod.

**hreflang**: set **per-page** via metadata `alternates.languages` (homepage in `app/page.tsx`; the service pages in their own `generateMetadata`), so each route emits exactly one hreflang set instead of the homepage's hreflang leaking onto every subpage. Next 14.2 preserves the `?lang=ar` query for non-root paths (e.g. `/ai-training?lang=ar`) but normalizes the **root** `?lang=ar` to `/` — so the homepage legitimately self-groups en/ar/x-default at `/` (it's one server-URL with a client toggle + always-rendered `.sr-only` Arabic block). The distinct `/?lang=ar` is still listed in the sitemap for discovery. **Do not re-add raw `<link rel="alternate">` injection in `app/layout.tsx`** — it applied the homepage's hreflang to every subpage.

## Design System

**Colors** (lane: "Vercel-after-midnight", see `tailwind.config.js`): ink `#0c0a09` (page), slate `#141211` (surface), graphite `#1c1917` (card), wire `#2a2522` (hairlines), paper `#f5f1ea` (emphasis text), ash `#a09690` (body), signal `#ff3b1f` (the single accent), moss `#2f9e44` (status dot only). Legacy names `background/surface/card/primary/accent/muted` alias onto this ramp.

**CSS utilities**: `.gradient-text`, `.glass`, `.glow`, `.noise`, `.animated-gradient`, `.card-hover`, `.float`, `.orbit`, `.blog-content`, `.tech-badge`

## Motion System (homepage)

Spec: `docs/superpowers/specs/2026-09-02-scroll-journey-redesign-design.md` · plan: `docs/superpowers/plans/2026-09-02-scroll-journey-redesign.md`.

- **Gate:** an inline `<head>` script in `app/layout.tsx` adds `html.motion` when JS runs and `prefers-reduced-motion` is off. All decorative pre-states key off it; the SSR HTML never contains hidden content (no inline `opacity:0`). `<html>` carries `suppressHydrationWarning` for that class.
- **Store:** `lib/journey/store.ts` — one passive scroll listener → page/chapter progress, `--journey-p` / `--chapter-p` CSS vars on `<html>`, `useJourney()` / `useJourneyChapter()`. Chapters come from `lib/journey/chapters.ts` (section ids `home … contact`; `blog` is optional).
- **Reveals:** sections use `useAnimeScope` + `lib/journey/reveal.ts` (`revealUp`, `revealSlide`, `revealLines`, `parallax`/`parallaxLayers` via `data-depth`). Scopes rebuild on language change; split headings carry `key={language}` so React remounts them (anime mutates their children). Text splits by lines/words only (Arabic-safe), never characters.
- **Pinned act:** Projects only, when `usePinned()` is true (html.motion + ≥1024px wide + ≥720px tall). CSS-sticky `.pin-stage` inside `section#projects.pin-act[data-pinned]`; one anime timeline linked to `onScroll({ sync: true })`; the end state equals the static grid. The stage content zooms on shorter viewports (`--pin-zoom` media queries) and the FLIP offsets divide by that zoom.
- **WebGL:** `components/journey/JourneyStage.tsx` mounts `GalaxyField` on idle, only with `html.motion` + WebGL2; three.js is a separate lazy chunk (never in the route's First Load JS). Uniforms come from `fieldState()` (pure, tested). Hero keeps `public/galaxy-poster.jpg` as the instant paint + no-WebGL/reduced-motion fallback; the old scrubbed `galaxy*.mp4` clips were removed.
- **Headless renderers:** `revealAllImmediately(innerHeight)` (`lib/journey/reveal.ts`) skips every reveal when the viewport is taller than 1600px (Google's renderer never scrolls), and the hero / pinned runway / silence-beat heights are capped in px, so a tall no-scroll render shows all copy at rest. Subpage intros (blog, service, legal) use the `enter-up` / `enter-down` / `enter-fade` CSS classes gated on `html.motion`; do not reintroduce Framer `initial={{ opacity: 0 }}` on any route.
- **Chrome:** Navbar marks the active chapter with `aria-current` (homepage only) and draws the `--journey-p` wire; nav entrance, mobile menu and FAQ accordion are CSS-only (no Framer on the homepage route).
- **Invariants:** `main` uses `overflow-x: clip` (never `hidden`, or sticky breaks); never move copy into the canvas; keep `ArabicSeoContent` always rendered; re-run the SSR gate in the plan (headings / JSON-LD / links / no hidden content) after touching homepage sections.

## SEO

JSON-LD (Person `#person`, Website, Organization `#organization` with `/logo.png`, ProfessionalService, Service, Course, FAQPage (6 engineer Q&As + 2 service Q&As linking the service pages), BreadcrumbList, BlogPosting chained to `#person` / `#organization`; posts without a featured image use `/api/og` as the schema image) · Dynamic OG images (Edge, Arabic support) · GSC verified · IndexNow · Dynamic sitemap (EN + AR including homepage `/?lang=ar` and the service pages) · RSS `/feed.xml` · Canonical + per-page metadata hreflang (en/en-US/ar/ar-EG/x-default) · Hidden `ArabicSeoContent` block on homepage for AR query indexing · `<title>` carries both `Abo-Elmakarem Shohoud · ابوالمكارم شهود` · robots.txt disallows `/api/`, `/_next/` · Twitter `@karem_shohud`

## Google Search Console (gwcli)

`gwcli` CLI at `~/google-workspace-cli/`. Profile: `karem`. **Always use for search performance, indexing, sitemaps.**

```bash
gwcli sc sites                                                    # List sites
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions query --limit 50  # Top queries
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions page  # Top pages
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions date --start YYYY-MM-DD --end YYYY-MM-DD
gwcli sc inspect "<url>" --site "https://aboelmakarem.pro/"       # Check indexing status
gwcli sc request-indexing "<url>"                                  # Request Google indexing
gwcli sc sitemaps "https://aboelmakarem.pro/"                     # Check sitemaps
gwcli sc submit-sitemap "https://aboelmakarem.pro/" "https://aboelmakarem.pro/sitemap.xml"
```

**Status check (sitemap record + index state of the key URLs):** `node scripts/gsc-status.mjs` (add URLs as arguments to inspect others). The CLI's `sc inspect` prints only five fields; this script also shows Google's chosen canonical and rich-result verdict. After a deploy that changes indexable pages: resubmit the sitemap, request indexing for the changed URLs, send the IndexNow batch, then re-run this script after 1–2 weeks to confirm recrawl dates moved past the deploy.

**Token refresh (on `invalid_grant`):** gwcli has no `auth login` command. Re-auth = remove + re-add the profile (browser OAuth). User must run interactively:
```bash
gwcli profiles remove karem
gwcli profiles add karem --client ~/google-workspace-cli/client_secret_299760082180-sje9aado1gtu3anq9u9k2h1o9m8lq45d.apps.googleusercontent.com.json
```

### IndexNow (Bing/Yandex)

Key: `aboelmakarem2026indexnowkey`. Submit via:
```bash
curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" \
  -d '{"host":"aboelmakarem.pro","key":"aboelmakarem2026indexnowkey","keyLocation":"https://aboelmakarem.pro/aboelmakarem2026indexnowkey.txt","urlList":["<url>"]}'
```

## SEO Skills (Auto-Use)

Installed at `~/.claude/skills/seo/`. **Auto-invoke when task involves SEO:**

| Task | Skill |
|---|---|
| Full audit | `/seo audit https://aboelmakarem.pro` |
| Page analysis | `/seo-page <url>` |
| Technical SEO | `/seo-technical https://aboelmakarem.pro` |
| Content/E-E-A-T | `/seo-content` |
| Schema markup | `/seo-schema` |
| Sitemap | `/seo-sitemap` |
| Images | `/seo-images` |
| Hreflang | `/seo-hreflang` |
| AI search (GEO) | `/seo-geo` |
| Strategy | `/seo-plan` |
| Programmatic | `/seo-programmatic` |
| Competitor pages | `/seo-competitor-pages` |

### Auto-trigger rules

- **SEO/ranking/indexing/traffic mentioned** → relevant `/seo-*` skill
- **Search performance check** → `gwcli sc analytics` first, then SEO skills
- **After publishing posts** → (1) `gwcli sc request-indexing` (2) IndexNow curl (3) verify sitemap (4) `/seo-page`
- **After crawl-affecting changes** → `/seo-technical`

## Key Patterns

- **Server vs Client**: Server components for metadata; `'use client'` wrappers for interactivity
- **SSR Arabic SEO block**: homepage always renders `<ArabicSeoContent>` (sr-only-seo) with the Arabic name and copy, so AR queries index even though the visible UI is client-toggled
- **SSR blog links**: `/blog` renders hidden `<nav class="sr-only">` with all post links (EN + AR) for Googlebot
- **Framer Motion**: `useInView` with `once: true` for scroll animations
- **Contact form**: Netlify Forms + honeypot → fetch to `/__forms.html`
- **Newsletter**: API routes → Supabase `newsletter_subscribers`
- **Blog search**: Client-side ILIKE against Supabase
- **Pagination**: 9 posts/page, client-side
- **Images**: Next.js Image with AVIF/WebP

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — bilingual EN/AR via Navbar toggle, `?lang=ar` for direct AR access. Sections: Navbar, Hero, About, Experience, Projects, Services, RecentPosts, FAQ, Contact, Footer + hidden ArabicSeoContent |
| `/ai-training` | Service landing page — **Professional AI Training for Employees & Executives**. Server-rendered, bilingual via `?lang=ar` (distinct EN/AR server HTML). Schema: Service + Course + FAQPage + BreadcrumbList. Targets corporate/executive AI-training queries (Egypt/UAE/KSA). |
| `/digital-transformation` | Service landing page — **Digital Transformation consulting**. Server-rendered, bilingual via `?lang=ar`. Schema: Service + FAQPage + BreadcrumbList. Targets digital-transformation / process-automation queries (Egypt/UAE/KSA). |
| `/apps` | Apps hub — server-rendered, bilingual via `?lang=ar`. Data-driven grid (`APPS` array in `app/apps/page.tsx`) listing installable apps; currently Pharmacy Manual. Linked from the Footer. Schema: CollectionPage + ItemList + BreadcrumbList. Append an `APPS` entry to add a future app. |
| `/apps/pharmacy-manual` | App download page — **Pharmacy Manual** (دليل الأدوية الإكلينيكي), an offline Egyptian drug index + price-checker Android app. Server-rendered, bilingual via `?lang=ar`. Store-style layout. Download button resolves the **latest APK dynamically** at request time (ISR `revalidate=3600`) from the separate `karem505/pharmacy-manual-apk` repo's Contents API via `lib/latestApk.ts`, with `/api/download/pharmacy-manual` as a stable 302 redirect. Schema: MobileApplication + FAQPage + BreadcrumbList. |
| `/blog` | Blog listing (search, categories, pagination) |
| `/blog/[slug]` | Blog post (SSG + ISR) |
| `/privacy` | Privacy policy |
| `/refund` | Refund policy |
| `/contact-info` | Contact page |
| `/feed.xml` | RSS feed |
| `/sitemap.xml` | Dynamic sitemap |
| `/api/og` | OG image generation |
| `/api/revalidate` | ISR webhook |
| `/api/newsletter/*` | Subscribe/unsubscribe |
