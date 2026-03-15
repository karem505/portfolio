# CLAUDE.md — aboelmakarem.pro Portfolio Website

## Project Overview

Personal portfolio and blog for **Abo-Elmakarem Shohoud** (Karem / كارم شهود), CEO & Co-founder at Ailigent. AI Automation Expert, Voice Agent Builder, Full-Stack Developer — Cairo, Egypt.

- **Live**: https://aboelmakarem.pro
- **Netlify**: abo-elmakarem (`ccc54db2-f196-4526-8d58-849ab31b60f0`)
- **GitHub**: karem505/portfolio
- **Supabase**: `zklvvwugirvwimxdvybw.supabase.co`

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
components/ — Navbar, Hero, About, Experience, Projects, Testimonials, RecentPosts, FAQ, Contact, Footer, Newsletter, ClickEffect, Analytics, JsonLd, SimplePageHeader
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

`LanguageContext` provides `language`, `setLanguage`, `t()`, `dir`. Stored in `?lang=ar` param + localStorage. RTL CSS in globals.css. Fonts: Cairo + IBM Plex Sans Arabic (AR), Syne + Space Grotesk (EN).

## Design System

**Colors**: background `#0a0a0a`, surface `#111111`, card `#1a1a1a`, primary `#6366f1`, accent `#8b5cf6`, muted `#a1a1aa`

**CSS utilities**: `.gradient-text`, `.glass`, `.glow`, `.noise`, `.animated-gradient`, `.card-hover`, `.float`, `.orbit`, `.blog-content`, `.tech-badge`

## SEO

JSON-LD (Person, Website, Organization, ProfessionalService, FAQPage, BreadcrumbList, Article) · Dynamic OG images (Edge, Arabic support) · GSC verified · IndexNow · Dynamic sitemap (EN + AR) · RSS `/feed.xml` · Canonical + hreflang · robots.txt disallows `/api/`, `/_next/` · Twitter `@karem_shohud`

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
| `/` | Homepage (sections: Navbar, Hero, About, Experience, Projects, Testimonials, RecentPosts, FAQ, Contact, Footer) |
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
