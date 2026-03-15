# CLAUDE.md — aboelmakarem.pro Portfolio Website

## Project Overview

Personal portfolio and blog website for **Abo-Elmakarem Shohoud** (Karem Shohoud / كارم شهود), CEO & Co-founder at Ailigent. The site positions him as an AI Automation Expert, Voice Agent Builder, and Full-Stack Developer based in Cairo, Egypt.

- **Live URL**: https://aboelmakarem.pro
- **Netlify site**: abo-elmakarem (site ID: `ccc54db2-f196-4526-8d58-849ab31b60f0`)
- **GitHub**: karem505
- **Supabase project**: `zklvvwugirvwimxdvybw.supabase.co`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3 + custom CSS utilities in `globals.css`
- **Animations**: Framer Motion
- **Icons**: react-icons (Heroicons v2 `hi2`, Font Awesome `fa`, Simple Icons `si`)
- **Blog CMS**: Supabase (PostgreSQL) — bilingual content (English + Arabic)
- **Markdown**: react-markdown + rehype-highlight + rehype-raw + remark-gfm
- **Analytics**: Google Analytics 4 (via `NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- **Forms**: Netlify Forms (contact form)
- **Deployment**: Netlify with `@netlify/plugin-nextjs`
- **Node**: 20 (set in `netlify.toml`)
- **Package manager**: npm

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server locally
npm run lint     # Run Next.js linter
```

## Deployment (Netlify)

Deploys automatically on push. Netlify config is in `netlify.toml`:

- Build command: `npm run build`, publish dir: `.next`
- Uses `@netlify/plugin-nextjs` for SSR/ISR support
- Redirects: `abo-elmakarem.netlify.app` and `www.aboelmakarem.pro` both 301 to `aboelmakarem.pro`
- Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, XSS Protection, Referrer-Policy, Permissions-Policy
- Static assets cached with `max-age=31536000, immutable`
- OG image route (`/api/og`) has `no-cache` headers
- Contact form uses Netlify Forms via `public/__forms.html` as the form endpoint

### Netlify CLI

```bash
netlify status       # Check linked site
netlify deploy       # Deploy preview
netlify deploy --prod  # Production deploy
```

## Environment Variables

Defined in `.env.example`, required in Netlify env settings:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public, read-only) |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side, bypasses RLS) |
| `REVALIDATE_SECRET` | Secret for ISR revalidation webhook (`/api/revalidate`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID |

## Architecture

### File Structure

```
app/
  layout.tsx           # Root layout: fonts, metadata, JSON-LD, analytics, click effect
  page.tsx             # Homepage: Hero, About, Experience, Projects, Testimonials, RecentPosts, FAQ, Contact, Footer
  fonts.ts             # Google Fonts: Space Grotesk, Syne, Cairo, IBM Plex Sans Arabic
  globals.css          # Tailwind + custom utilities (glass, glow, gradient-text, blog-content, RTL)
  robots.ts            # robots.txt generation
  sitemap.ts           # Dynamic sitemap (static pages + blog posts from Supabase)
  opengraph-image.tsx  # Default OG image (Edge runtime)
  feed.xml/route.ts    # RSS feed (bilingual, revalidates hourly)
  privacy/page.tsx     # Privacy policy (static)
  refund/page.tsx      # Refund policy (static)
  contact-info/        # Standalone contact page with ContactList
  blog/
    layout.tsx         # Blog layout: LanguageProvider, BlogHeader, BlogSidebar
    page.tsx           # Blog listing page (server metadata + BlogPageClient)
    BlogPageClient.tsx # Client-side blog listing with search, pagination, category filter
    [slug]/
      page.tsx         # Blog post SSG with generateStaticParams, dynamic metadata, ArticleJsonLd
      BlogPostClient.tsx  # Client-side post view with language toggle
  api/
    og/route.tsx       # Dynamic OG images for blog posts (Edge, supports Arabic font)
    revalidate/route.ts  # ISR revalidation endpoint (POST + GET, secret-protected)
    newsletter/
      subscribe/route.ts    # Newsletter subscription (Supabase newsletter_subscribers table)
      unsubscribe/route.ts  # Newsletter unsubscribe (GET with rendered HTML page)

components/
  Navbar.tsx           # Fixed navbar with scroll-aware glass effect, mobile menu
  Hero.tsx             # Typewriter effect, orbiting tech icons, profile image, CTAs
  About.tsx            # About section
  Experience.tsx       # Work experience timeline
  Projects.tsx         # Project showcase cards
  Testimonials.tsx     # Client testimonials
  RecentPosts.tsx      # Recent blog posts on homepage (server component)
  RecentPostsClient.tsx  # Client wrapper for recent posts
  FAQ.tsx              # FAQ accordion
  Contact.tsx          # Contact form (Netlify Forms) + contact info cards
  Footer.tsx           # Site footer
  Newsletter.tsx       # Newsletter subscription widget (bilingual)
  ClickEffect.tsx      # Global click animation (radiating lines)
  Analytics.tsx        # Google Analytics component + trackEvent helper
  JsonLd.tsx           # Structured data: Person, Website, Organization, ProfessionalService, FAQ, Breadcrumb
  SimplePageHeader.tsx # Minimal header for standalone pages (privacy, refund, contact-info)
  blog/
    index.ts           # Barrel exports
    BlogCard.tsx       # Blog post card component
    BlogContent.tsx    # Markdown renderer for blog posts
    BlogHeader.tsx     # Blog-specific header/nav
    BlogSidebar.tsx    # Sidebar: categories, recent posts, newsletter
    LanguageToggle.tsx # EN/AR language switcher
    ArticleJsonLd.tsx  # Article structured data for blog posts

lib/
  supabase.ts          # Supabase client (anon + service role)
  blog.ts              # Blog data functions: getPosts, getPostBySlug, getRelatedPosts, getAllPosts, getCategories, getRecentPosts, searchPosts, localizePost, formatDate
  types.ts             # TypeScript types: Post, Category, Tag, LocalizedPost, PaginatedPosts, Language
  LanguageContext.tsx   # React context for EN/AR language switching (URL param + localStorage)

supabase/
  schema.sql           # Database schema: posts, categories, tags tables with RLS policies, full-text search triggers

public/
  profile.jpg          # Profile photo
  cursor.png           # Custom cursor
  favicon.ico + sizes  # Favicons (16, 32, 192, 512, apple-touch-icon)
  site.webmanifest     # PWA manifest
  __forms.html         # Netlify Forms endpoint
  googled734ad4fba8fc2ac.html  # Google Search Console verification
  aboelmakarem2026indexnowkey.txt  # IndexNow key
```

### Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`).

## Supabase Integration

### Database Tables

**posts** — Bilingual blog posts:
- Dual content fields: `title_en`/`title_ar`, `content_en`/`content_ar`, `excerpt_en`/`excerpt_ar`, `meta_description_en`/`meta_description_ar`
- Post types: `news`, `how-to`, `tutorial`, `analysis`, `tool-review`, `insights`, `trending`
- Status: `draft`, `published`, `archived`
- SEO fields: `seo_keywords`, `trending_keywords`
- Source tracking: `source_url`, `source_title`
- Full-text search vectors: `search_vector_en`, `search_vector_ar` (auto-updated via trigger)

**categories** — Bilingual categories (`name_en`/`name_ar`, `slug`, `color`)

**tags** — Bilingual tags (`name_en`/`name_ar`, `slug`)

**newsletter_subscribers** — Email subscriptions (`email`, `language`, `status`, `source`)

### RLS Policies
- Public can read published posts, all categories, and all tags
- Service role has full access (for the blog agent / admin)
- Newsletter operations use service role client

### Data Flow
- Blog listing and post pages fetch from Supabase client-side via `lib/blog.ts`
- Blog posts are statically generated at build time via `generateStaticParams`
- ISR revalidation via `/api/revalidate?secret=XXX&path=/blog`
- RSS feed (`/feed.xml`) revalidates every hour
- Sitemap includes all published posts (both `?lang=en` and `?lang=ar` variants)

## Bilingual (EN/AR) Support

The blog is fully bilingual:
- `LanguageContext` provides `language`, `setLanguage`, `t()` helper, and `dir` (ltr/rtl)
- Language is stored in URL `?lang=ar` param and `localStorage`
- RTL CSS rules in `globals.css` handle Arabic layout (blockquote borders, list padding, font swaps)
- Arabic fonts: Cairo (display) + IBM Plex Sans Arabic (body) via CSS variables `--font-display-ar` and `--font-body-ar`
- English fonts: Syne (display) + Space Grotesk (body) via `--font-display` and `--font-body`
- OG images support Arabic with Noto Sans Arabic font loaded dynamically

## Design System

### Colors (defined in `tailwind.config.js` and CSS variables)
- `background`: `#0a0a0a` (near black)
- `surface`: `#111111` (dark gray)
- `card`: `#1a1a1a` (slightly lighter)
- `primary`: `#6366f1` (indigo)
- `accent`: `#8b5cf6` (purple)
- `muted`: `#a1a1aa` (gray text)

### CSS Utilities (globals.css)
- `.gradient-text` — Indigo-to-purple-to-pink gradient text
- `.glass` — Glassmorphism (backdrop blur + border)
- `.glow` / `.glow-text` — Primary/accent glow effects
- `.noise` — SVG noise texture overlay (applied to body)
- `.animated-gradient` — Slow-moving gradient background
- `.card-hover` — Lift + scale + shadow on hover
- `.float` / `.orbit` — Floating and orbiting animations
- `.blog-content` — Full markdown styling (headings, code, blockquotes, tables, lists)
- `.tech-badge` — Gradient border badge for tech stack items
- `.section-divider` — Gradient horizontal rule
- Custom cursor: `/cursor.png` applied globally

### Animations (Tailwind + CSS)
- `float`, `float-delayed` — Vertical floating
- `glow` — Pulsing box-shadow
- `gradient` — Background position animation
- `spin-slow` — 20s rotation
- `pulse-glow` — Opacity pulsing
- `orbit` / `orbit-lg` — Circular orbit (responsive radius)
- `radiate` — Click effect lines

## SEO

Heavily optimized for search:
- JSON-LD structured data: Person, Website, Organization, ProfessionalService, FAQPage, BreadcrumbList, Article
- Dynamic OG images for blog posts (Edge-rendered with Arabic support)
- Static OG image for homepage
- Google Search Console verified (`googled734ad4fba8fc2ac.html` + meta verification)
- IndexNow key for instant indexing
- Dynamic sitemap with blog posts (EN + AR variants)
- RSS feed at `/feed.xml`
- Canonical URLs and hreflang alternates for all blog pages
- robots.txt disallows `/api/` and `/_next/`
- Twitter card metadata (`@karem_shohud`)

## Google Search Console (gwcli)

Connected to https://aboelmakarem.pro. Use the `gwcli` CLI tool (installed at `~/google-workspace-cli/`) to access Search Console data. **Always use gwcli when checking search performance, indexing status, or sitemaps.**

```bash
# List verified sites
gwcli sc sites

# Search analytics (top queries, pages, countries, devices)
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions query --limit 50
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions page --limit 50
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions date --start 2026-01-01 --end 2026-03-15
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions country
gwcli sc analytics "https://aboelmakarem.pro/" --dimensions device

# Check sitemaps
gwcli sc sitemaps "https://aboelmakarem.pro/"

# Output as JSON for processing
gwcli sc analytics "https://aboelmakarem.pro/" --format json
```

Profile: `karem` (default). Site URL must include trailing slash.

## SEO Skills (Auto-Use)

Claude SEO skills are installed at `~/.claude/skills/seo/`. **Automatically use the appropriate SEO skill when the task involves SEO work on this site:**

| Task | Skill to invoke |
|---|---|
| Full site audit | `/seo audit https://aboelmakarem.pro` |
| Single page analysis | `/seo-page https://aboelmakarem.pro/blog/some-post` |
| Technical SEO (crawl, speed, headers) | `/seo-technical https://aboelmakarem.pro` |
| Content quality / E-E-A-T | `/seo-content` |
| Schema / structured data | `/seo-schema` |
| Sitemap validation | `/seo-sitemap` |
| Image optimization | `/seo-images` |
| Hreflang / international SEO | `/seo-hreflang` |
| AI search optimization (GEO) | `/seo-geo` |
| SEO strategy / planning | `/seo-plan` |
| Programmatic SEO | `/seo-programmatic` |
| Competitor comparison pages | `/seo-competitor-pages` |

### When to auto-trigger SEO tools

- **Any mention of SEO, search ranking, indexing, or traffic** → use the relevant `/seo-*` skill
- **Checking search performance** → use `gwcli sc analytics` first to get real data, then apply SEO skills
- **After publishing new blog posts** → run `gwcli sc sitemaps` to verify sitemap, consider `/seo-page` on the new post
- **After site changes that affect crawling** (robots.txt, redirects, new pages) → run `/seo-technical`
- **Combine gwcli + SEO skills**: Pull real Search Console data with gwcli, then use SEO skills to analyze and recommend improvements based on actual performance data

## Key Patterns

- **Server vs Client**: Pages are server components for metadata; interactive content uses `'use client'` wrapper components (e.g., `BlogPageClient`, `BlogPostClient`)
- **Framer Motion**: All sections use `useInView` with `once: true` for scroll-triggered entrance animations
- **Contact form**: Uses Netlify Forms with honeypot spam protection, submits via fetch to `/__forms.html`
- **Newsletter**: Subscribe/unsubscribe via API routes that write to Supabase `newsletter_subscribers` table
- **Blog search**: Client-side ILIKE search against Supabase (searches title and content columns based on language)
- **Pagination**: 9 posts per page, client-side state management
- **Image optimization**: Next.js Image with AVIF/WebP, remote patterns for GitHub, The Verge, Dev.to, MIT Tech Review, Cloudinary, AWS

## Homepage Sections (in order)

1. **Navbar** — Fixed, glass-on-scroll, mobile hamburger menu
2. **Hero** — Typewriter titles, orbiting tech icons, profile photo with pulse rings, CTAs
3. **About** — Personal bio and skills
4. **Experience** — Work history timeline
5. **Projects** — Project showcase cards
6. **Testimonials** — Client testimonials
7. **Recent Posts** — Latest 3 blog posts (Suspense-wrapped)
8. **FAQ** — Accordion FAQ (also generates FAQPage JSON-LD)
9. **Contact** — Form (Netlify) + contact cards + LinkedIn CTA
10. **Footer** — Links and copyright

## Pages

| Route | Description |
|---|---|
| `/` | Homepage (single-page with hash sections) |
| `/blog` | Blog listing with search, categories, pagination |
| `/blog/[slug]` | Individual blog post (SSG + ISR) |
| `/privacy` | Privacy policy |
| `/refund` | Refund policy |
| `/contact-info` | Standalone contact page |
| `/feed.xml` | RSS feed |
| `/sitemap.xml` | Dynamic sitemap |
| `/api/og` | Dynamic OG image generation |
| `/api/revalidate` | ISR revalidation webhook |
| `/api/newsletter/subscribe` | Newsletter subscribe |
| `/api/newsletter/unsubscribe` | Newsletter unsubscribe |
