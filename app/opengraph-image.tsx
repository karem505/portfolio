import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Abo-Elmakarem Shohoud - AI Automation Expert'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
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

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Profile circle with gradient border */}
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
              padding: '4px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '142px',
                height: '142px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#6366f1',
              }}
            >
              AE
            </div>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}
          >
            Abo-Elmakarem Shohoud
          </div>

          {/* Title with gradient */}
          <div
            style={{
              fontSize: '32px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
            }}
          >
            AI Automation Expert
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '24px',
              color: '#a1a1aa',
              marginBottom: '30px',
            }}
          >
            CEO @ Ailigent | Voice Agents | Full-Stack Developer
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '50px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <div style={{ fontSize: '20px', color: '#6366f1' }}>
              Helping businesses cut costs by 70% using AI
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            right: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)',
            opacity: 0.5,
          }}
        />

        {/* Corner accent */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}
          />
          <div style={{ fontSize: '16px', color: '#6366f1', fontWeight: '500' }}>
            abo-elmakarem.netlify.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
