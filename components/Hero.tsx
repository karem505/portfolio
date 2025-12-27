'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaLinkedin, FaGithub, FaArrowDown } from 'react-icons/fa'
import { SiTypescript, SiPython, SiReact, SiNextdotjs, SiOpenai, SiDocker } from 'react-icons/si'

const titles = [
  'AI Automation Expert',
  'Voice Agent Builder',
  'Full-Stack Developer',
  'Business Optimizer',
]

const floatingIcons = [
  { Icon: SiTypescript, color: '#3178c6', delay: 0 },
  { Icon: SiPython, color: '#3776ab', delay: 0.5 },
  { Icon: SiReact, color: '#61dafb', delay: 1 },
  { Icon: SiNextdotjs, color: '#ffffff', delay: 1.5 },
  { Icon: SiOpenai, color: '#10a37f', delay: 2 },
  { Icon: SiDocker, color: '#2496ed', delay: 2.5 },
]

export default function Hero() {
  const [currentTitle, setCurrentTitle] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const title = titles[currentTitle]
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < title.length) {
          setDisplayText(title.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(title.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentTitle((prev) => (prev + 1) % titles.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTitle])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="order-2 lg:order-1"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-12 h-[2px] bg-gradient-to-r from-primary to-accent" />
              <span className="text-muted font-medium">Welcome to my portfolio</span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-4"
            >
              <span className="text-white">I'm </span>
              <span className="gradient-text glow-text">Abo-Elmakarem</span>
            </motion.h1>

            {/* Title with Typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h2 className="font-display text-2xl md:text-3xl text-muted">
                CEO @ <span className="text-primary">Ailigent</span>
              </h2>
              <div className="h-12 mt-2">
                <span className="font-display text-xl md:text-2xl text-white">
                  {displayText}
                  <span className="cursor-blink text-primary">|</span>
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-muted text-lg max-w-lg mb-8 leading-relaxed"
            >
              Helping businesses <span className="text-white font-semibold">cut costs by up to 70%</span> using
              AI & Automation. Building voice agents, intelligent systems, and business solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                View Projects
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border border-white/20 font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Get in Touch
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4"
            >
              <span className="text-muted text-sm">Find me on</span>
              <motion.a
                href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -3 }}
                className="p-3 rounded-full glass text-muted hover:text-primary transition-colors"
              >
                <FaLinkedin size={20} />
              </motion.a>
              <motion.a
                href="https://github.com/karem505"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -3 }}
                className="p-3 rounded-full glass text-muted hover:text-white transition-colors"
              >
                <FaGithub size={20} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Content - Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="order-1 lg:order-2 relative flex justify-center"
          >
            {/* Decorative Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border border-primary/20 pulse-ring" />
              <div className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-accent/10 pulse-ring" style={{ animationDelay: '1s' }} />
            </div>

            {/* Floating Tech Icons */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              {floatingIcons.map(({ Icon, color, delay }, index) => {
                const startAngle = (index * 60) // Distribute 6 icons evenly (360/6 = 60 degrees apart)
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + delay * 0.2, duration: 0.5 }}
                    className="absolute"
                    style={{
                      transform: `rotate(${startAngle}deg)`,
                    }}
                  >
                    <motion.div
                      className="orbit"
                      style={{
                        animationDuration: `${25 + index * 3}s`,
                      }}
                    >
                      <div className="p-3 rounded-xl glass shadow-lg" style={{ color }}>
                        <Icon size={24} />
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>

            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative z-10"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden glow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                <Image
                  src="/profile.jpg"
                  alt="Abo-Elmakarem Shohoud"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full glass border border-green-500/30"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-400">Available for work</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-muted text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FaArrowDown className="text-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
