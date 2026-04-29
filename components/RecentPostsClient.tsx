'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { FaArrowRight, FaClock, FaCalendarAlt } from 'react-icons/fa'
import type { Post } from '@/lib/types'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface RecentPostsClientProps {
  posts: Post[]
}

export default function RecentPostsClient({ posts }: RecentPostsClientProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (posts.length === 0) return null

  return (
    <section id="blog" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="tab-eyebrow mb-6">008 · journal</span>
          <h2 className="font-mono font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95]">
            Recent posts<span className="text-signal">.</span>
          </h2>
          <p className="text-ash max-w-2xl mx-auto text-base md:text-lg font-mono leading-relaxed">
            Insights on AI automation, voice agents, and building smarter business systems.
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-graphite border border-wire hover:border-signal transition-colors duration-200 overflow-hidden font-mono"
            >
              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative h-44 overflow-hidden border-b border-wire">
                  <Image
                    src={post.featured_image}
                    alt={post.title_en}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale contrast-110 group-hover:grayscale-0 transition-[filter] duration-700"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-paper bg-ink/80 px-2 py-1">
                    post · {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              )}

              <div className="p-5">
                {/* Meta */}
                <div className="flex items-center gap-3 text-ash text-[0.7rem] tracking-[0.04em] mb-3 uppercase">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt size={9} className="text-signal" />
                    {formatDate(post.published_at)}
                  </span>
                  <span className="text-wire">·</span>
                  <span className="flex items-center gap-1.5">
                    <FaClock size={9} className="text-signal" />
                    {post.reading_time_minutes} min
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-mono font-bold text-base md:text-lg mb-2 text-paper group-hover:text-signal transition-colors line-clamp-2 leading-snug tracking-[-0.02em]">
                  {post.title_en}
                </h3>

                {/* Excerpt */}
                {post.excerpt_en && (
                  <p className="text-ash text-sm leading-relaxed line-clamp-2">
                    {post.excerpt_en}
                  </p>
                )}
              </div>
            </motion.a>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/blog"
            className="inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper font-mono text-sm hover:border-signal hover:text-signal transition-colors"
          >
            <span>View all posts</span>
            <FaArrowRight size={12} />
          </a>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
