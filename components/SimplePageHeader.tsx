'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowLeft } from 'react-icons/hi2'

interface SimplePageHeaderProps {
  title: string
}

export default function SimplePageHeader({ title }: SimplePageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5"
    >
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted hover:text-white transition-colors"
        >
          <HiArrowLeft className="text-lg" />
          <span className="text-sm">Home</span>
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-sm text-white font-medium">{title}</span>
      </div>
    </motion.header>
  )
}
