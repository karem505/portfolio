#!/usr/bin/env node
/**
 * Publish the two bilingual SEO blog posts (drafted in
 * proposals/seo-service-blog-posts.md) into the Supabase `posts` table.
 *
 * Usage:
 *   node scripts/publish-blog-posts.mjs --dry-run      # parse + validate only
 *   SUPABASE_SERVICE_KEY=<key> node scripts/publish-blog-posts.mjs
 *
 * The Supabase URL is the project's public URL; the SERVICE key (server-side,
 * bypasses RLS) must be provided via env. It is NOT stored in the repo.
 * Idempotent: skips any post whose slug already exists.
 *
 * Column names follow lib/types.ts (the schema the live blog app reads):
 * slug, title_en/ar, excerpt_en/ar, meta_description_en/ar, content_en/ar,
 * post_type, status, seo_keywords, reading_time_minutes, published_at.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zklvvwugirvwimxdvybw.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const DRY = process.argv.includes('--dry-run')

// Source markdown: optional positional `.md` arg (relative to cwd or absolute);
// defaults to the original service-posts draft for backward compatibility.
const srcArg = process.argv.find((a) => a.endsWith('.md'))
const SRC = srcArg
  ? srcArg.startsWith('/')
    ? srcArg
    : join(process.cwd(), srcArg)
  : join(__dirname, '..', 'proposals', 'seo-service-blog-posts.md')
console.log(`Source: ${SRC}`)
const md = readFileSync(SRC, 'utf8')

function field(block, label) {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`)
  const m = block.match(re)
  return m ? m[1].trim().replace(/^`|`$/g, '') : null
}
function metaDesc(block, label) {
  const v = field(block, label)
  return v ? v.replace(/\s*\(\d+\s*chars\)\s*$/i, '').trim() : null
}
// Extract a fenced markdown field, tolerant of NESTED ```code fences inside
// the content. The old non-greedy regex stopped at the first inner fence,
// silently truncating any post that embedded a code block. Instead, anchor
// between this field's marker and the next field marker (or block end), then
// strip only the OUTERMOST ```fence.
function fenced(block, label, nextLabel = null) {
  const head = `**${label}:**`
  const start = block.indexOf(head)
  if (start < 0) return null
  let end = nextLabel ? block.indexOf(`**${nextLabel}:**`, start) : -1
  if (end < 0) end = block.length
  let seg = block.slice(start + head.length, end).trim()
  seg = seg.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```\s*$/, '')
  return seg.trim() || null
}
function keywords(block) {
  const m = block.match(/\*\*seo_keywords:\*\*\s*```\s*([\s\S]*?)```/)
  if (!m) return []
  try {
    return JSON.parse(m[1].trim())
  } catch {
    return []
  }
}

// Split into "# Post N ..." sections, drop the header and the "## Summary" tail.
const sections = md
  .split(/^# Post \d+.*$/m)
  .slice(1)
  .map((s) => s.split(/^## Summary/m)[0])

const posts = sections.map((block) => {
  const content_en = fenced(block, 'content_en', 'content_ar')
  const words = content_en ? content_en.split(/\s+/).length : 0
  return {
    slug: field(block, 'slug'),
    title_en: field(block, 'title_en'),
    title_ar: field(block, 'title_ar'),
    excerpt_en: field(block, 'excerpt_en'),
    excerpt_ar: field(block, 'excerpt_ar'),
    meta_description_en: metaDesc(block, 'meta_description_en'),
    meta_description_ar: metaDesc(block, 'meta_description_ar'),
    content_en,
    content_ar: fenced(block, 'content_ar', null),
    post_type: field(block, 'post_type') || 'how-to',
    status: 'published',
    seo_keywords: keywords(block),
    reading_time_minutes: Math.max(4, Math.round(words / 200)),
    published_at: new Date().toISOString(),
  }
})

// Quality gate: every post must carry at least one in-content link to a money
// page (/ai-training or /digital-transformation) in BOTH languages. This is the
// single biggest historical SEO gap (only 2 of 139 legacy posts linked a service
// page), so we block publishing of any new post that would repeat it. Override
// with --allow-no-service-link for the rare genuinely-unrelated piece.
const SERVICE_LINK_RE = /\/(ai-training|digital-transformation)\b/
const ALLOW_NO_LINK = process.argv.includes('--allow-no-service-link')

// Validate
let ok = true
for (const p of posts) {
  const missing = ['slug', 'title_en', 'title_ar', 'content_en', 'content_ar', 'excerpt_en', 'excerpt_ar'].filter(
    (k) => !p[k]
  )
  console.log(`\n• ${p.slug}`)
  console.log(`    title_en: ${p.title_en?.slice(0, 70)}`)
  console.log(`    title_ar: ${p.title_ar?.slice(0, 50)}`)
  console.log(`    meta_en : ${p.meta_description_en?.length} chars | meta_ar: ${p.meta_description_ar?.length} chars`)
  console.log(`    content : EN ${p.content_en?.length} chars / AR ${p.content_ar?.length} chars · ~${p.reading_time_minutes} min`)
  console.log(`    keywords: ${p.seo_keywords.length} · post_type: ${p.post_type}`)
  if (missing.length) {
    console.log(`    ❌ MISSING: ${missing.join(', ')}`)
    ok = false
  }
  const hasServiceLink =
    SERVICE_LINK_RE.test(p.content_en || '') && SERVICE_LINK_RE.test(p.content_ar || '')
  if (!hasServiceLink) {
    console.log(
      `    ${ALLOW_NO_LINK ? '⚠️ ' : '❌'} no in-content service link (/ai-training or /digital-transformation) in EN+AR`
    )
    if (!ALLOW_NO_LINK) ok = false
  }
}
if (!ok) {
  console.error(
    '\nValidation failed — fix the draft before publishing.' +
      '\n(If a post is genuinely unrelated to the services, re-run with --allow-no-service-link.)'
  )
  process.exit(1)
}
console.log(`\n✅ Parsed ${posts.length} posts cleanly.`)

if (DRY) {
  console.log('\n(dry run — nothing written)')
  process.exit(0)
}
if (!SERVICE_KEY) {
  console.error('\nSet SUPABASE_SERVICE_KEY to publish, e.g.:\n  SUPABASE_SERVICE_KEY=<key> node scripts/publish-blog-posts.mjs')
  process.exit(1)
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

const publishedSlugs = []
for (const p of posts) {
  const existing = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(p.slug)}&select=slug`,
    { headers }
  ).then((r) => r.json())
  if (Array.isArray(existing) && existing.length) {
    console.log(`↷ skip (already exists): ${p.slug}`)
    continue
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify([p]),
  })
  if (res.ok) {
    console.log(`✓ published: ${p.slug}`)
    publishedSlugs.push(p.slug)
  } else {
    console.error(`✗ FAILED ${p.slug}: ${res.status} ${await res.text()}`)
  }
}

// Submit newly published posts to IndexNow (Bing / Yandex / Seznam ONLY — this
// does NOT feed Google; Google discovery relies on internal links + sitemap +
// off-site authority, not IndexNow).
if (publishedSlugs.length) {
  const INDEXNOW_KEY = 'aboelmakarem2026indexnowkey'
  const urlList = publishedSlugs.map((s) => `https://aboelmakarem.pro/blog/${s}`)
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'aboelmakarem.pro',
      key: INDEXNOW_KEY,
      keyLocation: `https://aboelmakarem.pro/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  }).catch(() => null)
  console.log(`\nIndexNow (Bing/Yandex) submit ${urlList.length} url(s): ${r ? r.status : 'request failed'}`)
}

// Trigger ISR revalidation so the new posts appear on the live /blog immediately.
if (process.env.REVALIDATE_SECRET) {
  const r = await fetch(
    `https://aboelmakarem.pro/api/revalidate?secret=${encodeURIComponent(process.env.REVALIDATE_SECRET)}&path=/blog`
  ).catch(() => null)
  console.log(`\nRevalidated /blog: ${r ? r.status : 'request failed'}`)
} else {
  console.log('\nDone. To refresh the live /blog now, run:\n  curl -s "https://aboelmakarem.pro/api/revalidate?secret=<REVALIDATE_SECRET>&path=/blog"')
}
