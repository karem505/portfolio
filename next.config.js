/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      // News source image domains for blog
      { protocol: 'https', hostname: 'platform.theverge.com' },
      { protocol: 'https', hostname: 'media2.dev.to' },
      { protocol: 'https', hostname: 'wp.technologyreview.com' },
      { protocol: 'https', hostname: 's.w.org' },
      // Wildcard patterns for flexibility
      { protocol: 'https', hostname: '**.theverge.com' },
      { protocol: 'https', hostname: '**.dev.to' },
      { protocol: 'https', hostname: '**.technologyreview.com' },
      { protocol: 'https', hostname: '**.wp.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Security headers for better SEO trust signals
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // `/apps` has no index page (there is currently one app). Send the bare
  // parent path to the app's page instead of a 404. Temporary (307) on purpose
  // — when more apps exist, replace this with a real `/apps` hub listing.
  async redirects() {
    return [
      {
        source: '/apps',
        destination: '/apps/pharmacy-manual',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
