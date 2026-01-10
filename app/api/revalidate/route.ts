import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, path } = body

    // Validate secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate the specified path or default to /blog
    const pathToRevalidate = path || '/blog'
    revalidatePath(pathToRevalidate)

    return NextResponse.json({
      revalidated: true,
      path: pathToRevalidate,
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
  const path = searchParams.get('path')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret' },
      { status: 401 }
    )
  }

  const pathToRevalidate = path || '/blog'
  revalidatePath(pathToRevalidate)

  return NextResponse.json({
    revalidated: true,
    path: pathToRevalidate,
    timestamp: new Date().toISOString(),
  })
}
