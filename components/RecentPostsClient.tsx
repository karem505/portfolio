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
          <span className="text-primary font-medium mb-4 block">Blog</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Recent <span className="gradient-text">Posts</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
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
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-3xl glass border border-white/5 hover:border-primary/30 transition-all duration-300 overflow-hidden"
            >
              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.featured_image}
                    alt={post.title_en}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-muted text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {formatDate(post.published_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock />
                    {post.reading_time_minutes} min read
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-lg mb-2 text-white group-hover:text-primary transition-colors line-clamp-2">
                  {post.title_en}
                </h3>

                {/* Excerpt */}
                {post.excerpt_en && (
                  <p className="text-muted text-sm leading-relaxed line-clamp-2">
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
          <motion.a
            href="/blog"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 font-semibold hover:bg-white/10 transition-all duration-300"
          >
            View All Posts
            <FaArrowRight />
          </motion.a>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
