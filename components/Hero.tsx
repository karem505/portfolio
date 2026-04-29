'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaLinkedin, FaGithub, FaArrowDown } from 'react-icons/fa'
import { SiTypescript, SiPython, SiReact, SiNextdotjs, SiOpenai, SiDocker } from 'react-icons/si'

const orbitIcons = [
  { Icon: SiTypescript, label: 'TypeScript' },
  { Icon: SiPython, label: 'Python' },
  { Icon: SiReact, label: 'React' },
  { Icon: SiNextdotjs, label: 'Next.js' },
  { Icon: SiOpenai, label: 'OpenAI' },
  { Icon: SiDocker, label: 'Docker' },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center px-6 lg:px-10 pt-24 pb-16 border-b border-wire"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Top spec band — engineer-spec-sheet header instead of "Hi, I'm X" greeting */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pb-8 mb-12 border-b border-wire text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
          <div>
            <span className="text-ash/60">file</span>{' '}
            <span className="text-paper">/karem.profile</span>
          </div>
          <div>
            <span className="text-ash/60">role</span>{' '}
            <span className="text-paper">full-stack · devops</span>
          </div>
          <div>
            <span className="text-ash/60">based</span>{' '}
            <span className="text-paper">cairo · eg</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot" aria-hidden="true" />
            <span className="text-paper">open · for · work</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-20 items-center">
          {/* Left — name set as engineer's nameplate, not a marketing hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            <span className="tab-eyebrow mb-8">
              001 · engineer.profile
            </span>

            {/* Name. NO gradient text. Mono ExtraBold, extreme size, paper-on-ink.
                The signal-red glyph is the period — a single load-bearing accent. */}
            <h1 className="font-mono font-extrabold tracking-[-0.05em] leading-[0.92] text-paper mt-6 mb-8">
              <span className="block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                Abo-Elmakarem
              </span>
              <span className="block text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]">
                Shohoud
                <span className="text-signal" aria-hidden="true">.</span>
              </span>
            </h1>

            {/* Role line — static, factual, no cycling typewriter. */}
            <div className="font-mono text-base md:text-lg text-ash mb-10 leading-relaxed max-w-xl">
              <p>
                Full-Stack Developer, DevOps Engineer and Scrum Master at{' '}
                <span className="text-paper underline decoration-signal decoration-1 underline-offset-4">
                  Ailigent
                </span>
                . Shipping three production AI SaaS (Tornix.ai, Oravex.app, Costra) across EG · UAE · KSA.
              </p>
            </div>

            {/* Recruiter-first CTAs. Square buttons, no pills, no gradient fill,
                no scale-on-hover. Border + signal text on hover — the lane's
                rule. */}
            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="/Abo-Elmakarem_CV-1.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-5 py-3 border border-paper bg-paper text-ink font-mono text-sm font-medium tracking-wide hover:bg-signal hover:text-paper hover:border-signal transition-colors duration-150"
              >
                <span>Download CV</span>
                <span className="text-ink group-hover:text-paper">→</span>
              </a>
              <a
                href="mailto:karm92000@gmail.com"
                className="group inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper font-mono text-sm font-medium tracking-wide hover:border-signal hover:text-signal transition-colors duration-150"
              >
                <span>karm92000@gmail.com</span>
                <span className="text-ash group-hover:text-signal">↗</span>
              </a>
              <a
                href="#projects"
                className="group inline-flex items-center gap-3 px-5 py-3 border border-wire text-ash font-mono text-sm tracking-wide hover:border-signal hover:text-signal transition-colors duration-150"
              >
                <span>View shipped work</span>
              </a>
            </div>

            {/* Social — flat tab buttons, no glassmorphism */}
            <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-[0.18em] text-ash">
              <span>find ↦</span>
              <a
                href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ash hover:text-signal transition-colors duration-150"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={16} />
                <span>linkedin</span>
              </a>
              <span aria-hidden="true" className="text-wire">/</span>
              <a
                href="https://github.com/karem505"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ash hover:text-signal transition-colors duration-150"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
                <span>github</span>
              </a>
            </div>
          </motion.div>

          {/* Right — portrait. Square frame, hairline border, no glow halo,
              no rounded-full ring. Orbital icons KEPT but flattened: hairline
              square chips, mono labels, no glass, no gradient color glow. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 relative flex justify-center"
          >
            <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px]">
              {/* Spec corner brackets — print-spec aesthetic */}
              <span aria-hidden="true" className="absolute -top-2 -left-2 w-3 h-3 border-t border-l border-signal" />
              <span aria-hidden="true" className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-signal" />
              <span aria-hidden="true" className="absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-signal" />

              {/* Portrait frame */}
              <div className="relative w-full h-full overflow-hidden border border-wire bg-graphite">
                <Image
                  src="/profile.jpg"
                  alt="Abo-Elmakarem Shohoud"
                  fill
                  className="object-cover grayscale contrast-110 hover:grayscale-0 transition-[filter] duration-700"
                  priority
                  sizes="(max-width: 768px) 280px, 320px"
                />
                {/* Frame number — bottom-left, like a contact-sheet print */}
                <div className="absolute bottom-2 left-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-paper/80 mix-blend-difference">
                  frame 01 · 2026
                </div>
              </div>

              {/* Tech-stack column — square chips, NOT orbiting glass pills.
                  Sits to the right of the portrait, mono row of icons. */}
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

              {/* Mobile/tablet inline tech row */}
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

        {/* Footer scroll indicator — mono, flat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-24 lg:mt-20 flex items-center gap-3 text-[0.7rem] tracking-[0.18em] uppercase text-ash font-mono"
        >
          <span>scroll</span>
          <FaArrowDown className="text-signal" size={10} />
          <span className="h-px flex-1 max-w-[200px] bg-wire" />
          <span className="text-ash/60">002 / about</span>
        </motion.div>
      </div>
    </section>
  )
}
