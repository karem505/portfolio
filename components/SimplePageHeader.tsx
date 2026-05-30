'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2'

interface SimplePageHeaderProps {
  title: string
  /** When true, renders the back-link in Arabic/RTL (right-pointing arrow, "الرئيسية"). */
  ar?: boolean
}

export default function SimplePageHeader({ title, ar = false }: SimplePageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-ink/85 border-b border-wire"
    >
      <div
        dir={ar ? 'rtl' : 'ltr'}
        className={`max-w-4xl mx-auto px-6 py-4 flex items-center gap-3 text-sm ${ar ? 'font-rubik' : 'font-mono'}`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-ash hover:text-signal transition-colors"
        >
          {ar ? <HiArrowRight className="text-base" /> : <HiArrowLeft className="text-base" />}
          <span>{ar ? 'الرئيسية' : 'home'}</span>
        </Link>
        <span className="text-wire">/</span>
        <span className="text-paper font-medium">{ar ? title : title.toLowerCase()}</span>
      </div>
    </motion.header>
  )
}
