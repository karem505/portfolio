# CLAUDE.md — aboelmakarem.pro Portfolio Website

## Project Overview

Personal portfolio and blog for **Abo-Elmakarem Shohoud** (Karem / كارم شهود) — Full-Stack Developer, DevOps Engineer, Scrum Master & Business Analyst at Ailigent. Ships AI-powered SaaS (Tornix.ai · Oravex.app · Costra.net) for clients across Egypt, UAE, and KSA. Cairo, Egypt.

- **Live**: https://aboelmakarem.pro
- **Netlify**: abo-elmakarem (`ccc54db2-f196-4526-8d58-849ab31b60f0`) — auto-deploys on push to `master`
- **GitHub**: karem505/portfolio
- **Supabase**: `zklvvwugirvwimxdvybw.supabase.co`
- **Identity source of truth**: `Abo-Elmakarem_CV-1.pdf` (project root, gitignored). Hero title, About bio, Experience roles/bullets, Projects (Tornix.ai · Oravex.app · Costra.net), layout metadata, JsonLd.tsx, Footer byline, and opengraph-image.tsx must stay aligned with this CV. Never reintroduce "CEO" / "Co-founder" framing — the CV positions Karem as Full-Stack Developer / DevOps / Scrum Master / Business Analyst at Ailigent. The `/ai-training` and `/digital-transformation` service pages frame these offerings as Karem's **personal, independent** services (independent consultant & corporate AI trainer) — never as an "agency" and never "via Ailigent"; this is an extension of his expertise, not a job-title change.

## Tech Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion · react-icons · Supabase (blog CMS, bilingual EN/AR) · react-markdown + rehype/remark · GA4 · Netlify Forms · `@netlify/plugin-nextjs` · Node 20 · npm

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
  api/ — og/route.tsx, revalidate/route.ts, newsletter/{subscribe,unsubscribe}/route.ts
components/ — Navbar, Hero, About, Experience, Projects, Services, ServicePage, Testimonials, RecentPosts, FAQ, Contact, Footer, Newsletter, ClickEffect, Analytics, JsonLd, SimplePageHeader, LanguageToggle, ArabicSeoContent
  blog/ — BlogCard, BlogContent, BlogHeader, BlogSidebar, LanguageToggle, ArticleJsonLd
lib/ — supabase.ts, blog.ts, types.ts, LanguageContext.tsx
supabase/ — schema.sql
public/ — profile.jpg, cursor.png, favicons, __forms.html, GSC verification, IndexNow key
```

Path alias: `@/*` → project root.

## Supabase

**Tables**: `posts` (bilingual, dual fields `*_en`/`*_ar`, types: news/how-to/tutorial/analysis/tool-review/insights/trending, statuses: draft/published/archived, full-text search vectors), `categories`, `tags`, `newsletter_subscribers`

**RLS**: Public reads published posts/categories/tags. Service role has full access.

**Data flow**: SSG via `generateStaticParams` → ISR via `/api/revalidate?secret=XXX&path=/blog` → RSS revalidates hourly → Sitemap includes EN + AR variants.

## Bilingual (EN/AR)

`LanguageContext` provides `language`, `setLanguage`, `t()`, `dir`. Stored in `?lang=ar` param + localStorage. Sync `html lang/dir` on every switch. RTL CSS in globals.css.

**Scope**: `LanguageProvider` wraps the whole site at `app/layout.tsx` (not blog-only). `LanguageToggle` (EN/ع) lives in `Navbar.tsx` desktop + mobile.

**Fonts** (`app/fonts.ts`):
- EN — JetBrains Mono variable (weights 200–800). Display = ExtraBold mono, body = mono Regular/Light. Single-family system.
- AR — Rubik (latin + arabic subsets, weights 300–900). All Arabic strings use `font-rubik`; mono is reserved for Latin in AR mode.

**Hidden Arabic SEO block** (`components/ArabicSeoContent.tsx` + `.sr-only-seo` in globals.css): always-SSR'd Arabic copy on the homepage with the Arabic name (ابوالمكارم شهود), services, projects, contact. Visually hidden, fully indexable — fixes the case where client-rendered toggling made the AR surface invisible to Googlebot.

**hreflang**: set **per-page** via metadata `alternates.languages` (homepage in `app/page.tsx`; the service pages in their own `generateMetadata`), so each route emits exactly one hreflang set instead of the homepage's hreflang leaking onto every subpage. Next 14.2 preserves the `?lang=ar` query for non-root paths (e.g. `/ai-training?lang=ar`) but normalizes the **root** `?lang=ar` to `/` — so the homepage legitimately self-groups en/ar/x-default at `/` (it's one server-URL with a client toggle + always-rendered `.sr-only` Arabic block). The distinct `/?lang=ar` is still listed in the sitemap for discovery. **Do not re-add raw `<link rel="alternate">` injection in `app/layout.tsx`** — it applied the homepage's hreflang to every subpage.

## Design System

**Colors**: background `#0a0a0a`, surface `#111111`, card `#1a1a1a`, primary `#6366f1`, accent `#8b5cf6`, muted `#a1a1aa`

**CSS utilities**: `.gradient-text`, `.glass`, `.glow`, `.noise`, `.animated-gradient`, `.card-hover`, `.float`, `.orbit`, `.blog-content`, `.tech-badge`

## SEO

JSON-LD (Person, Website, Organization, ProfessionalService, Service, Course, FAQPage, BreadcrumbList, Article) · Dynamic OG images (Edge, Arabic support) · GSC verified · IndexNow · Dynamic sitemap (EN + AR including homepage `/?lang=ar` and the service pages) · RSS `/feed.xml` · Canonical + per-page metadata hreflang (en/en-US/ar/ar-EG/x-default) · Hidden `ArabicSeoContent` block on homepage for AR query indexing · `<title>` carries both `Abo-Elmakarem Shohoud · ابوالمكارم شهود` · robots.txt disallows `/api/`, `/_next/` · Twitter `@karem_shohud`

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
