'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt4, HiX } from 'react-icons/hi'

const navLinks = [
  { name: 'Home', href: '#home', n: '01' },
  { name: 'About', href: '#about', n: '02' },
  { name: 'Experience', href: '#experience', n: '03' },
  { name: 'Projects', href: '#projects', n: '04' },
  { name: 'Blog', href: '/blog', n: '05' },
  { name: 'Contact', href: '#contact', n: '06' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-200 ${
          isScrolled ? 'bg-ink/85 backdrop-blur-md border-wire' : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between font-mono text-sm">
          {/* Logo — flat mono wordmark, NO gradient. Slash-bracketed "engineer
              file path" feel, single signal-red period as the brand mark. */}
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
                key={link.name}
                href={link.href}
                className="nav-link group inline-flex items-baseline gap-1.5"
              >
                <span className="text-ash/55 text-[0.7rem] tabular-nums">{link.n}</span>
                <span>{link.name.toLowerCase()}</span>
              </a>
            ))}
          </div>

          {/* Right cluster — language hint + CTA. Square button, no pill, no
              gradient. */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-paper bg-paper text-ink hover:bg-signal hover:border-signal hover:text-paper transition-colors duration-150 text-xs tracking-[0.04em] font-medium"
            >
              <span>get · in · touch</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-paper hover:text-signal transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiX size={22} /> : <HiMenuAlt4 size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 md:hidden bg-ink"
          >
            <div className="relative h-full flex flex-col justify-center px-8 font-mono">
              {/* spec heading */}
              <div className="mb-10 pb-4 border-b border-wire text-[0.7rem] tracking-[0.18em] uppercase text-ash">
                <span className="text-signal">▍</span>{' '}
                <span>navigation</span>
              </div>
              <ul className="flex flex-col gap-5">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-baseline gap-4 text-paper text-3xl font-extrabold tracking-[-0.04em] hover:text-signal transition-colors"
                    >
                      <span className="text-ash/55 text-sm tabular-nums">{link.n}</span>
                      <span>{link.name.toLowerCase()}</span>
                      <span className="ml-auto opacity-0 group-hover:opacity-100 text-signal transition-opacity">→</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-12 inline-flex items-center justify-between px-5 py-4 border border-paper bg-paper text-ink hover:bg-signal hover:border-signal hover:text-paper transition-colors duration-150 text-sm font-medium"
              >
                <span>get in touch</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
