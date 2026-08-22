'use client'

import { motion, useScroll, useReducedMotion, type MotionValue } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { FaLinkedin, FaGithub, FaArrowDown } from 'react-icons/fa'
import { SiTypescript, SiPython, SiReact, SiNextdotjs, SiOpenai, SiDocker } from 'react-icons/si'
import { useLanguage } from '@/lib/LanguageContext'

const orbitIcons = [
  { Icon: SiTypescript, label: 'TypeScript' },
  { Icon: SiPython, label: 'Python' },
  { Icon: SiReact, label: 'React' },
  { Icon: SiNextdotjs, label: 'Next.js' },
  { Icon: SiOpenai, label: 'OpenAI' },
  { Icon: SiDocker, label: 'Docker' },
]

// Desktop galaxy: the full 2 MB clip, scroll-scrubbed. Its playback position
// tracks scroll — rotation forward on the way down, reversed on the way up.
// SENSITIVITY > 1 runs the whole rotation over a shorter scroll distance.
// Mounted only on desktop, after hydration, so it never touches the critical path.
function DesktopGalaxy({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true

    const SENSITIVITY = 2
    let raf = 0
    let target = 0

    const seek = () => {
      raf = 0
      if (v.duration && Number.isFinite(v.duration)) v.currentTime = target
    }
    const update = (p: number) => {
      const d = v.duration
      if (!d || !Number.isFinite(d)) return
      target = Math.min(Math.max(p * SENSITIVITY, 0), 1) * d
      if (!raf) raf = requestAnimationFrame(seek)
    }
    const start = () => {
      // prime the decoder so seeked frames actually paint
      v.play().then(() => v.pause()).catch(() => {})
      update(scrollYProgress.get())
    }

    if (v.readyState >= 1) start()
    else v.addEventListener('loadedmetadata', start, { once: true })
    const unsub = scrollYProgress.on('change', update)

    return () => {
      unsub()
      if (raf) cancelAnimationFrame(raf)
      v.removeEventListener('loadedmetadata', start)
    }
  }, [scrollYProgress])

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      onLoadedData={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
    >
      <source src="/galaxy.mp4" type="video/mp4" />
    </video>
  )
}

// Mobile galaxy: a small 255 KB muted loop that autoplays (no scroll-scrub, so
// no per-scroll decode/reflow on phones). Mounted only on mobile, after
// hydration; the poster underneath carries the LCP while this fades in.
function MobileGalaxy() {
  const [ready, setReady] = useState(false)
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onPlaying={() => setReady(true)}
      onLoadedData={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
    >
      <source src="/galaxy-mobile.mp4" type="video/mp4" />
    </video>
  )
}

export default function Hero() {
  const { t, language } = useLanguage()
  const ar = language === 'ar'

  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Pick the backdrop per device, only after mount — so the server render and
  // first paint are always the lightweight poster (which carries the LCP) and
  // neither video sits on the critical path. Desktop (>=1024px) gets the full
  // scroll-scrubbed galaxy; mobile gets the small autoplay loop; reduced-motion
  // keeps the static poster.
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    setMounted(true)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Hero scroll progress: 0 at the top, 1 once the hero has scrolled past.
  // Drives the desktop scroll-scrub.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const showDesktopGalaxy = mounted && isDesktop && !reduce
  const showMobileGalaxy = mounted && !isDesktop && !reduce

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center px-6 lg:px-10 pt-24 pb-16 border-b border-wire"
    >
      {/* Galaxy backdrop. The optimized poster is the instant paint (and the
          LCP); a video only layers over it after hydration — the full
          scroll-scrubbed galaxy on desktop, a small 255 KB autoplay loop on
          mobile — so the 2 MB desktop clip never reaches phones or the critical
          path. The 55% dim lives on the wrapper so the group composites as one;
          the wrapper clips any object-cover overflow. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.55]"
      >
        <Image
          src="/galaxy-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {showDesktopGalaxy && <DesktopGalaxy scrollYProgress={scrollYProgress} />}
        {showMobileGalaxy && <MobileGalaxy />}
      </div>
      {/* Scrims: darken the text side (left) and anchor the bottom into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-ink via-ink/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-t from-ink via-transparent to-ink/30"
      />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pb-8 mb-12 border-b border-wire text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
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
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-20 items-center">
          {/* Above-the-fold hero content: animate transform only, never opacity
              from 0 — Framer renders `initial` into the SSR HTML, so an
              opacity:0 start would keep this (an LCP candidate) invisible until
              hydration. A transform-only entrance paints immediately. */}
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="tab-eyebrow mb-8">
              001 · {t('engineer.profile', 'ملف.المهندس')}
            </span>

            {/* Name. Arabic uses Rubik (Arabic-pairing) at same scale. */}
            {ar ? (
              <h1 className="font-rubik font-extrabold tracking-[-0.02em] leading-[1.05] text-paper mt-6 mb-8">
                <span className="block text-[2.75rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.5rem] xl:text-[6rem]">
                  ابوالمكارم
                </span>
                <span className="block text-[2.75rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.5rem] xl:text-[6rem]">
                  شهود
                  <span className="text-signal" aria-hidden="true">.</span>
                </span>
              </h1>
            ) : (
              <h1 className="font-mono font-extrabold tracking-[-0.05em] leading-[0.92] text-paper mt-6 mb-8">
                <span className="block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                  Abo-Elmakarem
                </span>
                <span className="block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                  Shohoud
                  <span className="text-signal" aria-hidden="true">.</span>
                </span>
              </h1>
            )}

            <div className={`text-base md:text-lg text-ash mb-10 leading-relaxed max-w-xl ${ar ? 'font-rubik' : 'font-mono'}`}>
              <p>
                {ar ? (
                  <>
                    مطور Full-Stack ومهندس DevOps وScrum Master في{' '}
                    <span className="text-paper underline decoration-signal decoration-1 underline-offset-4">
                      Ailigent
                    </span>
                    . أُشغّل ثلاث منصات SaaS مدعومة بالذكاء الاصطناعي (Tornix.ai، Oravex.app، Costra) لعملاء في مصر والإمارات والسعودية.
                  </>
                ) : (
                  <>
                    Full-Stack Developer, DevOps Engineer and Scrum Master at{' '}
                    <span className="text-paper underline decoration-signal decoration-1 underline-offset-4">
                      Ailigent
                    </span>
                    . Shipping three production AI SaaS (Tornix.ai, Oravex.app, Costra) across EG · UAE · KSA.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
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
                className="group inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper font-mono text-sm font-medium tracking-wide hover:border-signal hover:text-signal transition-colors duration-150"
              >
                <span>+20 100 886 7488</span>
                <span className="text-ash group-hover:text-signal">↗</span>
              </a>
              <a
                href="#projects"
                className={`group inline-flex items-center gap-3 px-5 py-3 border border-wire text-ash text-sm tracking-wide hover:border-signal hover:text-signal transition-colors duration-150 ${ar ? 'font-rubik' : 'font-mono'}`}
              >
                <span>{t('View shipped work', 'استعرض المشاريع المنشورة')}</span>
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.18em] text-ash">
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
          </motion.div>

          {/* The profile photo is the LCP element — render it immediately with
              no enter animation so it paints as soon as it downloads, instead
              of waiting on hydration to fade in (was ~1.9s of LCP render delay). */}
          <motion.div
            initial={false}
            className="order-1 lg:order-2 relative flex justify-center"
          >
            <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px]">
              <span aria-hidden="true" className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-signal" />
              <span aria-hidden="true" className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-signal" />

              <div className="relative w-full h-full overflow-hidden border border-wire bg-graphite">
                <Image
                  src="/profile.jpg"
                  alt={t('Abo-Elmakarem Shohoud', 'ابوالمكارم شهود')}
                  fill
                  className="object-cover grayscale contrast-110 hover:grayscale-0 transition-[filter] duration-700"
                  priority
                  sizes="(max-width: 768px) 280px, 320px"
                />
                <div className="absolute bottom-2 left-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-paper/80 mix-blend-difference">
                  frame 01 · 2026
                </div>
              </div>

              <div
                className="hidden lg:grid absolute -right-14 top-0 bottom-0 grid-rows-6 gap-2"
                aria-label="Tech stack"
              >
                {orbitIcons.map(({ Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="w-10 h-10 border border-wire flex items-center justify-center text-ash hover:border-signal hover:text-signal transition-colors duration-150"
                    title={label}
                  >
                    <Icon size={16} />
                  </motion.div>
                ))}
              </div>

              <div className="lg:hidden absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
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
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-24 lg:mt-20 flex items-center gap-3 text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
          <span>{t('scroll', 'مرر')}</span>
          <FaArrowDown className="text-signal" size={10} />
          <span className="h-px flex-1 max-w-[200px] bg-wire" />
          <span className="text-ash/60">002 / {t('about', 'نبذة')}</span>
        </motion.div>
      </div>
    </section>
  )
}
