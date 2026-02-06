import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

async function loadArabicFont(): Promise<ArrayBuffer> {
  const res = await fetch(
    'https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l3sQWIHPqzCfyG2vu3CBFQLaig.ttf'
  )
  return res.arrayBuffer()
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const lang = searchParams.get('lang') || 'en'
  const isArabic = lang === 'ar'

  let title = searchParams.get('title') || 'Blog Post'
  const category = searchParams.get('category') || ''
  const rawDate = searchParams.get('date')
  const date = rawDate
    ? new Date(rawDate).toLocaleDateString(
        isArabic ? 'ar-EG' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : ''

  // Truncate title if too long
  if (title.length > 80) {
    title = title.substring(0, 77) + '...'
  }

  const fonts: { name: string; data: ArrayBuffer; style: 'normal' }[] = []

  if (isArabic) {
    const arabicFont = await loadArabicFont()
    fonts.push({ name: 'NotoSansArabic', data: arabicFont, style: 'normal' as const })
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '60px',
          fontFamily: isArabic ? 'NotoSansArabic' : 'sans-serif',
          direction: isArabic ? 'rtl' : 'ltr',
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
          }}
        />

        {/* Top section: Category + Date */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {category && (
            <div
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                fontSize: '20px',
                color: '#818cf8',
                fontWeight: 600,
              }}
            >
              {category}
            </div>
          )}
          {date && (
            <div style={{ fontSize: '18px', color: '#71717a' }}>
              {date}
            </div>
          )}
        </div>

        {/* Middle section: Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            zIndex: 1,
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          <div
            style={{
              fontSize: title.length > 50 ? '40px' : '48px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.3,
              letterSpacing: isArabic ? '0' : '-0.5px',
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom section: Branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Profile circle */}
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              AE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '20px', color: '#ffffff', fontWeight: 600 }}>
                Abo-Elmakarem Shohoud
              </div>
              <div style={{ fontSize: '16px', color: '#6366f1' }}>
                aboelmakarem.pro
              </div>
            </div>
          </div>

          {/* Language badge */}
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '50px',
              background: isArabic
                ? 'rgba(236, 72, 153, 0.2)'
                : 'rgba(99, 102, 241, 0.2)',
              border: `1px solid ${isArabic ? 'rgba(236, 72, 153, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
              fontSize: '16px',
              color: isArabic ? '#f472b6' : '#818cf8',
              fontWeight: 600,
            }}
          >
            {isArabic ? 'عربي' : 'English'}
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '60px',
            right: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)',
            opacity: 0.3,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: fonts.length > 0 ? fonts : undefined,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'CDN-Cache-Control': 'no-cache',
        'Netlify-CDN-Cache-Control': 'no-cache',
      },
    }
  )
}
