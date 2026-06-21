// lib/latestApk.ts
// Resolves the latest Pharmacy Manual APK from the SEPARATE GitHub repo at
// request time, cached via ISR. APKs are committed as raw files on `main`
// (no GitHub Releases), named `pharmacy-manual-vX.Y.Z.apk`.

const REPO = 'karem505/pharmacy-manual-apk'
const CONTENTS_API = `https://api.github.com/repos/${REPO}/contents/`
const RAW_BASE = `https://github.com/${REPO}/raw/main`
const README_RAW = `https://raw.githubusercontent.com/${REPO}/main/README.md`

// Cache tag shared by every fetch in this module. The /api/revalidate webhook
// (pinged by the APK repo's GitHub Action on push) calls revalidateTag with
// this to make a new build appear instantly across the page, hub, and route.
export const APK_CACHE_TAG = 'pharmacy-apk'

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

// Last-resort fallback so the button never breaks if the GitHub API is
// unreachable or rate-limited. This is only a floor for total-outage cases —
// the live version is resolved from the repo. Bump it on major releases.
const FALLBACK: ApkInfo = {
  version: '0.3.0',
  fileName: 'pharmacy-manual-v0.3.0.apk',
  sizeBytes: 65528723,
  sizeLabel: '62 MB',
  downloadUrl: `${RAW_BASE}/pharmacy-manual-v0.3.0.apk`,
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

/**
 * Resolve the latest APK from the repo. The GitHub response is cached for 5
 * minutes (shared across the page, the apps hub, and the download route), so a
 * newly pushed APK appears site-wide within ~5 min — and ≤12 GitHub calls/hr
 * keeps us far under the unauthenticated rate limit. Falls back on any failure.
 */
export async function getLatestApk(): Promise<ApkInfo> {
  try {
    const res = await fetch(CONTENTS_API, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 300, tags: [APK_CACHE_TAG] },
    })
    if (!res.ok) return FALLBACK
    const data = (await res.json()) as GhEntry[]
    if (!Array.isArray(data)) return FALLBACK
    return pickLatestApk(data) ?? FALLBACK
  } catch {
    return FALLBACK
  }
}

export interface ApkHashes {
  apkSha256: string | null
  certSha256: string | null
}

const HEX64 = '([0-9a-fA-F]{64})'
const APK_SHA_RE = new RegExp(`SHA-256 of the APK:\\*\\*\\s*\`?${HEX64}`, 'i')
const CERT_SHA_RE = new RegExp(`Signing certificate SHA-256:\\*\\*\\s*\`?${HEX64}`, 'i')

/** Extract the APK + signing-cert SHA-256 fingerprints from the README text. */
export function parseReadmeHashes(md: string): ApkHashes {
  return {
    apkSha256: APK_SHA_RE.exec(md)?.[1]?.toLowerCase() ?? null,
    certSha256: CERT_SHA_RE.exec(md)?.[1]?.toLowerCase() ?? null,
  }
}

/**
 * Parse the current build's SHA-256 fingerprints out of the repo README so the
 * "verify your download" block always matches the live APK. Same 5-min cache +
 * tag as getLatestApk, so the webhook refreshes them too. Returns nulls on any
 * failure; callers fall back to linking the README.
 */
export async function getApkHashes(): Promise<ApkHashes> {
  try {
    const res = await fetch(README_RAW, { next: { revalidate: 300, tags: [APK_CACHE_TAG] } })
    if (!res.ok) return { apkSha256: null, certSha256: null }
    return parseReadmeHashes(await res.text())
  } catch {
    return { apkSha256: null, certSha256: null }
  }
}
