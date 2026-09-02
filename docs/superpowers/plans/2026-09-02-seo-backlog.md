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

- [ ] **B19 Deploy** (push `master`), then owner actions: resubmit sitemap, request indexing (`/`, `/apps`, `/blog`, both cornerstone posts, newest post), IndexNow for the same set.
- [ ] **B20 Review.** Re-run the crawl checks on production (AR post raw HTML, tall-viewport opacity count, schema image URLs, `/blog` h1, sitemap lastmod, manifest, og cache header, `?lang=en` absence, cornerstone inlinks, FAQ count), Lighthouse mobile/desktop on `/` and a post, and Search Console URL inspection for the key URLs. Record results below.

## Results

(filled in at B20)
