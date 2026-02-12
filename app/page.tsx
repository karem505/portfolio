import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Testimonials from '@/components/Testimonials'
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
    <main className="relative min-h-screen overflow-hidden">
      <ProfessionalServiceJsonLd />
      <BreadcrumbJsonLd />
      <FAQPageJsonLd />
      {/* Background Effects */}
      <div className="fixed inset-0 animated-gradient opacity-50" />

      {/* Gradient Orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Testimonials />
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
