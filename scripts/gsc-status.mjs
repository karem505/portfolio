#!/usr/bin/env node
/**
 * Search Console status check for the pages we care about.
 *
 * Prints the sitemap record (last downloaded, URL count, errors) and, for each
 * URL, Google's coverage state, last crawl, chosen canonical and rich-result
 * verdict via the URL Inspection API. Uses the gwcli "karem" profile's OAuth
 * token (re-auth: see CLAUDE.md → Google Search Console).
 *
 *   node scripts/gsc-status.mjs                 # default key-URL list
 *   node scripts/gsc-status.mjs https://aboelmakarem.pro/some/page ...
 */
import { homedir } from 'node:os'
import { join } from 'node:path'

const CLI = join(homedir(), 'google-workspace-cli')
const { getAuthenticatedClient } = await import(join(CLI, 'dist/lib/auth.js'))
const { google } = await import(join(CLI, 'node_modules/googleapis/build/src/index.js'))

const SITE = 'https://aboelmakarem.pro/'
const DEFAULT_URLS = [
  'https://aboelmakarem.pro/',
  'https://aboelmakarem.pro/?lang=ar',
  'https://aboelmakarem.pro/ai-training',
  'https://aboelmakarem.pro/ai-training?lang=ar',
  'https://aboelmakarem.pro/digital-transformation',
  'https://aboelmakarem.pro/digital-transformation?lang=ar',
  'https://aboelmakarem.pro/blog',
  'https://aboelmakarem.pro/blog/digital-transformation-roadmap-sme-egypt-gulf',
  'https://aboelmakarem.pro/blog/train-employees-executives-ai-accelerate-work',
  'https://aboelmakarem.pro/blog/train-employees-executives-ai-accelerate-work?lang=ar',
  'https://aboelmakarem.pro/apps',
  'https://aboelmakarem.pro/apps/pharmacy-manual',
  'https://aboelmakarem.pro/contact-info',
]

const auth = await getAuthenticatedClient('karem')
const sc = google.searchconsole({ version: 'v1', auth })
const wm = google.webmasters({ version: 'v3', auth })

const sm = (await wm.sitemaps.get({ siteUrl: SITE, feedpath: `${SITE}sitemap.xml` })).data
console.log(
  `SITEMAP  submitted=${sm.lastSubmitted}  downloaded=${sm.lastDownloaded}  urls=${sm.contents?.[0]?.submitted}  errors=${sm.errors}  warnings=${sm.warnings}  pending=${sm.isPending}`,
)
console.log('(the "indexed" counter of the Sitemaps API is not populated for this property; use the rows below)\n')

const urls = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_URLS
const pad = (s, n) => String(s ?? '').padEnd(n)
console.log(pad('URL', 78), pad('COVERAGE', 36), pad('LAST CRAWL', 22), 'CANONICAL OK  RICH')
for (const url of urls) {
  try {
    const r = await sc.urlInspection.index.inspect({ requestBody: { inspectionUrl: url, siteUrl: SITE } })
    const x = r.data.inspectionResult || {}
    const i = x.indexStatusResult || {}
    const canonOk = i.googleCanonical ? (i.googleCanonical === url ? 'yes' : `→ ${i.googleCanonical}`) : '-'
    const rich = x.richResultsResult ? `${x.richResultsResult.verdict} ${(x.richResultsResult.detectedItems || []).map((d) => d.richResultType).join(',')}` : '-'
    console.log(pad(url.replace('https://aboelmakarem.pro', ''), 78), pad(i.coverageState, 36), pad((i.lastCrawlTime || '-').slice(0, 19), 22), pad(canonOk, 13), rich)
  } catch (e) {
    console.log(pad(url, 78), 'ERROR', e.message)
  }
}
