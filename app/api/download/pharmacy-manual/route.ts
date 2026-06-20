// app/api/download/pharmacy-manual/route.ts
import { NextResponse } from 'next/server'
import { getLatestApk } from '@/lib/latestApk'

// Re-resolve at most hourly (matches the resolver's fetch cache).
export const revalidate = 3600

export async function GET() {
  const apk = await getLatestApk()
  return NextResponse.redirect(apk.downloadUrl, 302)
}
