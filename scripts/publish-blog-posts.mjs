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

const md = readFileSync(join(__dirname, '..', 'proposals', 'seo-service-blog-posts.md'), 'utf8')

function field(block, label) {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`)
  const m = block.match(re)
  return m ? m[1].trim().replace(/^`|`$/g, '') : null
}
function metaDesc(block, label) {
  const v = field(block, label)
  return v ? v.replace(/\s*\(\d+\s*chars\)\s*$/i, '').trim() : null
}
function fenced(block, label, lang = '') {
  const re = new RegExp(`\\*\\*${label}:\\*\\*\\s*\`\`\`${lang}\\n([\\s\\S]*?)\\n\`\`\``)
  const m = block.match(re)
  return m ? m[1].trim() : null
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
  const content_en = fenced(block, 'content_en', 'markdown')
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
    content_ar: fenced(block, 'content_ar', 'markdown'),
    post_type: field(block, 'post_type') || 'how-to',
    status: 'published',
    seo_keywords: keywords(block),
    reading_time_minutes: Math.max(4, Math.round(words / 200)),
    published_at: new Date().toISOString(),
  }
})

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
}
if (!ok) {
  console.error('\nParsing failed — fix the draft before publishing.')
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
  } else {
    console.error(`✗ FAILED ${p.slug}: ${res.status} ${await res.text()}`)
  }
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
