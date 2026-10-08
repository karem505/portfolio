'use client'

import AssemblyVisual from '@/components/journey/AssemblyVisual'

import Image from 'next/image'
import { createTimeline, stagger } from 'animejs'
import { FaLinkedin, FaGithub, FaArrowDown } from 'react-icons/fa'
import { SiTypescript, SiPython, SiReact, SiNextdotjs, SiOpenai, SiDocker } from 'react-icons/si'
import { useLanguage } from '@/lib/LanguageContext'
import { useAnimeScope } from '@/lib/journey/useAnimeScope'
import { EASE_OUT, parallaxLayers } from '@/lib/journey/reveal'

const orbitIcons = [
  { Icon: SiTypescript, label: 'TypeScript' },
  { Icon: SiPython, label: 'Python' },
  { Icon: SiReact, label: 'React' },
  { Icon: SiNextdotjs, label: 'Next.js' },
  { Icon: SiOpenai, label: 'OpenAI' },
  { Icon: SiDocker, label: 'Docker' },
]

export default function Hero() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  // Intro (transform-only, so the LCP text paints before hydration) + layered
  // parallax as the hero scrolls out. The WebGL galaxy behind is driven by the
  // journey store, not by this component.
  const root = useAnimeScope<HTMLElement>((_, { motion, rtl }) => {
    const section = root.current
    if (!section || !motion) return

    createTimeline({ defaults: { ease: EASE_OUT } })
      .add('.hero-rise', { translateY: [18, 0], duration: 800, delay: stagger(80) }, 0)
      .add('.hero-rule', { scaleX: [0, 1], duration: 900 }, 0)
      .add('.hero-stack-icon', { translateX: [rtl ? -8 : 8, 0], duration: 500, delay: stagger(60) }, 200)
      .add('.hero-scroll-wire', { scaleX: [0, 1], duration: 700 }, 600)

    parallaxLayers(section, { enter: 'top top', leave: 'bottom top', fromZero: true })
  }, [language])

  return (
    <section
      ref={root}
      id="home"
      className="profile-hero relative min-h-[min(100vh,1100px)] flex items-center px-6 lg:px-10 pt-24 pb-16 border-b border-wire"
    >
      {/* Poster = instant paint (LCP-safe) and the no-WebGL / reduced-motion
          fallback. The fixed WebGL field lives behind the page; once it is live
          (html.field-ready) this poster fades out. */}
      <div
        aria-hidden="true"
        className="hero-poster absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.55]"
      >
        <Image src="/galaxy-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      {/* Scrims: darken the text side and anchor the bottom into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-ink via-ink/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-ink via-transparent to-ink/30"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div
          data-depth="0.05"
          className="hero-meta relative grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pb-5 mb-7 lg:pb-8 lg:mb-12 text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
          <span aria-hidden="true" className="hero-rule absolute inset-x-0 bottom-0 h-px bg-wire" />
          <div>
            <span className="text-ash/60">{t('file', 'الملف')}</span>{' '}
            <span className="text-paper">/karem.profile</span>
          </div>
          <div>
            <span className="text-ash/60">{t('role', 'الدور')}</span>{' '}
            <span className="text-paper">{t('full-stack · devops', 'مطور · ديف-أوبس')}</span>
          </div>
          <div>
            <span className="text-ash/60">{t('based', 'المقر')}</span>{' '}
            <span className="text-paper">{t('cairo · eg', 'القاهرة · مصر')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot" aria-hidden="true" />
            <span className="text-paper">{t('open · for · work', 'متاح · للعمل')}</span>
          </div>
        </div>

        <div className="hero-layout grid lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-20 items-center">
          <div className="hero-copy order-1">
            <div className="hero-identity">
            <span className="tab-eyebrow mb-4 lg:mb-8">
              001 · {t('engineer.profile', 'ملف.المهندس')}
            </span>

            {/* Name. Arabic uses Rubik (Arabic-pairing) at same scale. The two
                lines carry `hero-rise` (CSS-gated 18px transform → 0 on intro). */}
            {ar ? (
              <h1 className="font-rubik font-extrabold tracking-[-0.02em] leading-[1.05] text-paper mt-6 mb-8">
                <span className="hero-rise block text-[2.75rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.5rem] xl:text-[6rem]">
                  ابوالمكارم
                </span>
                <span className="hero-rise block text-[2.75rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.5rem] xl:text-[6rem]">
                  شهود
                  <span className="text-signal" aria-hidden="true">.</span>
                </span>
              </h1>
            ) : (
              <h1 className="font-mono font-extrabold tracking-[-0.05em] leading-[0.92] text-paper mt-6 mb-8">
                <span className="hero-rise block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                  Abo-Elmakarem
                </span>
                <span className="hero-rise block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                  Shohoud
                  <span className="text-signal" aria-hidden="true">.</span>
                </span>
              </h1>
            )}

            </div>
            <div
              className={`hero-bio text-base md:text-lg text-ash mb-10 leading-relaxed max-w-xl ${ar ? 'font-rubik' : 'font-mono'}`}
            >
              <p>
                {ar ? (
                  <>
                    المدير التقني (CTO) ومهندس Full-Stack في{' '}
                    <span className="text-paper underline decoration-signal decoration-1 underline-offset-4">
                      Ailigent
                    </span>
                    . أقود الهندسة والبنية السحابية وأُشغّل ثلاث منصات SaaS مدعومة بالذكاء الاصطناعي (Tornix.ai، Oravex.app، Costra) لعملاء في مصر والإمارات والسعودية.
                  </>
                ) : (
                  <>
                    Chief Technology Officer (CTO) and Full-Stack Engineer at{' '}
                    <span className="text-paper underline decoration-signal decoration-1 underline-offset-4">
                      Ailigent
                    </span>
                    . Leading engineering, cloud infrastructure and delivery of three production AI SaaS (Tornix.ai, Oravex.app, Costra) across EG · UAE · KSA.
                  </>
                )}
              </p>
            </div>

            <div className="hero-actions flex flex-wrap gap-3 mb-10">
              <a
                href="/Aboelmakarem_Portfolio.pdf"
                download="Aboelmakarem_Portfolio.pdf"
                className={`group inline-flex items-center gap-3 px-5 py-3 border border-paper bg-paper text-ink text-sm font-medium tracking-wide hover:bg-signal hover:text-paper hover:border-signal transition-colors duration-150 ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <span>{t('Download my portfolio', 'تحميل البورتفوليو')}</span>
                <span className="text-ink group-hover:text-paper">{ar ? '←' : '→'}</span>
              </a>
              <a
                href="https://wa.me/201008867488"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp (opens in new tab)"
                className={`group inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper text-sm font-medium tracking-wide hover:border-signal hover:text-signal transition-colors duration-150 ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <span>{t('Contact me on WhatsApp', 'راسلني على واتساب')}</span>
                <span dir="ltr" className={`whitespace-nowrap text-xs ${ar ? 'font-mono' : ''} text-ash group-hover:text-signal`}>+20 100 886 7488</span>
                <span className="text-ash group-hover:text-signal">↗</span>
              </a>
              <a
                href="#projects"
                className={`group inline-flex items-center gap-3 px-5 py-3 border border-wire text-ash text-sm tracking-wide hover:border-signal hover:text-signal transition-colors duration-150 ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <span>{t('View shipped work', 'استعرض المشاريع المنشورة')}</span>
              </a>
            </div>

            <div className="hero-socials flex items-center gap-4 text-xs font-mono uppercase tracking-[0.18em] text-ash">
              <span>{t('find ↦', 'تابعني ↦')}</span>
              <a
                href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ash hover:text-signal transition-colors duration-150 min-h-[44px]"
                aria-label="LinkedIn (opens in new tab)"
              >
                <FaLinkedin size={16} aria-hidden="true" />
                <span>linkedin</span>
              </a>
              <span aria-hidden="true" className="text-wire">/</span>
              <a
                href="https://github.com/karem505"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ash hover:text-signal transition-colors duration-150 min-h-[44px]"
                aria-label="GitHub (opens in new tab)"
              >
                <FaGithub size={16} aria-hidden="true" />
                <span>github</span>
              </a>
            </div>
          </div>

          {/* The profile photo is the LCP element — no enter animation. It sits on
              a near plane (negative depth) so it leads the scroll, and tilts under
              a fine pointer. */}
          <div data-depth="-0.18" className="hero-portrait order-2 relative flex flex-col items-center justify-center" style={{ perspective: '900px' }}>
            <div className="portrait-frame relative w-[280px] h-[360px] md:w-[320px] md:h-[420px]">
              <AssemblyVisual kind="portrait" />
              <span aria-hidden="true" className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-signal" />
              <span aria-hidden="true" className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-signal" />

              <div className="hero-photo relative w-full h-full overflow-hidden border border-wire bg-graphite">
                <Image
                  src="/profile.jpg"
                  alt={t('Abo-Elmakarem Shohoud', 'ابوالمكارم شهود')}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 599px) 210px, (max-width: 1023px) 220px, 350px"
                />
                <div className="absolute bottom-2 left-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-paper/80 mix-blend-difference">
                  frame 01 · 2026
                </div>
              </div>

              <div
                data-depth="-0.28"
                className="hero-tech-desktop hidden lg:grid absolute -right-14 top-0 bottom-0 grid-rows-6 gap-2"
                aria-label="Tech stack"
              >
                {orbitIcons.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="hero-stack-icon w-10 h-10 border border-wire flex items-center justify-center text-ash hover:border-signal hover:text-signal transition-colors duration-150"
                    title={label}
                  >
                    <Icon size={16} />
                  </div>
                ))}
              </div>

              <div className="hero-tech-mobile lg:hidden absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
                {orbitIcons.map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="w-9 h-9 border border-wire flex items-center justify-center text-ash"
                    title={label}
                  >
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          data-depth="0.2"
          className="mt-24 lg:mt-20 flex items-center gap-3 text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
          <span>{t('scroll', 'مرر')}</span>
          <FaArrowDown className="text-signal" size={10} />
          <span className="hero-scroll-wire h-px flex-1 max-w-[200px] bg-wire" />
          <span className="text-ash/60">002 / {t('about', 'نبذة')}</span>
        </div>
      </div>
    </section>
  )
}
