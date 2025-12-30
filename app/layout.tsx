import type { Metadata, Viewport } from 'next'
import './globals.css'
import { spaceGrotesk, syne } from './fonts'
import {
  PersonJsonLd,
  WebsiteJsonLd,
  OrganizationJsonLd,
  ProfessionalServiceJsonLd,
  BreadcrumbJsonLd,
} from '@/components/JsonLd'

const siteUrl = 'https://abo-elmakarem.netlify.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Abo-Elmakarem Shohoud | AI Automation Expert & Voice Agent Developer',
    template: '%s | Abo-Elmakarem Shohoud',
  },

  description:
    'Abo-Elmakarem Shohoud (كارم شهود) - CEO @ Ailigent. AI Automation Expert, RPA Developer, DevOps Engineer & Full-Stack Developer in Egypt. Specializing in Voice Agents, LiveKit, OpenAI, Frontend, Backend development. Helping businesses cut costs by 70%.',

  keywords: [
    // Name variations (English & Arabic)
    'Abo-Elmakarem',
    'Abo-Elmakarem Shohoud',
    'Abo Elmakarem',
    'Karem Shohoud',
    'karem shohoud',
    'كارم شهود',
    'ابوالمكارم شهود',
    // AI & Automation
    'AI Automation Expert',
    'AI Automation Expert Egypt',
    'AI Developer',
    'AI Developer Egypt',
    'Voice Agent Developer',
    'Voice Agents',
    'LiveKit Developer',
    'OpenAI Realtime API',
    'Machine Learning Developer',
    'Ailigent',
    'Business Automation',
    'AI Solutions Egypt',
    // RPA
    'RPA Developer',
    'RPA Developer Egypt',
    'RPA Automation',
    'Robotic Process Automation',
    'UiPath Developer',
    // DevOps
    'DevOps Engineer',
    'DevOps Engineer Egypt',
    'DevOps Egypt',
    'CI/CD',
    'Docker',
    'Kubernetes',
    // Full-Stack & Web
    'Full-Stack Developer',
    'Full-Stack Developer Egypt',
    'Frontend Developer',
    'Frontend Developer Egypt',
    'Backend Developer',
    'Backend Developer Egypt',
    'Cairo Developer',
    'Python Developer',
    'TypeScript Developer',
    'Next.js Developer',
    'React Developer',
    'Node.js Developer',
    'FastAPI Developer',
  ],

  authors: [{ name: 'Abo-Elmakarem Shohoud', url: siteUrl }],
  creator: 'Abo-Elmakarem Shohoud',
  publisher: 'Abo-Elmakarem Shohoud',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Abo-Elmakarem Shohoud Portfolio',
    title: 'Abo-Elmakarem Shohoud | AI Automation Expert & Voice Agent Developer',
    description:
      'CEO @ Ailigent | Helping businesses cut costs by 70% using AI & Automation. Expert in Voice Agents, LiveKit, OpenAI Realtime API.',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@karem_shohud',
    creator: '@karem_shohud',
    title: 'Abo-Elmakarem Shohoud | AI Automation Expert',
    description:
      'CEO @ Ailigent | AI Automation Expert helping businesses cut costs by 70%',
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  manifest: '/site.webmanifest',

  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${spaceGrotesk.variable} ${syne.variable}`}>
      <head>
        <PersonJsonLd />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <ProfessionalServiceJsonLd />
        <BreadcrumbJsonLd />
      </head>
      <body className="bg-[#0a0a0a] text-white antialiased noise">
        {children}
      </body>
    </html>
  )
}
