'use client'

import { useState, useEffect, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { HiMenuAlt4, HiX } from 'react-icons/hi'
import { useLanguage } from '@/lib/LanguageContext'
import { useJourneyChapter } from '@/lib/journey/store'
import LanguageToggle from './LanguageToggle'

export default function Navbar() {
  const { t, language } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const chapter = useJourneyChapter()
  // Only the homepage has chapter sections; elsewhere nothing is "current".
  const currentHref = pathname === '/' ? `#${chapter}` : null

  const navLinks = [
    { name: t('Home', 'الرئيسية'), href: '#home', n: '01' },
    { name: t('About', 'نبذة'), href: '#about', n: '02' },
    { name: t('Experience', 'الخبرات'), href: '#experience', n: '03' },
    { name: t('Projects', 'المشاريع'), href: '#projects', n: '04' },
    { name: t('Services', 'الخدمات'), href: '#services', n: '05' },
    { name: t('Blog', 'المدونة'), href: '/blog', n: '06' },
    { name: t('Contact', 'تواصل'), href: '#contact', n: '07' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`nav-enter fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-200 ${
          isScrolled ? 'bg-ink/85 backdrop-blur-md border-wire' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between font-mono text-sm">
          <a
            href="#home"
            className="group flex items-baseline gap-1 text-paper hover:text-signal transition-colors duration-150"
            aria-label="Abo-Elmakarem — home"
          >
            <span className="font-extrabold tracking-[-0.04em] text-base">karem</span>
            <span className="text-signal font-extrabold">.</span>
            <span className="text-ash text-xs tracking-[0.04em]">pro</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.href === currentHref ? 'location' : undefined}
                className="nav-link group inline-flex items-baseline gap-1.5"
              >
                <span className="text-ash/55 text-[0.7rem] tabular-nums">{link.n}</span>
                <span className={language === 'ar' ? 'font-rubik' : ''}>
                  {language === 'ar' ? link.name : link.name.toLowerCase()}
                </span>
              </a>
            ))}
          </div>

          {/* Right cluster — language toggle + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-paper bg-paper text-ink hover:bg-signal hover:border-signal hover:text-paper transition-colors duration-150 text-xs tracking-[0.04em] font-medium"
            >
              <span className={language === 'ar' ? 'font-rubik' : ''}>
                {t('get · in · touch', 'تواصل · معي')}
              </span>
              <span aria-hidden="true">{language === 'ar' ? '←' : '→'}</span>
            </a>
          </div>

          {/* Mobile cluster — toggle + menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle compact />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-paper hover:text-signal transition-colors min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {isMobileMenuOpen ? <HiX size={22} aria-hidden="true" /> : <HiMenuAlt4 size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
        {/* 1px page-progress wire, driven by the --journey-p CSS var (no re-render). */}
        <span className="journey-wire" aria-hidden="true" />
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
          <div
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="menu-enter fixed inset-0 z-40 md:hidden bg-ink"
          >
            <div className="relative h-full flex flex-col justify-center px-8 font-mono">
              <div className="mb-10 pb-4 border-b border-wire text-[0.7rem] tracking-[0.18em] uppercase text-ash">
                <span className="text-signal">▍</span>{' '}
                <span>{t('navigation', 'القائمة')}</span>
              </div>
              <ul className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <li
                    key={link.href}
                    className="menu-item-enter"
                    style={{ '--i': index } as CSSProperties}
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-baseline gap-4 text-paper text-3xl font-extrabold tracking-[-0.04em] hover:text-signal transition-colors ${
                        language === 'ar' ? 'font-rubik' : ''
                      }`}
                    >
                      <span className="text-ash/55 text-sm tabular-nums">{link.n}</span>
                      <span>{language === 'ar' ? link.name : link.name.toLowerCase()}</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 text-signal transition-opacity">
                        {language === 'ar' ? '←' : '→'}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mt-12 inline-flex items-center justify-between px-5 py-4 border border-paper bg-paper text-ink hover:bg-signal hover:border-signal hover:text-paper transition-colors duration-150 text-sm font-medium ${
                  language === 'ar' ? 'font-rubik' : ''
                }`}
              >
                <span>{t('get in touch', 'تواصل معي')}</span>
                <span>{language === 'ar' ? '←' : '→'}</span>
              </a>
            </div>
          </div>
      )}
    </>
  )
}
