// app/api/download/pharmacy-manual/route.ts
import { NextResponse } from 'next/server'
import { getLatestApk } from '@/lib/latestApk'

// Always re-resolve on each request so the download link is never a stale
// cached 302. The underlying GitHub lookup is still cached (5 min) by
// getLatestApk, so this re-runs cheaply and stays well under the rate limit.
export const dynamic = 'force-dynamic'

export async function GET() {
  const apk = await getLatestApk()
  return NextResponse.redirect(apk.downloadUrl, 302)
}
