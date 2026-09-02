import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Services from '@/components/Services'
import RecentPosts from '@/components/RecentPosts'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ArabicSeoContent from '@/components/ArabicSeoContent'
import JourneyStage from '@/components/journey/JourneyStage'
import {
  ProfessionalServiceJsonLd,
  BreadcrumbJsonLd,
  FAQPageJsonLd,
} from '@/components/JsonLd'

const siteUrl = 'https://aboelmakarem.pro'

// Homepage hreflang lives here (per-page) rather than raw-injected in the root
// layout, so each route emits exactly one correct hreflang set instead of the
// homepage's hreflang leaking onto every subpage. The homepage is a single
// server-URL bilingual page (English HTML + an always-rendered .sr-only Arabic
// block, toggled client-side), so en/ar/x-default legitimately resolve to the
// same `/` URL. (Next normalizes the root-path `?lang=ar` to `/`; the distinct
// `/?lang=ar` URL is still listed in the sitemap for discovery.)
export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
    languages: {
      en: siteUrl,
      'en-US': siteUrl,
      ar: `${siteUrl}/?lang=ar`,
      'ar-EG': `${siteUrl}/?lang=ar`,
      'x-default': siteUrl,
    },
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
}

export default function Home() {
  return (
    <main className="journey-main relative min-h-screen bg-ink">
      <ProfessionalServiceJsonLd />
      <BreadcrumbJsonLd />
      <FAQPageJsonLd />

      {/* Fixed WebGL depth field (galaxy → lattice), behind the z-10 content.
          Lazy, idle-mounted, gated on html.motion + WebGL2. Never SSR content. */}
      <JourneyStage />

      {/* Always-rendered Arabic SEO block — keeps Arabic queries indexable
          regardless of the EN/AR toggle state on first render. */}
      <ArabicSeoContent />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Services />
        <Suspense fallback={<div className="py-32" />}>
          <RecentPosts />
        </Suspense>
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
