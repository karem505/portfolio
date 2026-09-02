# SEO & Indexing Backlog — 2026-09-02

Source: live crawl of all 248 sitemap URLs + Search Console (gwcli) on 2026-09-02, after the scroll-journey redesign deploy. Full evidence in `/tmp/seo-audit-report.md` (session artifact). Items are ordered by impact; each is one commit unless noted. Status legend: `[ ]` todo · `[x]` done · `[~]` partial (see note).

## P1 — indexing correctness

- [x] **B1 Homepage no-scroll render fallback.** Renderers with very tall viewports (Google's) never scroll, so every reveal below the first viewport stays at opacity 0. Add `revealAllImmediately(innerHeight)` (pure, tested): when the viewport is taller than 1600 px, `playOnce` fires as soon as it classifies the trigger. Cap vh-based heights: hero `min-h-screen` → also `max-h-[1100px]`; pinned runway `--span * 100vh` → `min(var(--span) * 100vh, 4200px)`. Files: `lib/journey/reveal.ts`, `lib/journey/reveal.test.ts`, `components/Hero.tsx`, `app/globals.css`.
- [x] **B2 Schema image 404s + entity chaining.** Ship `public/logo.png` (copy of the 512 px favicon). `ArticleJsonLd`: image fallback → `/api/og?title=…&lang=…`; `author` → `{ '@type': 'Person', '@id': '#person', name, url }`; `publisher` → `{ '@id': '#organization' }` + name/logo. `JsonLd.tsx`: drop the dangling `Person.mainEntityOfPage#webpage`; `ProfessionalService.provider` → `{ '@id': '#person' }`. Files: `public/logo.png`, `components/blog/ArticleJsonLd.tsx`, `components/JsonLd.tsx`.
- [x] **B3 Blog posts server-rendered per language.** `app/blog/[slug]/page.tsx` reads `searchParams.lang` (route is already dynamic because `generateMetadata` does), renders ONE `ArticleJsonLd` in that language, localized BreadcrumbList, wraps the article in `<div lang dir>`, and mounts a scoped `<LanguageProvider initialLanguage>` so the SSR HTML is Arabic at `?lang=ar`. `LanguageProvider` gains `initialLanguage`; a nested provider mirrors its parent's later changes (toggle in `BlogHeader` keeps working) and delegates `setLanguage` to it. Remove the client `ArticleJsonLd` from `BlogPostClient`. Files: `lib/LanguageContext.tsx`, `app/blog/[slug]/page.tsx`, `app/blog/[slug]/BlogPostClient.tsx`.
- [x] **B4 Web manifest.** Replace the pre-CV description and the unverifiable "70%" claim; `theme_color` → `#ff3b1f`, `background_color` → `#0c0a09`. File: `public/site.webmanifest`.

## P2 — internal linking, content signals, crawl hygiene

- [x] **B5 Cornerstone posts pinned into service clusters.** `getServiceClusterPosts(postTypes, limit, pinSlugs)` puts the pinned slugs first. `/ai-training` pins `train-employees-executives-ai-accelerate-work`; `/digital-transformation` pins `digital-transformation-roadmap-sme-egypt-gulf`. Files: `lib/blog.ts`, `app/ai-training/page.tsx`, `app/digital-transformation/page.tsx`.
- [x] **B6 Homepage FAQ: two service Q&As** (EN + AR) that link to `/ai-training` and `/digital-transformation` with the personal, independent framing and no prices; mirrored in `FAQPageJsonLd`. Files: `components/FAQ.tsx`, `components/JsonLd.tsx`.
- [x] **B7 Author box on posts** (EN/AR) linking to `/` and LinkedIn, placed after the article body. File: `app/blog/[slug]/BlogPostClient.tsx`.
- [x] **B8 `/blog` server-rendered h1 + hidden nav hygiene.** Move the page intro (h1 + lead) out of the `useSearchParams` Suspense boundary so it is in the SSR HTML; filter the hidden SEO nav to indexable posts only; drop the `ar` alternate on `/blog` (it canonicalizes to `/blog`). Files: `app/blog/BlogPageClient.tsx`, `app/blog/page.tsx`.
- [x] **B9 Sitemap `lastmod`.** Static pages get real dates (`STATIC_LASTMOD` map; `/blog` = newest post `updated_at`) instead of `new Date()`. File: `app/sitemap.ts`.
- [x] **B10 No `?lang=en` links.** `postPath(slug, lang)` (tested) appends `?lang=ar` only; used by `BlogCard`, `BlogSidebar`, `BlogPostClient` share URL. Files: `lib/postPath.ts`, `lib/postPath.test.ts`, `components/blog/BlogCard.tsx`, `components/blog/BlogSidebar.tsx`, `app/blog/[slug]/BlogPostClient.tsx`.
- [x] **B11 Real inlinks for AR URLs.** Footer gets an "English · العربية" pair (`/` and `/?lang=ar`) and, in AR mode, its service/app links carry `?lang=ar`. File: `components/Footer.tsx`.

## P3 — snippets, caching, motion parity, GEO, CWV

- [x] **B12 Metadata hygiene.** Homepage description ≤160 chars (keep the Arabic name); blog title template → `%s | Abo-Elmakarem Shohoud`; `/apps`, `/apps/pharmacy-manual`, `/ai-training?lang=ar` descriptions ≤160; per-page `openGraph.url` on `/contact-info`, `/privacy`, `/refund`. Files: `app/layout.tsx`, `app/blog/layout.tsx`, `app/apps/page.tsx`, `app/apps/pharmacy-manual/page.tsx`, `app/ai-training/page.tsx`, `app/contact-info/page.tsx`, `app/privacy/page.tsx`, `app/refund/page.tsx`.
- [x] **B13 `/api/og` single cache policy.** `Cache-Control: public, max-age=86400, s-maxage=86400` (Netlify header + route header agree). Files: `netlify.toml`, `app/api/og/route.tsx`.
- [x] **B14 Subpage intros gated on `html.motion`.** Replace Framer `initial={{opacity:0}}` intros in `SimplePageHeader`, `BlogHeader`, `BlogPageClient`, `BlogPostClient`, `BlogCard`, `BlogSidebar` with CSS keyframes keyed off `html.motion`, so no SSR HTML carries inline `opacity:0`. Files: those components, `app/globals.css`.
- [x] **B15 llms.txt + RSS.** Bump `Last updated`, add the Wikidata QID and WhatsApp channel, one citable line per product; RSS `content:encoded` carries the full English article as HTML. Files: `public/llms.txt`, `app/feed.xml/route.ts`.
- [x] **B16 Hero: one `fetchpriority=high` image** (poster keeps priority; portrait drops it). File: `components/Hero.tsx`.
- [x] **B17 Duplicate h1 in 7 posts.** `stripLeadingHeading(markdown, title)` (tested) removes a leading `# Title` that repeats the post title before rendering. Files: `lib/stripLeadingHeading.ts`, `lib/stripLeadingHeading.test.ts`, `app/blog/[slug]/BlogPostClient.tsx`.
- [x] **B18 Docs.** CLAUDE.md: blog SSR per language, `/logo.png`, sitemap lastmod map, FAQ service entries.

## Ship & verify

- [x] **B19 Deploy** (push `master`), then owner actions: resubmit sitemap, request indexing (`/`, `/apps`, `/blog`, both cornerstone posts, newest post), IndexNow for the same set.
- [x] **B20 Review.** Re-run the crawl checks on production (AR post raw HTML, tall-viewport opacity count, schema image URLs, `/blog` h1, sitemap lastmod, manifest, og cache header, `?lang=en` absence, cornerstone inlinks, FAQ count), Lighthouse mobile/desktop on `/` and a post, and Search Console URL inspection for the key URLs. Record results below.

## Results (production, 2026-09-03 00:00–00:20 EET, commits a647ee6…9e3fa5e)

Verification scripts: `/tmp/harness/prod-verify.sh` (raw-HTML checks), `/tmp/harness/local-verify.mjs` + `contact-debug.mjs` (Playwright as Googlebot), Lighthouse 12.8.2, `gsc-full.mjs` (URL Inspection API).

| Item | Before | After (production) |
|---|---|---|
| B3 AR post raw HTML | `lang=en`, English h1, 589 Arabic chars, 2 × BlogPosting (`inLanguage: en`) | `<div lang="ar" dir="rtl">`, Arabic h1, 6,184 Arabic chars, 1 × BlogPosting `inLanguage: ar`, Arabic breadcrumbs |
| B1 tall no-scroll render (1280×9000 / 412×9000) | 62 opacity-0 text blocks, page 24,629 px | 0 hidden, page 13,095 / 22,309 px; normal 1280×800 scrolled: 0 hidden |
| B2 schema images | `/logo.png` 404 (site-wide + 234 posts), `/og-blog.png` 404 (30 URLs) | `/logo.png` 200; 0 `og-blog.png` references; author/publisher chained to `#person` / `#organization`; `#webpage` dangling ref gone |
| B4 manifest | "AI Automation Expert… cut costs by 70%", `#6366f1` | CV positioning, no invented numbers, `#ff3b1f` / `#0c0a09` |
| B5 cornerstone inlinks | 0 internal links to either cornerstone post | `/ai-training` → train post, `/digital-transformation` → roadmap post |
| B6 homepage FAQ | 6 recruiter Q&As, no service links | 8 Q&As (DOM = FAQPage JSON-LD), 6 links into the service pages |
| B8 `/blog` | no raw h1; hidden nav 420 links (186 to noindex posts); `ar` alternate → canonical `/blog` | raw `<h1>Blog</h1>`; 234 links (indexable only); 0 hreflang |
| B9 sitemap lastmod | 14 static URLs = build time, hourly | real per-page dates (2026-04-29 … 2026-09-02); 248 URLs |
| B10 `?lang=en` links | 4 URLs emitted them | 0 on posts |
| B11 AR inlinks | `/?lang=ar` 0 inlinks | footer English/العربية on every page; AR pages link AR service/app variants |
| B12 metadata | homepage description 265 chars; legal pages og:url = homepage | 158 chars; per-page og:url on contact/privacy/refund; blog titles without " \| Blog" |
| B13 `/api/og` Cache-Control | `public,immutable,…,no-cache,no-store,must-revalidate` | `public,max-age=86400,s-maxage=86400` |
| B14 inline `opacity:0` | on every subpage header + post | 0 on `/`, `/blog`, posts, `/privacy`, `/contact-info`, `/ai-training`, `/apps`; Framer removed from all routes except none (blog route no longer bundles it) |
| B15 feed / llms.txt | 600-char excerpts; llms.txt dated 2026-06-01 | 30 items with full article HTML (first item 9,094 chars, 311 KB, well-formed); llms.txt 2026-09-02 with Wikidata Q139799493 and WhatsApp |
| B16 hero priority | 2 × `fetchpriority=high` | 1 (poster only) |
| B17 duplicate h1 | 7 posts with 2 h1 | sample post: 1 h1 |
| Homepage SSR parity | h1 2 · h2 10 · h3 33 · JSON-LD 12 · links 64 | h1 2 · h2 10 · h3 33 · JSON-LD 12 · links 68 |
| Bundle | `/blog` First Load JS 299 kB | 260 kB (`/blog/[slug]` 267 kB) |

**Lighthouse (machine load average 14–37 during the runs, so mobile TBT is inflated; quiet-machine mobile was 82 before this batch):** home mobile 67 (LCP 3.0 s, TBT 1,270 ms, CLS 0), home desktop 99 (LCP 0.7 s), post mobile 68 (TBT 2,220 ms), post desktop 100; SEO 100 on all four, best-practices 100, a11y 96 (home) / 87–88 (post, pre-existing contrast/label flags).

**Owner actions (2026-09-02 21:14 UTC):** sitemap resubmitted (GSC record went from Jun 20 / 126 URLs to now / 248 URLs); Indexing API requests for `/`, `/apps`, `/blog`, both service pages, both cornerstone posts, the newest post; IndexNow batch of 17 URLs accepted (HTTP 200). `/apps` already moved from "URL is unknown to Google" to "Discovered - currently not indexed" (sitemap referenced). The DT cornerstone is still "Crawled - currently not indexed" (last crawl Jul 16) pending recrawl; recheck in 1–2 weeks with `gwcli sc inspect`.

**Not done / follow-ups:** `Organization.url` still points at the personal site (Ailigent's real URL needs owner confirmation); `<html lang>` stays `en` on AR URLs (compensated by `lang`/`dir` on `<main>`/article); the 7 posts' leading `# Title` lines remain in Supabase (stripped at render time); re-measure mobile Lighthouse on a quiet machine.
