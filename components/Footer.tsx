'use client'

import { FaLinkedin, FaGithub } from 'react-icons/fa'
import { useLanguage } from '@/lib/LanguageContext'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  // Homepage section anchors are written as absolute "/#id" so they also work
  // when the Footer is rendered on subpages (e.g. the service landing pages).
  const links = [
    { label: t('home', 'الرئيسية'), href: '/' },
    { label: t('about', 'نبذة'), href: '/#about' },
    { label: t('Digital Transformation', 'التحول الرقمي'), href: '/digital-transformation' },
    { label: t('AI Training', 'تدريب الذكاء الاصطناعي'), href: '/ai-training' },
    { label: t('projects', 'المشاريع'), href: '/#projects' },
    { label: t('contact', 'تواصل'), href: '/#contact' },
    { label: t('blog', 'المدونة'), href: '/blog' },
  ]

  return (
    <footer className="relative px-6 lg:px-10 pt-16 pb-10 border-t border-wire bg-ink">
      <div className={`max-w-7xl mx-auto ${ar ? 'font-rubik' : 'font-mono'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 pb-10 mb-10 border-b border-wire text-[0.7rem] tracking-[0.18em] uppercase text-ash">
          <div>
            <span className="text-ash/60">{t('role', 'الدور')}</span>
            <div className="text-paper mt-1 normal-case tracking-normal">
              {t('Full-Stack Developer', 'مطور Full-Stack')}
            </div>
          </div>
          <div>
            <span className="text-ash/60">{t('company', 'الشركة')}</span>
            <div className="text-paper mt-1 normal-case tracking-normal">Ailigent</div>
          </div>
          <div>
            <span className="text-ash/60">{t('based', 'المقر')}</span>
            <div className="text-paper mt-1 normal-case tracking-normal">
              {t('Cairo, Egypt', 'القاهرة، مصر')}
            </div>
          </div>
          <div>
            <span className="text-ash/60">{t('version', 'الإصدار')}</span>
            <div className="text-paper mt-1 normal-case tracking-normal font-mono">v.{currentYear}.04</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <a
            href="/"
            className="group flex items-baseline gap-1 text-paper hover:text-signal transition-colors font-mono"
            aria-label="Abo-Elmakarem — home"
          >
            <span className="font-extrabold tracking-[-0.04em] text-2xl">karem</span>
            <span className="text-signal font-extrabold text-2xl">.</span>
            <span className="text-ash text-sm tracking-[0.04em]">pro</span>
          </a>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-ash hover:text-signal transition-colors py-3 -my-3"
              >
                {language === 'ar' ? link.label : link.label.toLowerCase()}
              </a>
            ))}
          </nav>

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

        <div className="mt-10 pt-8 border-t border-wire flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-ash">
          <p>
            © {currentYear}{' '}
            {ar ? 'ابوالمكارم شهود · مطور Full-Stack في' : 'Abo-Elmakarem Shohoud · Full-Stack Developer at'}{' '}
            <span className="text-paper">Ailigent</span>
            {ar ? ' · DevOps · Scrum Master · محلل أعمال' : ' · DevOps · Scrum Master · Business Analyst'}
          </p>
          <div className="flex items-center gap-3">
            <a href="/privacy" className="hover:text-signal transition-colors py-3 -my-3">
              {t('privacy', 'الخصوصية')}
            </a>
            <span className="text-wire" aria-hidden="true">/</span>
            <a href="/refund" className="hover:text-signal transition-colors py-3 -my-3">
              {t('refund', 'الاسترداد')}
            </a>
            <span className="text-wire" aria-hidden="true">/</span>
            <a href="/contact-info" className="hover:text-signal transition-colors py-3 -my-3">
              {t('contact', 'تواصل')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
