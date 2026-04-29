import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import RecentPosts from '@/components/RecentPosts'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import {
  ProfessionalServiceJsonLd,
  BreadcrumbJsonLd,
  FAQPageJsonLd,
} from '@/components/JsonLd'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink">
      <ProfessionalServiceJsonLd />
      <BreadcrumbJsonLd />
      <FAQPageJsonLd />

      {/* No background orbs, no animated gradient. The lane is "engineer's
          terminal at 2am" — flat ink with a hairline column rule, not a
          purple-orb wallpaper. */}

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
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
