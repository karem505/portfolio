'use client'

import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-2"
          >
            <span className="font-display font-bold text-2xl gradient-text">
              AE
            </span>
            <p className="text-muted text-sm flex items-center gap-1">
              © {currentYear} Made with <FaHeart className="text-red-500 text-xs" /> by Abo-Elmakarem
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-8"
          >
            {['Home', 'About', 'Projects', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-muted hover:text-white text-sm transition-colors"
              >
                {link}
              </a>
            ))}
          </motion.nav>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <motion.a
              href="https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              className="p-3 rounded-full glass text-muted hover:text-primary transition-colors"
            >
              <FaLinkedin size={18} />
            </motion.a>
            <motion.a
              href="https://github.com/karem505"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              className="p-3 rounded-full glass text-muted hover:text-white transition-colors"
            >
              <FaGithub size={18} />
            </motion.a>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-white/5 text-center"
        >
          <p className="text-muted text-xs">
            CEO & Co-founder @ <span className="text-primary">Ailigent</span> • AI Automation Expert • Cairo, Egypt
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
