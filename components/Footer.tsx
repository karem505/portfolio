'use client'

import { FaLinkedin, FaGithub } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative px-6 lg:px-10 pt-16 pb-10 border-t border-wire bg-ink">
      <div className="max-w-7xl mx-auto font-mono">
        {/* Top spec band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 pb-10 mb-10 border-b border-wire text-[0.7rem] tracking-[0.18em] uppercase text-ash">
          <div>
            <span className="text-ash/60">role</span>
            <div className="text-paper mt-1 normal-case tracking-normal">Full-Stack Developer</div>
          </div>
          <div>
            <span className="text-ash/60">company</span>
            <div className="text-paper mt-1 normal-case tracking-normal">Ailigent</div>
          </div>
          <div>
            <span className="text-ash/60">based</span>
            <div className="text-paper mt-1 normal-case tracking-normal">Cairo, Egypt</div>
          </div>
          <div>
            <span className="text-ash/60">version</span>
            <div className="text-paper mt-1 normal-case tracking-normal">v.{currentYear}.04</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Wordmark */}
          <a
            href="#home"
            className="group flex items-baseline gap-1 text-paper hover:text-signal transition-colors"
            aria-label="Abo-Elmakarem — home"
          >
            <span className="font-extrabold tracking-[-0.04em] text-2xl">karem</span>
            <span className="text-signal font-extrabold text-2xl">.</span>
            <span className="text-ash text-sm tracking-[0.04em]">pro</span>
          </a>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {[
              { label: 'home', href: '#home' },
              { label: 'about', href: '#about' },
              { label: 'projects', href: '#projects' },
              { label: 'contact', href: '#contact' },
              { label: 'blog', href: '/blog' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-ash hover:text-signal transition-colors py-3 -my-3"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={14} />
            </a>
            <a
              href="https://github.com/karem505"
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={14} />
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-10 pt-8 border-t border-wire flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-ash">
          <p>
            © {currentYear} Abo-Elmakarem Shohoud · Full-Stack Developer at{' '}
            <span className="text-paper">Ailigent</span> · DevOps · Scrum Master · Business Analyst
          </p>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="hover:text-signal transition-colors py-3 -my-3">privacy</a>
            <span className="text-wire" aria-hidden="true">/</span>
            <a href="/refund" className="hover:text-signal transition-colors py-3 -my-3">refund</a>
            <span className="text-wire" aria-hidden="true">/</span>
            <a href="/contact-info" className="hover:text-signal transition-colors py-3 -my-3">contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
