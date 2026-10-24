#!/usr/bin/env node
/**
 * Search performance in the target Western markets (US, UK, Canada, Australia).
 *
 * Prints, per country, clicks / impressions / CTR / average position for the
 * current window and the previous window of the same length, plus the top
 * queries and pages per country. Uses the gwcli "karem" profile's OAuth token.
 *
 *   node scripts/gsc-markets.mjs            # last 28 days vs the 28 before
 *   node scripts/gsc-markets.mjs 14         # last 14 days vs the 14 before
 */
import { homedir } from 'node:os'
import { join } from 'node:path'

const CLI = join(homedir(), 'google-workspace-cli')
const { getAuthenticatedClient } = await import(join(CLI, 'dist/lib/auth.js'))
const { google } = await import(join(CLI, 'node_modules/googleapis/build/src/index.js'))

const SITE = 'https://aboelmakarem.pro/'
const MARKETS = { usa: 'United States', gbr: 'United Kingdom', can: 'Canada', aus: 'Australia' }
const days = Number(process.argv[2] || 28)

const iso = (d) => d.toISOString().slice(0, 10)
const end = new Date(Date.now() - 2 * 864e5) // GSC data lags ~2 days
const start = new Date(end.getTime() - (days - 1) * 864e5)
const pEnd = new Date(start.getTime() - 864e5)
const pStart = new Date(pEnd.getTime() - (days - 1) * 864e5)

const auth = await getAuthenticatedClient('karem')
const wm = google.webmasters({ version: 'v3', auth })

async function q(s, e, dimensions, country, rowLimit = 10) {
  const requestBody = { startDate: iso(s), endDate: iso(e), dimensions, rowLimit }
  if (country) requestBody.dimensionFilterGroups = [{ filters: [{ dimension: 'country', operator: 'equals', expression: country }] }]
  const r = await wm.searchanalytics.query({ siteUrl: SITE, requestBody })
  return r.data.rows || []
}

const fmt = (r) => r ? `${r.clicks} clicks · ${r.impressions} impr · CTR ${(r.ctr * 100).toFixed(1)}% · pos ${r.position.toFixed(1)}` : '0 clicks · 0 impr'
console.log(`Window ${iso(start)} → ${iso(end)} (previous: ${iso(pStart)} → ${iso(pEnd)})\n`)
for (const [code, name] of Object.entries(MARKETS)) {
  const [cur] = await q(start, end, [], code)
  const [prev] = await q(pStart, pEnd, [], code)
  console.log(`■ ${name}: ${fmt(cur)}   (prev: ${fmt(prev)})`)
  for (const r of await q(start, end, ['query'], code, 5)) console.log(`    q  ${r.keys[0]}  — ${r.impressions} impr, pos ${r.position.toFixed(1)}`)
  for (const r of await q(start, end, ['page'], code, 3)) console.log(`    p  ${r.keys[0].replace('https://aboelmakarem.pro', '') || '/'}  — ${r.impressions} impr, ${r.clicks} clicks`)
}
const rat = await q(start, end, ['country'], null, 50)
const page = (await q(start, end, ['page'], null, 500)).find((r) => r.keys[0].includes('/remote-ai-training'))
console.log(`\n/remote-ai-training overall: ${fmt(page)}`)
console.log(`All countries in window: ${rat.length}`)
