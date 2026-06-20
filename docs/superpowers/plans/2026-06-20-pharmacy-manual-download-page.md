# Pharmacy Manual Download Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a store-style, fully-responsive, bilingual download page for the *Pharmacy Manual* Android app at `/apps/pharmacy-manual`, with a download button that dynamically resolves the latest APK, and surface the app as a homepage project card.

**Architecture:** A server-rendered Next.js App Router page (ISR `revalidate = 3600`) resolves the newest APK from the *separate* GitHub repo's Contents API at request time (no website redeploy needed when a new APK is pushed), with a hard-coded fallback. A stable `/api/download/pharmacy-manual` route 302-redirects to the resolved APK. The page reuses the site's `SimplePageHeader`/`Footer` and blueprint design tokens; interactivity (demo video, copy-hash) lives in one thin client island. SEO is delivered via `MobileApplication` + `FAQPage` + `BreadcrumbList` JSON-LD, sitemap + llms.txt entries, and post-deploy GSC/IndexNow ops.

**Tech Stack:** Next.js 14.2 (App Router, server components, ISR), TypeScript, Tailwind 3.4, `next/image`, `react-icons`, Vitest (new dev-only, for the version-resolution logic), ffmpeg (asset optimization).

## Global Constraints

- **Route:** `/apps/pharmacy-manual` (EN default) + `?lang=ar` (Arabic). Stable download URL: `/api/download/pharmacy-manual`.
- **Design tokens (exact):** bg `ink #0c0a09`, surface `slate #141211`, card `graphite #1c1917`, borders `wire #2a2522`, emphasis text `paper #f5f1ea`, body `ash #a09690`, accent `signal #ff3b1f`, hover `signal-deep #c92a10`. Hard edges (≤2px radius), no pills. EN type = `font-mono`; AR type = `font-rubik` + `dir="rtl"`.
- **Bilingual:** server-rendered per `searchParams.lang === 'ar'`; `t(en, ar)` helper; Arabic content is first-class (the app is Arabic-first).
- **App identity (do not drift):** name **Pharmacy Manual** / **دليل الأدوية الإكلينيكي**; offline Egyptian drug index + price checker for Android; **24,868+** medicines; Android **5.0+**; free, no ads; release-signed; data CC0 from `egyptian-drug-database`; info-only disclaimer (verify with the Egyptian Drug Authority + a pharmacist).
- **Repo:** `https://github.com/karem505/pharmacy-manual-apk`, branch `main`, APKs are raw files `pharmacy-manual-vX.Y.Z.apk` (no Releases). Fallback version `0.2.2`, size 65148247 bytes (62 MB).
- **No fabricated data:** no `aggregateRating`, no invented internal tech stack (app source is private).
- **Identity guard (CLAUDE.md):** never frame Karem as "CEO"/"Co-founder"/"agency". Author = Abo-Elmakarem Shohoud, Full-Stack Developer.
- **Assets hosted locally** under `public/apps/pharmacy-manual/` — so **no** `next.config` image-domain changes are required.
- Verification gate for every code task: `npm run build` must pass.

---

### Task 1: Optimize and place app assets

Produce the optimized icon, screenshots, demo video, and poster under `public/apps/pharmacy-manual/`. `sharp` is not installed; `ffmpeg` (v8) is available and handles image + video.

**Files:**
- Create: `public/apps/pharmacy-manual/icon.png`
- Create: `public/apps/pharmacy-manual/01.jpg` … `06.jpg` (screenshots)
- Create: `public/apps/pharmacy-manual/demo.mp4`
- Create: `public/apps/pharmacy-manual/demo-poster.jpg`

**Interfaces:**
- Produces: image assets at known paths + dimensions consumed by Task 6 (`next/image` needs width/height). Screenshots are all source 1272×2800 → resized to **824×1814**. Icon → **512×512**. Poster dimensions are read in Step 5 and passed to Task 5/6.

- [ ] **Step 1: Create the asset directory**

```bash
cd "/home/karem/side projects/mywebsite"
mkdir -p public/apps/pharmacy-manual
```

- [ ] **Step 2: Fetch and optimize the branded app icon**

```bash
curl -sL "https://raw.githubusercontent.com/karem505/pharmacy-manual-apk/main/screenshots/app-icon.png" -o /tmp/pm-icon-src.png
file /tmp/pm-icon-src.png
# Normalize to 512x512 PNG (icons are square). If `file` reports a non-square source, use scale=512:512 anyway (icon art is square-safe).
ffmpeg -y -i /tmp/pm-icon-src.png -vf "scale=512:512:flags=lanczos" public/apps/pharmacy-manual/icon.png
file public/apps/pharmacy-manual/icon.png   # expect: PNG image data, 512 x 512
```

- [ ] **Step 3: Inspect the 6 local screenshots and map them to display order**

```bash
ls -1 "/home/karem/side projects/drug manual/screen shots for the website/"*.jpg
```

Open each `.jpg` with the Read tool (they are phone screenshots). Assign display order + a content label using this vocabulary (from the app's own README) — match each file to the closest:
1. `01.jpg` — **bilingual search** (search box + medicine results with prices)
2. `02.jpg` — **drug detail with cheaper same-ingredient alternatives**
3. `03.jpg` — **drug detail** (class-coded chip)
4. `04.jpg` — **drug detail** (second example)
5. `05.jpg` — **browse by therapeutic class**
6. `06.jpg` — **browse by manufacturer / route**

If the local set's content differs, reorder so the first image is a *search* screen (it becomes the hero phone). Record the final mapping for Task 6's `alt`/captions.

- [ ] **Step 4: Resize + re-encode each screenshot to 824px wide**

For each chosen source file `SRC` → target `NN.jpg` (repeat for 01–06):

```bash
ffmpeg -y -i "<SRC>" -vf "scale=824:-2:flags=lanczos" -q:v 4 public/apps/pharmacy-manual/01.jpg
# ...repeat for 02.jpg ... 06.jpg
file public/apps/pharmacy-manual/01.jpg   # expect: JPEG ... 824x1814
ls -lh public/apps/pharmacy-manual/*.jpg  # each should be well under ~150 KB
```

All six are 1272×2800 source ⇒ all resize to **824×1814** (use these exact dims in `next/image`).

- [ ] **Step 5: Compress the demo video and generate a poster**

```bash
SRCV="/home/karem/side projects/drug manual/screen shots for the website/Record_2026-06-20-16-51-27_0892d036b04191e9279bcc60c11e9a99.mp4"
# Portrait UI demo: cap to 1280px on the long edge, H.264, no audio, web-streamable.
ffmpeg -y -i "$SRCV" -vf "scale=-2:1280:flags=lanczos" -c:v libx264 -crf 30 -preset slow -an -movflags +faststart public/apps/pharmacy-manual/demo.mp4
# Poster = frame at ~1.5s
ffmpeg -y -ss 00:00:01.5 -i public/apps/pharmacy-manual/demo.mp4 -frames:v 1 -q:v 4 public/apps/pharmacy-manual/demo-poster.jpg
ls -lh public/apps/pharmacy-manual/demo.mp4        # target: roughly 2-6 MB
file public/apps/pharmacy-manual/demo-poster.jpg   # record WxH → POSTER_W x POSTER_H for Task 5/6
```

Record the poster's exact `WIDTH x HEIGHT` (call them `POSTER_W`, `POSTER_H`) — Task 5 passes them to `<DemoVideo>`.

- [ ] **Step 6: Commit the assets**

```bash
git add public/apps/pharmacy-manual/
git commit -m "feat(pharmacy-manual): add optimized app icon, screenshots, demo video + poster"
```

---

### Task 2: Latest-APK resolver (`lib/latestApk.ts`) — TDD with Vitest

Pure, unit-tested version-picking logic + a cached network wrapper with a fallback. This is the only piece with real edge cases (numeric vs lexical semver, ignoring non-APK files), so it gets real tests.

**Files:**
- Create: `lib/latestApk.ts`
- Create: `lib/latestApk.test.ts`
- Modify: `package.json` (add `vitest` dev dep + `test` script)

**Interfaces:**
- Produces (consumed by Tasks 3 & 6):
  - `interface ApkInfo { version: string; fileName: string; sizeBytes: number; sizeLabel: string; downloadUrl: string }`
  - `getLatestApk(): Promise<ApkInfo>`
  - `pickLatestApk(entries: GhEntry[]): ApkInfo | null`
  - `parseApkVersion(name: string): [number, number, number] | null`
  - `formatBytes(bytes: number): string`

- [ ] **Step 1: Add Vitest and a test script**

```bash
cd "/home/karem/side projects/mywebsite"
npm install -D vitest@^2
```

Then edit `package.json` `scripts` to add (keep existing scripts):

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 2: Write the failing test**

Create `lib/latestApk.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { parseApkVersion, pickLatestApk, formatBytes } from './latestApk'

describe('parseApkVersion', () => {
  it('parses a valid apk filename', () => {
    expect(parseApkVersion('pharmacy-manual-v0.2.2.apk')).toEqual([0, 2, 2])
  })
  it('rejects non-apk / mismatched names', () => {
    expect(parseApkVersion('README.md')).toBeNull()
    expect(parseApkVersion('pharmacy-manual-v0.2.apk')).toBeNull()
    expect(parseApkVersion('other-v1.0.0.apk')).toBeNull()
  })
})

describe('pickLatestApk', () => {
  it('picks the highest version numerically (0.2.10 > 0.2.9)', () => {
    const got = pickLatestApk([
      { name: 'README.md', size: 100 },
      { name: 'pharmacy-manual-v0.2.9.apk', size: 10 },
      { name: 'pharmacy-manual-v0.2.10.apk', size: 20 },
      { name: 'pharmacy-manual-v0.2.2.apk', size: 5 },
    ])
    expect(got?.version).toBe('0.2.10')
    expect(got?.fileName).toBe('pharmacy-manual-v0.2.10.apk')
    expect(got?.downloadUrl).toBe(
      'https://github.com/karem505/pharmacy-manual-apk/raw/main/pharmacy-manual-v0.2.10.apk'
    )
  })
  it('returns null when no apk present', () => {
    expect(pickLatestApk([{ name: 'README.md', size: 1 }])).toBeNull()
    expect(pickLatestApk([])).toBeNull()
  })
})

describe('formatBytes', () => {
  it('formats MB and KB', () => {
    expect(formatBytes(65148247)).toBe('62 MB')
    expect(formatBytes(950 * 1024)).toBe('950 KB')
    expect(formatBytes(0)).toBe('—')
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Cannot find module './latestApk'` (or export-not-found).

- [ ] **Step 4: Implement `lib/latestApk.ts`**

```ts
// lib/latestApk.ts
// Resolves the latest Pharmacy Manual APK from the SEPARATE GitHub repo at
// request time, cached via ISR. APKs are committed as raw files on `main`
// (no GitHub Releases), named `pharmacy-manual-vX.Y.Z.apk`.

const REPO = 'karem505/pharmacy-manual-apk'
const CONTENTS_API = `https://api.github.com/repos/${REPO}/contents/`
const RAW_BASE = `https://github.com/${REPO}/raw/main`

export interface ApkInfo {
  version: string // "0.2.2"
  fileName: string // "pharmacy-manual-v0.2.2.apk"
  sizeBytes: number
  sizeLabel: string // "62 MB"
  downloadUrl: string
}

export interface GhEntry {
  name: string
  size: number
  type?: string
}

// Known-good fallback (current build at authoring time) so the button never
// breaks if the GitHub API is unreachable or rate-limited.
const FALLBACK: ApkInfo = {
  version: '0.2.2',
  fileName: 'pharmacy-manual-v0.2.2.apk',
  sizeBytes: 65148247,
  sizeLabel: '62 MB',
  downloadUrl: `${RAW_BASE}/pharmacy-manual-v0.2.2.apk`,
}

const APK_RE = /^pharmacy-manual-v(\d+)\.(\d+)\.(\d+)\.apk$/i

/** Parse a [major, minor, patch] tuple from an APK filename, or null. */
export function parseApkVersion(name: string): [number, number, number] | null {
  const m = APK_RE.exec(name)
  if (!m) return null
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

function cmp(a: [number, number, number], b: [number, number, number]): number {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
}

/** Format a byte count as a compact "62 MB" / "950 KB" label. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${Math.round(mb)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

/** Pick the highest-version APK entry from a GitHub contents listing. */
export function pickLatestApk(entries: GhEntry[]): ApkInfo | null {
  let best: { v: [number, number, number]; e: GhEntry } | null = null
  for (const e of entries) {
    const v = parseApkVersion(e.name)
    if (!v) continue
    if (!best || cmp(v, best.v) > 0) best = { v, e }
  }
  if (!best) return null
  return {
    version: best.v.join('.'),
    fileName: best.e.name,
    sizeBytes: best.e.size,
    sizeLabel: formatBytes(best.e.size),
    downloadUrl: `${RAW_BASE}/${best.e.name}`,
  }
}

/** Resolve the latest APK, cached for an hour. Falls back on any failure. */
export async function getLatestApk(): Promise<ApkInfo> {
  try {
    const res = await fetch(CONTENTS_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return FALLBACK
    const data = (await res.json()) as GhEntry[]
    if (!Array.isArray(data)) return FALLBACK
    return pickLatestApk(data) ?? FALLBACK
  } catch {
    return FALLBACK
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test`
Expected: PASS (all 3 suites green).

- [ ] **Step 6: Commit**

```bash
git add lib/latestApk.ts lib/latestApk.test.ts package.json package-lock.json
git commit -m "feat(pharmacy-manual): add latest-APK resolver with unit tests"
```

---

### Task 3: Stable download redirect route

A stable, shareable URL that always 302-redirects to the newest APK.

**Files:**
- Create: `app/api/download/pharmacy-manual/route.ts`

**Interfaces:**
- Consumes: `getLatestApk()` from `lib/latestApk.ts`.
- Produces: `GET /api/download/pharmacy-manual` → 302 → APK raw URL (linked by Task 6's button).

- [ ] **Step 1: Implement the route**

```ts
// app/api/download/pharmacy-manual/route.ts
import { NextResponse } from 'next/server'
import { getLatestApk } from '@/lib/latestApk'

// Re-resolve at most hourly (matches the resolver's fetch cache).
export const revalidate = 3600

export async function GET() {
  const apk = await getLatestApk()
  return NextResponse.redirect(apk.downloadUrl, 302)
}
```

- [ ] **Step 2: Verify build + redirect behavior**

```bash
npm run build    # expect: compiles; route listed under /api/download/pharmacy-manual
npm run dev &     # start dev server on :3000
sleep 4
curl -sI "http://localhost:3000/api/download/pharmacy-manual" | grep -iE "^(HTTP|location)"
# Expected: HTTP/1.1 302 ... ; location: https://github.com/karem505/pharmacy-manual-apk/raw/main/pharmacy-manual-v0.2.2.apk
kill %1 2>/dev/null
```

- [ ] **Step 3: Commit**

```bash
git add app/api/download/pharmacy-manual/route.ts
git commit -m "feat(pharmacy-manual): add stable /api/download redirect to latest APK"
```

---

### Task 4: `MobileApplication` JSON-LD component

Add the app schema export to the shared JSON-LD module (matches the existing `<script dangerouslySetInnerHTML>` pattern).

**Files:**
- Modify: `components/JsonLd.tsx` (append a new export at end of file)

**Interfaces:**
- Produces: `PharmacyManualAppJsonLd({ ar, version, sizeBytes, downloadUrl, screenshots }: { ar?: boolean; version: string; sizeBytes: number; downloadUrl: string; screenshots: string[] })` — consumed by Task 6.

- [ ] **Step 1: Append the component to `components/JsonLd.tsx`**

```tsx
// ── /apps/pharmacy-manual ────────────────────────────────────────────────────

export function PharmacyManualAppJsonLd({
  ar = false,
  version,
  sizeBytes,
  downloadUrl,
  screenshots,
}: {
  ar?: boolean
  version: string
  sizeBytes: number
  downloadUrl: string
  screenshots: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    '@id': 'https://aboelmakarem.pro/apps/pharmacy-manual#app',
    name: ar ? 'دليل الأدوية الإكلينيكي' : 'Pharmacy Manual',
    alternateName: ar ? 'Pharmacy Manual' : 'دليل الأدوية الإكلينيكي',
    description: ar
      ? 'دليل أدوية مصري يعمل بدون إنترنت ومُدقّق أسعار لأندرويد: بحث ثنائي اللغة عبر أكثر من 24,868 دواءً، ومقارنة أسعار البدائل بنفس المادة الفعّالة، وتصفّح حسب التصنيف والشركة وطريقة الإعطاء.'
      : 'Offline Egyptian drug index and price checker for Android: bilingual search across 24,868+ medicines, cheapest same-ingredient price comparison, and browse by class, manufacturer, and route.',
    applicationCategory: 'MedicalApplication',
    operatingSystem: 'Android 5.0+',
    softwareVersion: version,
    fileSize: `${Math.round(sizeBytes / (1024 * 1024))} MB`,
    downloadUrl,
    installUrl: 'https://aboelmakarem.pro/apps/pharmacy-manual',
    url: 'https://aboelmakarem.pro/apps/pharmacy-manual',
    inLanguage: ['ar', 'en'],
    image: 'https://aboelmakarem.pro/apps/pharmacy-manual/icon.png',
    screenshot: screenshots,
    featureList: ar
      ? [
          'بحث ثنائي اللغة غير حسّاس للتشكيل عبر أكثر من 24,868 دواءً',
          'مقارنة أسعار البدائل بنفس المادة الفعّالة',
          'تصفّح حسب التصنيف الدوائي والشركة وطريقة الإعطاء',
          'وضع فاتح وداكن مع دعم كامل للعربية و RTL',
          'قاعدة بيانات مدمجة تُحدّث نفسها',
          'يعمل بالكامل بدون إنترنت',
        ]
      : [
          'Bilingual, diacritic-insensitive search across 24,868+ medicines',
          'Cheapest same-ingredient price comparison',
          'Browse by drug class, manufacturer, and route',
          'Light and dark themes, Arabic-first RTL',
          'Self-updating embedded database',
          'Works fully offline',
        ],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: { '@id': 'https://aboelmakarem.pro/#person' },
    creator: { '@id': 'https://aboelmakarem.pro/#person' },
    publisher: { '@id': 'https://aboelmakarem.pro/#person' },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit` (or rely on Task 6's `npm run build`)
Expected: no type errors from `components/JsonLd.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/JsonLd.tsx
git commit -m "feat(pharmacy-manual): add MobileApplication JSON-LD"
```

---

### Task 5: Client island (`PharmacyManualClient.tsx`)

Two tiny client components: a lazy click-to-play demo video and a copy-to-clipboard button. Everything else on the page is server-rendered (the collapsible "verify" block uses native `<details>` — no JS).

**Files:**
- Create: `app/apps/pharmacy-manual/PharmacyManualClient.tsx`

**Interfaces:**
- Produces (consumed by Task 6):
  - `DemoVideo({ src, poster, width, height, label }: { src: string; poster: string; width: number; height: number; label: string })`
  - `CopyButton({ value, label }: { value: string; label: string })`

- [ ] **Step 1: Implement the client island**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaPlay, FaCopy, FaCheck } from 'react-icons/fa'

export function DemoVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string
  poster: string
  width: number
  height: number
  label: string
}) {
  const [play, setPlay] = useState(false)

  if (play) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="auto"
        className="w-full h-auto border border-wire bg-ink"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={label}
      className="group relative block w-full border border-wire hover:border-signal transition-colors"
    >
      <Image
        src={poster}
        alt=""
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 380px"
        className="w-full h-auto"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/40 group-hover:bg-ink/25 transition-colors">
        <span className="flex items-center justify-center w-16 h-16 border border-paper bg-ink/70 text-paper group-hover:border-signal group-hover:text-signal transition-colors">
          <FaPlay className="ml-1" />
        </span>
      </span>
    </button>
  )
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          /* clipboard unavailable — no-op */
        }
      }}
      className="inline-flex items-center gap-1.5 text-ash hover:text-signal transition-colors shrink-0"
    >
      {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/apps/pharmacy-manual/PharmacyManualClient.tsx
git commit -m "feat(pharmacy-manual): add lazy demo-video + copy-hash client island"
```

> Note: use the `POSTER_W` / `POSTER_H` recorded in Task 1 Step 5 when Task 6 renders `<DemoVideo>`.

---

### Task 6: The download page (`app/apps/pharmacy-manual/page.tsx`)

The bespoke store page: metadata (bilingual + hreflang), dynamic version resolution, all sections, schema wiring. Reuses `SimplePageHeader` + `Footer` and the design tokens.

**Files:**
- Create: `app/apps/pharmacy-manual/page.tsx`

**Interfaces:**
- Consumes: `getLatestApk()` (Task 2), `PharmacyManualAppJsonLd` + `ServiceFaqJsonLd` + `ServiceBreadcrumbJsonLd` (Task 4 / existing), `DemoVideo` + `CopyButton` (Task 5), `SimplePageHeader` + `Footer` (existing).

- [ ] **Step 1: Implement the page**

Create `app/apps/pharmacy-manual/page.tsx`. Replace `POSTER_W` / `POSTER_H` with the values recorded in Task 1 Step 5.

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FaDownload, FaGithub, FaAndroid, FaShieldAlt } from 'react-icons/fa'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'
import {
  PharmacyManualAppJsonLd,
  ServiceFaqJsonLd,
  ServiceBreadcrumbJsonLd,
} from '@/components/JsonLd'
import { getLatestApk } from '@/lib/latestApk'
import { DemoVideo, CopyButton } from './PharmacyManualClient'

const BASE = 'https://aboelmakarem.pro/apps/pharmacy-manual'
const DOWNLOAD = '/api/download/pharmacy-manual'
const REPO = 'https://github.com/karem505/pharmacy-manual-apk'
const DATA_REPO = 'https://github.com/karem505/egyptian-drug-database'

// Version-specific integrity values published in the repo README (v0.2.2).
const APK_SHA256 = 'da03c38b3690324f439833cb121d4900181a91827ab1065e0d9afbeb82df0181'
const CERT_SHA256 = '98a8ac45aa15f1c068ff8c7a6602592b0472be353bfb22158c43dd53f05b9403'

// ISR: re-resolve the latest APK + re-render hourly without a redeploy.
export const revalidate = 3600

type SP = { searchParams: { lang?: string } }

const SHOTS = [
  { file: '01.jpg', en: 'Bilingual search across 24,868+ medicines with prices', ar: 'بحث ثنائي اللغة عبر أكثر من 24,868 دواءً مع الأسعار' },
  { file: '02.jpg', en: 'Drug detail with cheaper same-ingredient alternatives', ar: 'تفاصيل الدواء مع بدائل أرخص بنفس المادة الفعّالة' },
  { file: '03.jpg', en: 'Drug detail with a class-coded chip', ar: 'تفاصيل الدواء مع وسم لوني حسب التصنيف' },
  { file: '04.jpg', en: 'Drug detail view', ar: 'عرض تفاصيل الدواء' },
  { file: '05.jpg', en: 'Browse by therapeutic class', ar: 'تصفّح حسب التصنيف الدوائي' },
  { file: '06.jpg', en: 'Browse by manufacturer and route', ar: 'تصفّح حسب الشركة وطريقة الإعطاء' },
]

export async function generateMetadata({ searchParams }: SP): Promise<Metadata> {
  const ar = searchParams?.lang === 'ar'
  const title = ar
    ? 'تحميل تطبيق دليل الأدوية الإكلينيكي — دليل أدوية مصر بدون إنترنت (أندرويد)'
    : 'Download Pharmacy Manual — Offline Egyptian Drug Index (Android)'
  const description = ar
    ? 'حمّل تطبيق دليل الأدوية الإكلينيكي لأندرويد: دليل أدوية مصري يعمل بدون إنترنت ومُدقّق أسعار، بحث ثنائي اللغة عبر أكثر من 24,868 دواءً ومقارنة أسعار البدائل. مجاني وبدون إعلانات.'
    : 'Download Pharmacy Manual for Android: an offline Egyptian drug index and price checker with bilingual search across 24,868+ medicines and same-ingredient price comparison. Free, no ads.'
  const url = ar ? `${BASE}?lang=ar` : BASE
  const ogTitle = ar ? 'دليل الأدوية الإكلينيكي' : 'Pharmacy Manual — Android App'
  const ogImage = `https://aboelmakarem.pro/api/og?title=${encodeURIComponent(ogTitle)}&category=${encodeURIComponent(ar ? 'تطبيق أندرويد' : 'Android App')}${ar ? '&lang=ar' : ''}`

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { 'en-US': BASE, 'ar-EG': `${BASE}?lang=ar`, 'x-default': BASE },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      locale: ar ? 'ar_EG' : 'en_US',
      alternateLocale: ar ? ['en_US'] : ['ar_EG'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

export default async function PharmacyManualPage({ searchParams }: SP) {
  const ar = searchParams?.lang === 'ar'
  const t = (en: string, arabic: string) => (ar ? arabic : en)
  const font = ar ? 'font-rubik' : 'font-mono'
  const apk = await getLatestApk()

  const stats = [
    { n: '24,868+', l: t('medicines', 'دواء') },
    { n: t('Bilingual', 'لغتان'), l: t('AR + EN search', 'بحث عربي وإنجليزي') },
    { n: t('Price', 'الأسعار'), l: t('cheapest equivalent', 'أرخص بديل مكافئ') },
    { n: t('Offline', 'بدون نت'), l: t('no internet needed', 'لا يحتاج إنترنت') },
  ]

  const features = [
    { en: 'Bilingual, diacritic-insensitive search', enD: 'Search across 24,868+ medicines by Arabic alias, English name, or active ingredient — diacritics ignored.', a: 'بحث ثنائي اللغة غير حسّاس للتشكيل', aD: 'ابحث في أكثر من 24,868 دواءً بالاسم العربي أو الإنجليزي أو المادة الفعّالة — بدون حساسية للتشكيل.' },
    { en: 'Cheapest same-ingredient comparison', enD: 'Every drug detail badges cheaper equivalents with the same active ingredient, so you can find a lower-priced option.', a: 'مقارنة أرخص بديل بنفس المادة', aD: 'تُبرز صفحة كل دواء البدائل الأرخص بنفس المادة الفعّالة، لتجد خياراً أقل سعراً.' },
    { en: 'Browse by class, manufacturer, route', enD: 'Drill into therapeutic classes (with live counts), manufacturers, and routes of administration.', a: 'تصفّح حسب التصنيف والشركة والإعطاء', aD: 'تنقّل بين التصنيفات الدوائية (بأعداد حيّة) والشركات وطرق الإعطاء.' },
    { en: 'Light & dark, Arabic-first RTL', enD: 'A calm clinical design in both light and dark themes, fully right-to-left throughout.', a: 'فاتح وداكن، عربي أولاً (RTL)', aD: 'تصميم إكلينيكي هادئ بوضعين فاتح وداكن، بدعم كامل للكتابة من اليمين لليسار.' },
    { en: 'Self-updating database', enD: 'An embedded database refreshes itself from the source data when it changes — no app update needed.', a: 'قاعدة بيانات تُحدّث نفسها', aD: 'قاعدة بيانات مدمجة تُحدّث نفسها من المصدر عند تغيّره — دون تحديث التطبيق.' },
    { en: 'Works fully offline', enD: 'After install everything works without a connection — the whole index lives on your device.', a: 'يعمل بالكامل بدون إنترنت', aD: 'بعد التثبيت يعمل كل شيء دون اتصال — الفهرس كامل على جهازك.' },
  ]

  const changelog = [
    { v: '0.2.2', items: ar
      ? ['موقّع الآن بمفتاح إصدار رسمي بدل مفتاح التصحيح — هوية ثابتة وقابلة للتحقق.', 'ملاحظة لمرة واحدة: لتغيّر مفتاح التوقيع، من كان لديه إصدار أقدم عليه إزالته مرة قبل التثبيت.']
      : ['Now signed with a proper release key instead of the Android debug key — a stable, tamper-evident identity.', 'One-time note: because the signing key changed, anyone on an earlier build must uninstall it once before installing.'] },
    { v: '0.2.1', items: ar
      ? ['إصلاح زر «التحقق من التحديثات» — كانت أذونات الإنترنت ناقصة في إصدارات الإطلاق.']
      : ['Fixes the "check for updates" button — release builds were missing the INTERNET permission.'] },
    { v: '0.2.0', items: ar
      ? ['إعادة تصميم بصرية كاملة بطابع «الدليل الميداني الإكلينيكي».', 'أيقونة جديدة واسم عربي للتطبيق (دليل الأدوية).', 'تصفّح حسب التصنيف والشركة وطريقة الإعطاء، ومُدقّق أسعار أوضح.']
      : ['A complete "Clinical Field Guide" visual redesign.', 'New branded app icon and an Arabic app name (دليل الأدوية).', 'Browse by class, manufacturer, and route, plus a clearer price checker.'] },
  ]

  const installSteps = ar
    ? ['نزّل ملف الـ APK من زر التحميل بالأعلى.', 'فعّل «التثبيت من مصادر غير معروفة» في إعدادات أندرويد.', 'افتح الملف الذي نزّلته وأكمل التثبيت.', 'إن كان لديك إصدار أقدم مثبّت، أزله أولاً (تغيّر مفتاح التوقيع).']
    : ['Download the APK from the button above.', 'Enable "install from unknown sources" in your Android settings.', 'Open the downloaded file and complete the install.', 'If an older build is installed, uninstall it first (the signing key changed).']

  const faq = [
    { q: t('Is the app free?', 'هل التطبيق مجاني؟'), a: t('Yes — Pharmacy Manual is completely free, with no ads and no in-app purchases.', 'نعم — دليل الأدوية مجاني تماماً، بلا إعلانات وبلا مشتريات داخل التطبيق.') },
    { q: t('Does it need an internet connection?', 'هل يحتاج إلى إنترنت؟'), a: t('No. The entire drug index ships inside the app and works fully offline. It only goes online to refresh its database when the source data changes.', 'لا. الفهرس كامل داخل التطبيق ويعمل بدون إنترنت. يتصل فقط لتحديث قاعدة بياناته عند تغيّر بيانات المصدر.') },
    { q: t('Which Android versions are supported?', 'ما إصدارات أندرويد المدعومة؟'), a: t('Android 5.0 and newer.', 'أندرويد 5.0 وأحدث.') },
    { q: t('Is it safe? Why does Android warn about "unknown sources"?', 'هل هو آمن؟ ولماذا يحذّر أندرويد من «مصادر غير معروفة»؟'), a: t('The app is distributed directly as an APK rather than through the Play Store, so Android shows the standard sideload warning. The build is signed with a release key, and its SHA-256 fingerprints are published below and in the repository so you can verify your download.', 'يُوزَّع التطبيق مباشرةً كملف APK وليس عبر متجر Play، لذا يظهر تحذير التثبيت المعتاد. الإصدار موقّع بمفتاح رسمي، وبصمات SHA-256 منشورة بالأسفل وفي المستودع للتحقق من تنزيلك.') },
    { q: t('Where does the drug data come from?', 'من أين تأتي بيانات الأدوية؟'), a: t('From the open egyptian-drug-database, released under CC0. Prices and availability change constantly — always verify with the Egyptian Drug Authority and a licensed pharmacist.', 'من قاعدة بيانات الأدوية المصرية المفتوحة، المنشورة برخصة CC0. الأسعار والتوافر يتغيّران باستمرار — تحقّق دائماً من هيئة الدواء المصرية ومن صيدلي مرخّص.') },
    { q: t('Is it on the Google Play Store?', 'هل هو متوفر على متجر Google Play؟'), a: t('Not currently — it is distributed here as a direct APK download. This page always serves the latest version.', 'ليس حالياً — يُوزَّع هنا كتنزيل APK مباشر. تقدّم هذه الصفحة أحدث إصدار دائماً.') },
  ]

  const screenshotUrls = SHOTS.map((s) => `https://aboelmakarem.pro/apps/pharmacy-manual/${s.file}`)

  return (
    <>
      <PharmacyManualAppJsonLd
        ar={ar}
        version={apk.version}
        sizeBytes={apk.sizeBytes}
        downloadUrl={apk.downloadUrl}
        screenshots={screenshotUrls}
      />
      <ServiceFaqJsonLd id={`${BASE}#faq`} faq={faq} />
      <ServiceBreadcrumbJsonLd
        items={[
          { name: t('Home', 'الرئيسية'), url: 'https://aboelmakarem.pro' },
          { name: t('Pharmacy Manual', 'دليل الأدوية الإكلينيكي'), url: BASE },
        ]}
      />

      <SimplePageHeader title={t('Pharmacy Manual', 'دليل الأدوية')} ar={ar} />

      <main lang={ar ? 'ar' : 'en'} dir={ar ? 'rtl' : 'ltr'} className="min-h-screen px-6 pb-24 pt-12">
        <div className="max-w-5xl mx-auto">
          {/* Language switch */}
          <div className={`mb-10 flex items-center gap-3 text-xs font-mono ${ar ? 'justify-start' : 'justify-end'}`}>
            <Link href="/apps/pharmacy-manual" hrefLang="en" className={!ar ? 'text-signal' : 'text-ash hover:text-paper transition-colors'}>EN</Link>
            <span className="text-wire" aria-hidden="true">/</span>
            <Link href="/apps/pharmacy-manual?lang=ar" hrefLang="ar" className={ar ? 'text-signal font-rubik' : 'text-ash hover:text-paper transition-colors font-rubik'}>ع</Link>
          </div>

          {/* ── Hero (split) ── */}
          <section className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-12 items-center">
            <div className={ar ? 'text-right' : 'text-left'}>
              <span className="tab-eyebrow mb-6">{t('Android App · Free Download', 'تطبيق أندرويد · تحميل مجاني')}</span>
              <div className={`flex items-center gap-4 mb-5 ${ar ? 'flex-row-reverse' : ''}`}>
                <Image src="/apps/pharmacy-manual/icon.png" alt={t('Pharmacy Manual app icon', 'أيقونة تطبيق دليل الأدوية')} width={512} height={512} className="w-16 h-16 border border-wire" priority />
                <div className={ar ? 'text-right' : 'text-left'}>
                  <h1 className={`font-extrabold tracking-[-0.04em] text-3xl md:text-4xl text-paper leading-none ${font}`}>
                    {t('Pharmacy Manual', 'دليل الأدوية الإكلينيكي')}<span className="text-signal">.</span>
                  </h1>
                  <p className={`text-ash text-sm mt-2 ${font}`}>{t('Offline Egyptian drug index & price checker', 'دليل أدوية مصري ومُدقّق أسعار — بدون إنترنت')}</p>
                </div>
              </div>

              <a href={DOWNLOAD} className={`inline-flex items-center gap-3 px-6 py-4 bg-signal text-ink hover:bg-signal-deep transition-colors duration-150 text-base font-bold ${font}`}>
                <FaDownload />
                <span>{t(`Download v${apk.version}`, `تحميل الإصدار ${apk.version}`)}</span>
                <span className="opacity-80">· {apk.sizeLabel}</span>
              </a>

              <div className={`mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ash ${font} ${ar ? 'justify-end' : ''}`}>
                <span className="inline-flex items-center gap-1.5"><FaAndroid className="text-moss" /> {t('Android 5.0+', 'أندرويد 5.0+')}</span>
                <span>· {t('Free · No ads', 'مجاني · بلا إعلانات')}</span>
                <span className="inline-flex items-center gap-1.5"><FaShieldAlt className="text-signal" /> {t('Release-signed · SHA-256 verified', 'موقّع رسمياً · تحقق SHA-256')}</span>
              </div>

              <div className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs ${font} ${ar ? 'justify-end' : ''}`}>
                <a href={REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ash hover:text-signal transition-colors"><FaGithub /> {t('Source / releases on GitHub', 'المصدر / الإصدارات على GitHub')}</a>
                <a href={DATA_REPO} target="_blank" rel="noopener noreferrer" className="text-ash hover:text-signal transition-colors">{t('Open drug data (CC0)', 'بيانات الأدوية المفتوحة (CC0)')}</a>
              </div>
            </div>

            {/* Hero phone */}
            <div className="hidden md:block shrink-0">
              <div className="w-[240px] border border-wire bg-graphite p-2">
                <Image src={`/apps/pharmacy-manual/${SHOTS[0].file}`} alt={ar ? SHOTS[0].ar : SHOTS[0].en} width={824} height={1814} className="w-full h-auto" priority sizes="240px" />
              </div>
            </div>
          </section>

          {/* ── Stat band ── */}
          <section className="mt-16 grid grid-cols-2 md:grid-cols-4 border border-wire divide-x divide-wire rtl:divide-x-reverse">
            {stats.map((s) => (
              <div key={s.l} className="p-5 text-center">
                <div className={`text-xl md:text-2xl font-extrabold text-paper ${font}`}>{s.n}</div>
                <div className={`mt-1 text-[0.7rem] uppercase tracking-wide text-ash ${font}`}>{s.l}</div>
              </div>
            ))}
          </section>

          {/* ── Screenshot gallery ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('Screenshots', 'لقطات الشاشة')}</h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:mx-0 md:px-0">
              {SHOTS.map((s) => (
                <figure key={s.file} className="snap-center shrink-0 w-[60vw] max-w-[260px] md:w-auto md:max-w-none">
                  <div className="border border-wire bg-graphite p-2">
                    <Image src={`/apps/pharmacy-manual/${s.file}`} alt={ar ? s.ar : s.en} width={824} height={1814} className="w-full h-auto" sizes="(max-width: 768px) 60vw, 280px" />
                  </div>
                  <figcaption className={`mt-2 text-xs text-ash ${font} ${ar ? 'text-right' : ''}`}>{ar ? s.ar : s.en}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* ── Features ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('What it does', 'ماذا يفعل')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div key={f.en} className={`border border-wire bg-graphite p-5 ${ar ? 'text-right' : ''}`}>
                  <h3 className={`text-paper font-bold text-base mb-2 ${font}`}>{ar ? f.a : f.en}</h3>
                  <p className={`text-ash text-sm leading-relaxed ${font}`}>{ar ? f.aD : f.enD}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── What's new ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t("What's new", 'الجديد')}</h2>
            <div className="flex flex-col divide-y divide-wire border-y border-wire">
              {changelog.map((c) => (
                <div key={c.v} className={`py-6 ${ar ? 'text-right' : ''}`}>
                  <div className={`flex items-baseline gap-3 mb-3 ${ar ? 'flex-row-reverse' : ''}`}>
                    <span className="font-mono text-signal text-sm tabular-nums">v{c.v}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {c.items.map((it, i) => (
                      <li key={i} className={`flex gap-3 text-ash text-sm leading-relaxed ${font} ${ar ? 'flex-row-reverse text-right' : ''}`}>
                        <span className="text-signal shrink-0" aria-hidden="true">▍</span><span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── Demo video ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('See it in action', 'شاهده أثناء العمل')}</h2>
            <div className="max-w-[320px] mx-auto">
              <DemoVideo src="/apps/pharmacy-manual/demo.mp4" poster="/apps/pharmacy-manual/demo-poster.jpg" width={POSTER_W} height={POSTER_H} label={t('Play demo video', 'تشغيل الفيديو التوضيحي')} />
            </div>
          </section>

          {/* ── Install ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('How to install', 'كيفية التثبيت')}</h2>
            <ol className="flex flex-col gap-4">
              {installSteps.map((s, i) => (
                <li key={i} className={`flex gap-4 ${ar ? 'flex-row-reverse text-right' : ''}`}>
                  <span className={`shrink-0 w-8 h-8 border border-wire text-signal flex items-center justify-center font-mono text-sm tabular-nums`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`text-ash text-sm leading-relaxed self-center ${font}`}>{s}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Verify (collapsible) ── */}
          <section className="mt-16">
            <details className="border border-wire bg-graphite">
              <summary className={`cursor-pointer select-none px-5 py-4 text-paper font-bold text-sm ${font} ${ar ? 'text-right' : ''}`}>{t('Verify your download (optional)', 'تحقّق من تنزيلك (اختياري)')}</summary>
              <div className={`px-5 pb-5 flex flex-col gap-4 ${ar ? 'text-right' : ''}`} dir="ltr">
                <div>
                  <div className={`text-[0.7rem] uppercase tracking-wide text-ash mb-1 font-mono`}>APK SHA-256 (v0.2.2)</div>
                  <div className="flex items-center gap-2 bg-ink border border-wire px-3 py-2">
                    <code className="text-xs text-paper break-all font-mono">{APK_SHA256}</code>
                    <CopyButton value={APK_SHA256} label="Copy APK SHA-256" />
                  </div>
                </div>
                <div>
                  <div className={`text-[0.7rem] uppercase tracking-wide text-ash mb-1 font-mono`}>Signing certificate SHA-256</div>
                  <div className="flex items-center gap-2 bg-ink border border-wire px-3 py-2">
                    <code className="text-xs text-paper break-all font-mono">{CERT_SHA256}</code>
                    <CopyButton value={CERT_SHA256} label="Copy certificate SHA-256" />
                  </div>
                </div>
                <p className="text-xs text-ash font-mono">
                  {t('Hashes shown are for v0.2.2. The repository README always lists the current build’s fingerprints: ', 'البصمات المعروضة لإصدار 0.2.2. يعرض ملف README في المستودع دائماً بصمات الإصدار الحالي: ')}
                  <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">github.com/karem505/pharmacy-manual-apk</a>
                </p>
              </div>
            </details>
          </section>

          {/* ── FAQ ── */}
          <section className="mt-24">
            <h2 className={`font-extrabold tracking-[-0.03em] text-2xl md:text-3xl text-paper mb-8 ${font} ${ar ? 'text-right' : ''}`}>{t('Frequently asked questions', 'الأسئلة الشائعة')}</h2>
            <div className="flex flex-col divide-y divide-wire border-y border-wire">
              {faq.map((item, i) => (
                <div key={i} className={`py-6 ${ar ? 'text-right' : ''}`}>
                  <h3 className={`font-bold text-base md:text-lg text-paper mb-2 ${font}`}>{item.q}</h3>
                  <p className={`text-ash text-sm md:text-base leading-relaxed ${font}`}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Disclaimer ── */}
          <section className="mt-16">
            <div className={`border border-wire bg-graphite p-6 ${ar ? 'text-right' : ''}`}>
              <p className={`text-xs text-ash leading-relaxed ${font}`}>
                {t('Drug data is released under CC0 from the open egyptian-drug-database. Prices and availability change constantly. This app is for information only — always verify with the Egyptian Drug Authority and a licensed pharmacist before any clinical use.', 'بيانات الأدوية منشورة برخصة CC0 من قاعدة بيانات الأدوية المصرية المفتوحة. الأسعار والتوافر يتغيّران باستمرار. هذا التطبيق للمعلومات فقط — تحقّق دائماً من هيئة الدواء المصرية ومن صيدلي مرخّص قبل أي استخدام إكلينيكي.')}
              </p>
            </div>
          </section>

          {/* ── Closing CTA ── */}
          <section className="mt-16 text-center">
            <a href={DOWNLOAD} className={`inline-flex items-center gap-3 px-6 py-4 bg-signal text-ink hover:bg-signal-deep transition-colors duration-150 text-base font-bold ${font}`}>
              <FaDownload /><span>{t(`Download v${apk.version} · ${apk.sizeLabel}`, `تحميل الإصدار ${apk.version} · ${apk.sizeLabel}`)}</span>
            </a>
            <div className={`mt-4 text-xs ${font}`}>
              <Link href="/" className="text-ash hover:text-signal transition-colors">{t('← Back to portfolio', 'العودة إلى الموقع →')}</Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Build and verify both languages render**

```bash
npm run build && npm run dev &
sleep 5
# EN: version label, schema, hero, gallery
curl -s "http://localhost:3000/apps/pharmacy-manual" | grep -o "Download v0.2.2" | head -1            # expect: Download v0.2.2
curl -s "http://localhost:3000/apps/pharmacy-manual" | grep -c "MobileApplication"                    # expect: >=1
curl -s "http://localhost:3000/apps/pharmacy-manual" | grep -c "FAQPage"                               # expect: >=1
# AR: RTL + Arabic name
curl -s "http://localhost:3000/apps/pharmacy-manual?lang=ar" | grep -c 'dir="rtl"'                      # expect: >=1
curl -s "http://localhost:3000/apps/pharmacy-manual?lang=ar" | grep -c "دليل الأدوية"                   # expect: >=1
kill %1 2>/dev/null
```

- [ ] **Step 3: Commit**

```bash
git add app/apps/pharmacy-manual/page.tsx
git commit -m "feat(pharmacy-manual): add bilingual store-style download page"
```

---

### Task 7: Homepage project card

Add Pharmacy Manual as the lead "notable build" in `components/Projects.tsx`, linking to the internal page + repo.

**Files:**
- Modify: `components/Projects.tsx`

**Interfaces:**
- Consumes: the existing `Project` type + `notableBuilds` array; `link` may be an internal path.

- [ ] **Step 1: Import a fitting icon**

In `components/Projects.tsx`, add `FaBookMedical` to the `react-icons/fa` import line (line 6):

```tsx
import { FaGithub, FaExternalLinkAlt, FaRocket, FaTasks, FaLanguage, FaCalculator, FaCreditCard, FaBookMedical } from 'react-icons/fa'
```

- [ ] **Step 2: Add the card as the FIRST element of `notableBuilds`**

Insert this object as the first entry in the `notableBuilds: Project[] = [` array (before `Tamara Payments Skill`):

```tsx
    {
      title: 'Pharmacy Manual',
      tagline: t(
        'Offline Egyptian Drug Index & Price Checker (Android)',
        'دليل أدوية مصر ومُدقّق الأسعار — بدون إنترنت (أندرويد)'
      ),
      description: t(
        'An Arabic-first, fully offline Android app indexing 24,868+ Egyptian medicines: bilingual, diacritic-insensitive search across Arabic alias, English name, and active ingredient; a price checker that badges cheaper same-ingredient alternatives; and browse by drug class, manufacturer, and route. Distributed as a direct APK with a download page that always serves the latest signed build.',
        'تطبيق أندرويد عربيّ أولاً يعمل بالكامل بدون إنترنت، يفهرس أكثر من 24,868 دواءً مصرياً: بحث ثنائي اللغة غير حسّاس للتشكيل بالاسم العربي والإنجليزي والمادة الفعّالة؛ ومُدقّق أسعار يُبرز البدائل الأرخص بنفس المادة؛ وتصفّح حسب التصنيف والشركة وطريقة الإعطاء. يُوزَّع كملف APK مباشر مع صفحة تحميل تقدّم دائماً أحدث إصدار موقّع.'
      ),
      tech: ['Android', 'Offline-first', 'Bilingual', 'RTL'],
      roles: [],
      icon: FaBookMedical,
      result: t('24,868+ medicines · offline · free', 'أكثر من 24,868 دواءً · بدون إنترنت · مجاني'),
      link: '/apps/pharmacy-manual',
      github: 'https://github.com/karem505/pharmacy-manual-apk',
    },
```

> Note: the `ProjectCard` renders `project.link` with `target="_blank"`. That's fine for an internal link too; leaving it consistent with the other cards avoids touching shared card logic.

- [ ] **Step 3: Build + verify the card + internal link render**

```bash
npm run build && npm run dev &
sleep 5
curl -s "http://localhost:3000/" | grep -c "Pharmacy Manual"               # expect: >=1
curl -s "http://localhost:3000/" | grep -c "/apps/pharmacy-manual"          # expect: >=1
kill %1 2>/dev/null
```

- [ ] **Step 4: Commit**

```bash
git add components/Projects.tsx
git commit -m "feat(pharmacy-manual): add app as lead notable-build card on homepage"
```

---

### Task 8: Sitemap + llms.txt entries

Make the new page discoverable.

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `public/llms.txt`

- [ ] **Step 1: Add sitemap entries**

In `app/sitemap.ts`, inside the `staticPages` array, after the `digital-transformation?lang=ar` entry (line ~56) and before the `privacy` entry, insert:

```ts
    {
      url: `${baseUrl}/apps/pharmacy-manual`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apps/pharmacy-manual?lang=ar`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
```

- [ ] **Step 2: Add an llms.txt entry**

In `public/llms.txt`, under the `## Key pages` list, add these two bullets (after the Digital Transformation (Arabic) line):

```markdown
- [Pharmacy Manual (Android app)](https://aboelmakarem.pro/apps/pharmacy-manual): Free, offline Egyptian drug index and price-checker Android app by Abo-Elmakarem Shohoud — bilingual (Arabic/English) search across 24,868+ medicines, cheapest same-ingredient price comparison, browse by class/manufacturer/route. Direct APK download, always the latest version; data is CC0 from the open egyptian-drug-database.
- [Pharmacy Manual (Arabic)](https://aboelmakarem.pro/apps/pharmacy-manual?lang=ar): Arabic (RTL) variant of the Pharmacy Manual app download page (دليل الأدوية الإكلينيكي).
```

- [ ] **Step 3: Build + verify sitemap output**

```bash
npm run build && npm run dev &
sleep 5
curl -s "http://localhost:3000/sitemap.xml" | grep -c "apps/pharmacy-manual"   # expect: 2
kill %1 2>/dev/null
```

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts public/llms.txt
git commit -m "feat(pharmacy-manual): add page to sitemap + llms.txt"
```

---

### Task 9: Docs + final full verification

Document the route and do the end-to-end gate (build, responsive + RTL screenshots).

**Files:**
- Modify: `CLAUDE.md` (Pages table + a one-line note on the dynamic-download mechanism)

- [ ] **Step 1: Document the route in `CLAUDE.md`**

In the `## Pages` table, add a row after the `/digital-transformation` row:

```markdown
| `/apps/pharmacy-manual` | App download page — **Pharmacy Manual** (دليل الأدوية الإكلينيكي), an offline Egyptian drug index + price-checker Android app. Server-rendered, bilingual via `?lang=ar`. Store-style layout. Download button resolves the **latest APK dynamically** at request time (ISR `revalidate=3600`) from the separate `karem505/pharmacy-manual-apk` repo's Contents API via `lib/latestApk.ts`, with `/api/download/pharmacy-manual` as a stable 302 redirect. Schema: MobileApplication + FAQPage + BreadcrumbList. |
```

And under `## Architecture`, add `apps/pharmacy-manual/` to the `app/` listing and `latestApk.ts` to the `lib/` listing (one word each, matching the existing terse style).

- [ ] **Step 2: Full clean build + lint**

```bash
npm run test     # vitest: green
npm run build    # clean
npm run lint     # no new errors
```

Expected: all pass.

- [ ] **Step 3: Capture responsive + RTL screenshots**

Start the dev server and use the browser/visual tooling (or `seo-visual` agent) to screenshot the page at **375px**, **768px**, and **1280px** widths for both `/apps/pharmacy-manual` and `/apps/pharmacy-manual?lang=ar`. Confirm:
- Hero stacks cleanly on mobile (phone hidden < md), CTA is full-width-friendly, no horizontal overflow.
- Screenshot gallery scrolls horizontally on mobile, grids on desktop.
- AR variant is fully RTL (text right-aligned, icons mirrored where appropriate), `font-rubik` applied.
- The download button visibly reads the resolved version (`v0.2.2`).

- [ ] **Step 4: Commit docs**

```bash
git add CLAUDE.md
git commit -m "docs(pharmacy-manual): document /apps/pharmacy-manual route + dynamic download"
```

---

### Task 10: Post-deploy SEO ops (run AFTER merge + Netlify deploy)

These require the URLs to be live; run them after the branch is merged and deployed. Route through the `seo` subagent per CLAUDE.md.

- [ ] **Step 1: Confirm the page is live**

```bash
curl -sI "https://aboelmakarem.pro/apps/pharmacy-manual" | head -1   # expect: HTTP/2 200
```

- [ ] **Step 2: Request Google indexing (both URLs)**

```bash
gwcli sc request-indexing "https://aboelmakarem.pro/apps/pharmacy-manual"
gwcli sc request-indexing "https://aboelmakarem.pro/apps/pharmacy-manual?lang=ar"
```

- [ ] **Step 3: Submit to IndexNow**

```bash
curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" \
  -d '{"host":"aboelmakarem.pro","key":"aboelmakarem2026indexnowkey","keyLocation":"https://aboelmakarem.pro/aboelmakarem2026indexnowkey.txt","urlList":["https://aboelmakarem.pro/apps/pharmacy-manual","https://aboelmakarem.pro/apps/pharmacy-manual?lang=ar"]}'
```

- [ ] **Step 4: Verify sitemap + validate schema + page audit**

```bash
gwcli sc sitemaps "https://aboelmakarem.pro/"   # confirm sitemap picked up the new URLs
```

Then run the `seo` agent: validate the `MobileApplication` + `FAQPage` + `BreadcrumbList` JSON-LD (Rich Results), and run `/seo-page https://aboelmakarem.pro/apps/pharmacy-manual`. Fix any flagged issues.

---

## Self-Review

**1. Spec coverage**
- Store-style split-hero layout → Task 6 (hero) + Tasks 1/5 (assets/video). ✓
- Fully mobile responsive → Task 6 (responsive classes) + Task 9 Step 3 (verification). ✓
- Dynamic latest-version download → Tasks 2 + 3 (resolver + redirect), consumed in Task 6. ✓
- Blueprint aesthetic / tokens → Global Constraints + Task 6 classes. ✓
- Bilingual EN/AR server-rendered → Task 6 (`t()`, `dir`, `font`). ✓
- Assets from the given folder → Task 1. ✓
- Add as homepage project (lead notable build) → Task 7. ✓
- SEO/GEO: metadata+hreflang (Task 6), MobileApplication+FAQ+Breadcrumb JSON-LD (Tasks 4/6), sitemap+llms.txt (Task 8), post-deploy GSC/IndexNow (Task 10). ✓
- Verify block + demo video decisions → Task 6 (`<details>`) + Tasks 1/5/6 (video). ✓
- No fabricated ratings/stack → Constraints + Task 4 (no aggregateRating) + Task 7 (tech labels). ✓

**2. Placeholder scan:** `POSTER_W`/`POSTER_H` are explicit values recorded in Task 1 Step 5 and substituted in Tasks 5/6 — not vague placeholders. Screenshot content mapping is an explicit inspect-and-assign step (Task 1 Step 3) with a concrete fallback vocabulary. No "TBD"/"handle edge cases"/"add validation" left.

**3. Type consistency:** `ApkInfo` fields (`version`, `sizeBytes`, `sizeLabel`, `downloadUrl`) are produced in Task 2 and consumed identically in Tasks 3/4/6. `getLatestApk`/`pickLatestApk`/`parseApkVersion`/`formatBytes` names match across tasks. `PharmacyManualAppJsonLd` prop names (`ar`, `version`, `sizeBytes`, `downloadUrl`, `screenshots`) match between Task 4 (definition) and Task 6 (call). `DemoVideo`/`CopyButton` prop shapes match between Task 5 and Task 6.

## Execution notes
- `next/image` needs no `next.config` domain config: all images are local under `public/`.
- The page never breaks if GitHub is unreachable at build/runtime (resolver fallback).
- `/api/` is disallowed for crawlers (robots), which correctly keeps the redirect endpoint out of the index while the `/apps/` page stays crawlable.
