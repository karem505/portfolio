# Pharmacy Manual — App Download Page (Design Spec)

**Date:** 2026-06-20
**Author:** Karem (Abo-Elmakarem Shohoud) + Claude
**Status:** Approved — ready for implementation planning

## 1. Goal

Add a store-style **download page** for Karem's Android app **Pharmacy Manual** (Arabic
**دليل الأدوية الإكلينيكي**) to the portfolio site (`aboelmakarem.pro`), and surface the app as a
project on the homepage. The page must:

- Present the app in an app-store-like layout, fully mobile responsive.
- Offer a **download button that always points to the latest available APK version**, resolved
  dynamically (no manual version bump, no website redeploy required).
- Match the site's existing **blueprint aesthetic** (warm-dark palette, mono + Rubik type, hard
  edges, signal-red accent) — not a glossy Play Store clone.
- Be bilingual (EN default + `?lang=ar`), server-rendered, and fully SEO/GEO-optimized.

## 2. Source facts (do not drift from these)

### App
- **Name:** Pharmacy Manual / **دليل الأدوية الإكلينيكي** (short Arabic name: دليل الأدوية).
- **What it is:** Arabic-first, **offline** Egyptian drug index + price checker for Android.
- **Latest version at spec time:** `v0.2.2` (~62 MB), **release-signed** (no longer debug key).
- **Min OS:** Android 5.0+.
- **Features:** bilingual diacritic-insensitive search across **24,868+ medicines** (Arabic alias,
  English name, active ingredient); drug detail with cheapest **same-ingredient price comparison**;
  browse by **drug class, manufacturer, route**; light + dark themes, Arabic-first RTL; embedded DB
  that self-updates from GitHub when source data changes; fully offline after install.
- **Changelog:** 0.2.2 (release-key signing; one-time uninstall of older debug build), 0.2.1
  (fixes "check for updates" — INTERNET permission), 0.2.0 ("Clinical Field Guide" redesign, branded
  icon + Arabic name, browse by class/manufacturer/route, drug-detail price checker).
- **Integrity:** APK SHA-256 `da03c38b3690324f439833cb121d4900181a91827ab1065e0d9afbeb82df0181`;
  signing cert SHA-256 `98a8ac45aa15f1c068ff8c7a6602592b0472be353bfb22158c43dd53f05b9403`.
  (These two are version-specific; the page surfaces the SHA-256 of the **currently resolved** build
  where feasible, falling back to a static note that hashes are published in the repo README.)
- **Data:** released CC0 from `egyptian-drug-database`
  (https://github.com/karem505/egyptian-drug-database). App source is in a separate private repo.
- **Disclaimer:** information only — always verify with the Egyptian Drug Authority and a licensed
  pharmacist before clinical use.

### Repo (download source)
- `https://github.com/karem505/pharmacy-manual-apk`, default branch `main`.
- **No GitHub Releases.** APKs are committed as raw files at repo root:
  `pharmacy-manual-v0.2.1.apk`, `pharmacy-manual-v0.2.2.apk`, …
- Screenshots live in `screenshots/` (`01-search.jpg` … `06-…jpg`, `app-icon.png`, `demo.mp4`).
- **This repo is separate from the website repo** → pushing a new APK does **not** rebuild the site.

### Local assets
`/home/karem/side projects/drug manual/screen shots for the website/`:
6 screenshots (1272×2800 JPEG, ~0.35–0.56 MB each), `app_icon_foreground.png` (512×512), and a
demo screen recording `Record_*.mp4` (~15 MB).

### Design system (from `tailwind.config.js` + `globals.css`)
- Colors: `ink #0c0a09` (bg), `slate #141211` (surface), `graphite #1c1917` (card),
  `wire #2a2522` (borders), `paper #f5f1ea` (emphasis text), `ash #a09690` (body),
  `signal #ff3b1f` (THE accent), `signal-deep #c92a10` (hover), `moss #2f9e44` (status dot only).
- Type: mono (JetBrains Mono) for EN, `font-rubik` for AR. Hard edges (≤2px radius). No pills.
- Utilities: `.tab-eyebrow`, `.tag-chip`, `.section-divider`, framed cards via `.glass`/`.card`.
- Existing page conventions: numbered eyebrows (`004 · …`), `t(en, ar)` helper, server-rendered
  `?lang=ar`, `generateMetadata` with `alternates.languages`, JSON-LD components.

## 3. Decisions (locked with user)

| Decision | Choice |
|---|---|
| Layout | **Split hero** (icon + identity + CTA on one side, floating phone screenshot on the other) |
| Route | **`/apps/pharmacy-manual`** (+ `?lang=ar`) |
| Homepage placement | **Lead "notable build"** card (keeps "Three production SaaS" flagship framing) |
| Demo video | **Include**, strictly lazy click-to-play (poster + overlay, no autoplay/preload) |
| Verify block | **Keep**, in a collapsible section |
| Ratings schema | **Omit** `aggregateRating` (no real ratings — do not fabricate) |

## 4. Dynamic latest-version resolution

Because the APK repo is separate and uses raw files (not Releases), the latest version is resolved
**at request time, cached via ISR** — not baked in at build.

- **`lib/latestApk.ts`** → `getLatestApk()`:
  - `fetch('https://api.github.com/repos/karem505/pharmacy-manual-apk/contents/', { next: { revalidate: 3600 }, headers: { Accept: 'application/vnd.github+json' } })`.
  - Filter entries ending in `.apk`, parse semver from `pharmacy-manual-vX.Y.Z.apk`, pick the
    highest by numeric (major, minor, patch) comparison.
  - Return `{ version, fileName, sizeBytes, sizeLabel, downloadUrl }` where `downloadUrl` is the
    `https://github.com/karem505/pharmacy-manual-apk/raw/main/<fileName>` form.
  - **Fallback:** on any error / rate-limit / empty result, return a hard-coded known-good
    (`v0.2.2`, ~62 MB, its raw URL) so the button never breaks.
  - Rate-limit safety: server-side + `revalidate: 3600` ⇒ ≤ ~24 calls/day from the Netlify IP, far
    under GitHub's 60/hr unauthenticated limit.
- **`app/api/download/pharmacy-manual/route.ts`** → calls `getLatestApk()`, issues a **302 redirect**
  to `downloadUrl`. Stable, shareable URL (`/api/download/pharmacy-manual`) that always serves the
  newest APK even if page HTML is briefly stale. `export const revalidate = 3600` / `dynamic` as
  needed so it re-resolves.
- The page is a **Server Component** with `export const revalidate = 3600`; it calls `getLatestApk()`
  to render the visible version + size label, and the download button links to
  `/api/download/pharmacy-manual`.

## 5. Page structure (`/apps/pharmacy-manual`)

Reuses shared `Navbar` and `Footer`. Server-rendered; one thin client island
(`PharmacyManualClient.tsx`) for: screenshot lightbox/scroll, lazy click-to-play video, and
copy-to-clipboard on the SHA blocks.

1. **Hero (split)** — eyebrow `005 · ANDROID APP`; app icon; name (EN + AR); one-line tagline;
   signal-red CTA `↓ DOWNLOAD v{version} · {size}` → `/api/download/pharmacy-manual`; meta line
   (Android 5.0+ · Free · No ads · Offline); trust line (release-signed · SHA-256 verified ✓);
   secondary links (GitHub repo, data source). Floating first phone screenshot in a thin device frame.
2. **Stat band** — `24,868+ medicines` · bilingual search · same-ingredient price comparison ·
   works offline (bordered mono cells).
3. **Screenshot gallery** — device-framed responsive grid; horizontal scroll-snap on mobile; each
   image has descriptive bilingual `alt` + caption.
4. **Features** — bordered cells: diacritic-insensitive bilingual search; cheapest same-ingredient
   price comparison; browse by class / manufacturer / route; light + dark RTL; self-updating DB;
   fully offline.
5. **What's new** — changelog 0.2.2 / 0.2.1 / 0.2.0.
6. **Install steps** — numbered: download → enable "install from unknown sources" → open the APK →
   (if an older build is installed, uninstall it first — signing key changed). Works on Android 5.0+.
7. **Verify download** (collapsible) — APK SHA-256 + signing-cert SHA-256 in copyable mono blocks,
   with the `sha256sum` / `apksigner` commands.
8. **Demo video** — lazy click-to-play (poster image + play overlay; `<video preload="none">` only
   mounts on click) to protect LCP/CWV.
9. **FAQ** — bilingual: is it safe? is it free? does it need internet? which Android versions? why
   "unknown sources"? where does the drug data come from? is it on the Play Store? → feeds FAQ schema.
10. **Disclaimer + data source** — CC0 `egyptian-drug-database` credit + "information only, verify
    with the Egyptian Drug Authority and a pharmacist."
11. **Closing CTA** (download again + back to portfolio) + Footer.

## 6. Assets pipeline

- Resize + re-encode the 6 local screenshots into `public/apps/pharmacy-manual/` (target width
  ~720–824px, optimized JPEG/WebP source for `next/image`), served via `next/image` (AVIF/WebP,
  lazy, responsive) with descriptive bilingual alt text.
- App icon: use the repo's branded `app-icon.png` (optimized) → `public/apps/pharmacy-manual/icon.png`.
- Demo video: compress with `ffmpeg` if available (cap ~3–6 MB, 720p); else host as-is with a
  generated poster frame. `preload="none"`, mounted only on click.

## 7. Bilingual (EN / AR)

- Server-rendered EN default + distinct `?lang=ar` HTML, mirroring the service-page pattern
  (`searchParams.lang === 'ar'`, `t(en, ar)` helper). Arabic content is first-class (the app is
  Arabic-first). AR uses `font-rubik` and `dir="rtl"`.

## 8. SEO / GEO

- **`generateMetadata({ searchParams })`**: bilingual title/description; `alternates.canonical`;
  `alternates.languages` = `{ 'en-US': BASE, 'ar-EG': BASE+'?lang=ar', 'x-default': BASE }`;
  OpenGraph + Twitter; dynamic OG image via `/api/og` (app name + "Android App").
- **JSON-LD** (added to `components/JsonLd.tsx`):
  - **`MobileApplication`** (subtype of SoftwareApplication): `name`, `alternateName` (Arabic),
    `operatingSystem: "Android"`, `applicationCategory: "MedicalApplication"`,
    `softwareVersion` (resolved), `fileSize`, `downloadUrl`, `installUrl`, `datePublished` /
    `dateModified`, free `offers` (`price: "0"`, `priceCurrency`, `availability: InStock`),
    `screenshot[]`, `author`/`creator` = Person (Abo-Elmakarem Shohoud), `publisher`,
    `inLanguage: ["ar","en"]`, `featureList`. **No `aggregateRating`.**
  - **BreadcrumbList**: Home → Pharmacy Manual.
  - **FAQPage**: from the FAQ section (reuse `ServiceFaqJsonLd`).
- **Sitemap** (`app/sitemap.ts`): add `/apps/pharmacy-manual` + `/apps/pharmacy-manual?lang=ar`
  (priority ~0.8, monthly).
- **llms.txt** (`public/llms.txt`): add a "Projects / Apps" entry for Pharmacy Manual with citable
  facts (offline Egyptian drug index, 24,868+ medicines, Android, free).
- **Internal linking**: homepage project card → `/apps/pharmacy-manual`; page links back to
  homepage/projects and to the GitHub repo.
- **robots**: page lives under `/apps/` (crawlable). The `/api/download/...` redirect is under
  `/api/` (disallowed for crawl) — fine, it's a download endpoint, not an indexable page.
- **Post-deploy ops** (routed through the `seo` subagent per CLAUDE.md): GSC `request-indexing` for
  both URLs → IndexNow submit → verify/submit sitemap → `/seo-page` audit on the new URL →
  validate JSON-LD.

## 9. Homepage project card (`components/Projects.tsx`)

Add **Pharmacy Manual** as the **first** entry in `notableBuilds`:
- `title: 'Pharmacy Manual'`
- bilingual `tagline` / `description` / `result` via `t(...)`
- `tech: ['Android', 'Offline-first', 'Bilingual', 'RTL']` — only externally-verifiable labels; the
  app's internal language/DB stack is in a private repo, so do **not** fabricate it.
- `icon`: `FaBookMedical` from `react-icons/fa` (a medical manual), fallback `FaPills`.
- `link: '/apps/pharmacy-manual'` (internal), `github: 'https://github.com/karem505/pharmacy-manual-apk'`
- Flagship "Three production SaaS" heading and 3-column layout stay unchanged.

## 10. Files

**New**
- `app/apps/pharmacy-manual/page.tsx` — server component, metadata, schema, content, version resolve.
- `app/apps/pharmacy-manual/PharmacyManualClient.tsx` — thin client island (gallery / video / copy).
- `lib/latestApk.ts` — `getLatestApk()` + fallback.
- `app/api/download/pharmacy-manual/route.ts` — 302 redirect to latest APK.
- `public/apps/pharmacy-manual/` — optimized icon, screenshots, (compressed) demo video + poster.

**Modified**
- `components/JsonLd.tsx` — `MobileApplication` + breadcrumb JSON-LD exports.
- `components/Projects.tsx` — lead notable-build card.
- `app/sitemap.ts` — EN + AR entries.
- `public/llms.txt` — app entry.
- `CLAUDE.md` — document the new route + the dynamic-download mechanism.

## 11. Verification / acceptance

- `npm run build` passes (typecheck + build clean).
- `npm run dev`: `/apps/pharmacy-manual` and `?lang=ar` render; resolved version shows `v0.2.2 · ~62 MB`.
- Download button → `/api/download/pharmacy-manual` → 302 → the v0.2.2 raw APK.
- Responsive and correct at 375 / 768 / 1280px; RTL correct in `?lang=ar`; no console errors.
- JSON-LD validates (MobileApplication + BreadcrumbList + FAQPage); OG image renders.
- Mobile + desktop screenshots captured to confirm "fully mobile responsive."
- Homepage shows the new project card linking to the page.

## 12. Out of scope

- Google Play / F-Droid listing (this is a direct-sideload APK page).
- iOS build. Real user ratings / review system. In-app analytics.
- Changing the flagship projects or the "Three production SaaS" framing.
