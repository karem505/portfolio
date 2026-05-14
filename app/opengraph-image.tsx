import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Abo-Elmakarem Shohoud'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const photoUrl = 'https://aboelmakarem.pro/profile.jpg'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#0a0a0a',
        }}
      >
        <img
          src={photoUrl}
          alt=""
          width={1200}
          height={630}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
