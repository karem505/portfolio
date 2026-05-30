import type { Metadata, Viewport } from 'next'
import './globals.css'
import { jetBrainsMono, rubik } from './fonts'
import {
  PersonJsonLd,
  WebsiteJsonLd,
  OrganizationJsonLd,
} from '@/components/JsonLd'
import ClickEffect from '@/components/ClickEffect'
import { GoogleAnalytics } from '@/components/Analytics'
import { LanguageProvider } from '@/lib/LanguageContext'

const siteUrl = 'https://aboelmakarem.pro'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Abo-Elmakarem Shohoud · ابوالمكارم شهود | Full-Stack Developer & AI Automation Expert',
    template: '%s | Abo-Elmakarem Shohoud',
  },

  description:
    'Abo-Elmakarem Shohoud (ابوالمكارم شهود · كارم شهود) — مطور Full-Stack ومهندس DevOps و Scrum Master في Ailigent. Full-Stack Developer, DevOps Engineer & Scrum Master shipping AI-powered SaaS (Tornix.ai, Oravex.app, Costra.ailigent.ai) for clients across Egypt, UAE, and KSA.',

  keywords: [
    // Name variations (English & Arabic)
    'Abo-Elmakarem',
    'Abo-Elmakarem Shohoud',
    'Abo Elmakarem',
    'Karem Shohoud',
    'karem shohoud',
    'كارم شهود',
    'ابوالمكارم شهود',
    // Ailigent products
    'Ailigent',
    'Tornix',
    'Tornix.ai',
    'Oravex',
    'Oravex.app',
    'Costra',
    'Costra.ailigent.ai',
    // AI & Automation
    'AI Automation Expert',
    'AI Automation Expert Egypt',
    'AI Developer',
    'AI Developer Egypt',
    'Voice Agent Developer',
    'Voice Agents',
    'LiveKit Agents',
    'OpenAI Realtime API',
    'MCP Model Context Protocol',
    'Tavus',
    'Business Automation',
    'AI Solutions Egypt',
    // Scrum & Business Analyst
    'Scrum Master',
    'Scrum Master Egypt',
    'Business Analyst',
    'Business Analyst Egypt',
    'Product Ownership',
    'Digital Transformation',
    // DevOps
    'DevOps Engineer',
    'DevOps Engineer Egypt',
    'DevOps Egypt',
    'CI/CD',
    'Docker',
    'GitHub Actions',
    'AWS EC2',
    'Railway',
    'Nginx',
    // Full-Stack & Web
    'Full-Stack Developer',
    'Full-Stack Developer Egypt',
    'Frontend Developer',
    'Backend Developer',
    'Cairo Developer',
    'Python Developer',
    'TypeScript Developer',
    'Next.js Developer',
    'React Developer',
    'Node.js Developer',
    'FastAPI Developer',
    'Flutter Developer',
    // Domain
    'CPM Gantt',
    'Critical Path Method',
    'Primavera P6',
    'XER',
    'Odoo 18 Developer',
    'ERP Developer',
    // Digital Transformation services (EN + AR)
    'Digital Transformation Consultant',
    'Digital Transformation Consulting',
    'Digital Transformation Egypt',
    'Digital Transformation UAE',
    'Digital Transformation Saudi Arabia',
    'Business Process Automation',
    'Workflow Automation Consultant',
    'استشارات التحول الرقمي',
    'خدمات التحول الرقمي للشركات',
    'التحول الرقمي للشركات',
    'أتمتة العمليات',
    // Corporate AI Training (EN + AR)
    'AI Training',
    'Corporate AI Training',
    'AI Training for Employees',
    'AI Training for Executives',
    'Executive AI Training',
    'AI Upskilling',
    'Generative AI Training',
    'Prompt Engineering Training',
    'ChatGPT Training for Business',
    'AI Workshop',
    'تدريب الذكاء الاصطناعي للشركات',
    'تدريب الموظفين على الذكاء الاصطناعي',
    'دورة الذكاء الاصطناعي للمدراء التنفيذيين',
    'ورش عمل الذكاء الاصطناعي',
    'تدريب الذكاء الاصطناعي التوليدي',
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
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ar_EG'],
    url: siteUrl,
    siteName: 'Abo-Elmakarem Shohoud Portfolio',
    title: 'Abo-Elmakarem Shohoud | ابوالمكارم شهود — Full-Stack Developer & AI Automation Expert',
    description:
      'Abo-Elmakarem Shohoud (ابوالمكارم شهود) — Full-Stack Developer, DevOps Engineer & Scrum Master at Ailigent. Shipping AI-powered SaaS (Tornix.ai, Oravex.app, Costra.ailigent.ai) across Egypt, UAE, and KSA.',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@karem_shohud',
    creator: '@karem_shohud',
    title: 'Abo-Elmakarem Shohoud | Full-Stack Developer & AI Automation Expert',
    description:
      'Full-Stack Developer, DevOps Engineer & Scrum Master at Ailigent. AI-powered SaaS for clients across Egypt, UAE, and KSA.',
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

  verification: {
    google: 'GaInkdmpzw7MEq3aHdmiRCSHfVzHxZweUCxFQwGhLtU',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ff3b1f' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
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
    <html lang="en" className={`scroll-smooth ${jetBrainsMono.variable} ${rubik.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://zklvvwugirvwimxdvybw.supabase.co" />
        {/* hreflang is now set per-page via metadata `alternates.languages`
            (the homepage in app/page.tsx, service pages in their own
            generateMetadata). Next 14.2 preserves the ?lang=ar query, so the
            old raw-injection workaround is no longer needed — and injecting it
            here would wrongly apply the homepage's hreflang to every subpage. */}
        <PersonJsonLd />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className="bg-ink text-paper antialiased">
        <GoogleAnalytics />
        <ClickEffect />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
