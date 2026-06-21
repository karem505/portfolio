import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Revalidate one or more comma-separated `path`s and/or a cache `tag`.
 * Backward compatible: a single `path` still works, and with neither `path`
 * nor `tag` it defaults to `/blog` (the original behavior).
 */
function doRevalidate(path: string | null, tag: string | null) {
  const result: { paths: string[]; tags: string[] } = { paths: [], tags: [] }

  const paths = (path ?? (tag ? '' : '/blog'))
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  for (const p of paths) {
    revalidatePath(p)
    result.paths.push(p)
  }

  if (tag) {
    revalidateTag(tag)
    result.tags.push(tag)
  }

  return result
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, path, tag } = body

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    const result = doRevalidate(path ?? null, tag ?? null)

    return NextResponse.json({
      revalidated: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}

// Also support GET for simple webhook triggers
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const result = doRevalidate(searchParams.get('path'), searchParams.get('tag'))

  return NextResponse.json({
    revalidated: true,
    ...result,
    timestamp: new Date().toISOString(),
  })
}
