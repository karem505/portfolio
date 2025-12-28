'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaCrown, FaProjectDiagram, FaUsers, FaClipboardList, FaChartLine, FaBuilding } from 'react-icons/fa'

const roles = [
  {
    icon: FaCrown,
    title: 'CEO & Co-founder',
    description: 'Leading Ailigent\'s vision and strategy, driving AI automation solutions for businesses worldwide',
    focus: 'Leadership & Strategy',
  },
  {
    icon: FaProjectDiagram,
    title: 'System Architect',
    description: 'Designing scalable AI-powered systems and enterprise architectures for digital transformation',
    focus: 'Technical Architecture',
  },
  {
    icon: FaUsers,
    title: 'Scrum Master',
    description: 'Facilitating agile workflows, removing blockers, and fostering team collaboration',
    focus: 'Agile & Team Leadership',
  },
  {
    icon: FaClipboardList,
    title: 'Product Owner',
    description: 'Managing product roadmap, prioritizing features, and aligning stakeholder requirements',
    focus: 'Product Strategy',
  },
  {
    icon: FaChartLine,
    title: 'Business Analyst',
    description: 'Conducting requirements analysis and process optimization for digital transformation projects',
    focus: 'Business Analysis',
  },
]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">Professional Experience</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Roles at <span className="gradient-text">Ailigent</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Wearing multiple hats to drive digital transformation and deliver AI-powered solutions
          </p>
        </motion.div>

        {/* Company Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-primary/30">
            <FaBuilding className="text-primary text-xl" />
            <span className="font-display font-semibold text-white">Ailigent</span>
            <span className="text-muted">|</span>
            <span className="text-muted text-sm">AI Automation Solutions</span>
          </div>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <role.icon className="text-white text-xl" />
                </div>

                {/* Focus Tag */}
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary mb-3">
                  {role.focus}
                </span>

                {/* Title */}
                <h3 className="font-display font-bold text-xl mb-3 text-white group-hover:text-primary transition-colors">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed">
                  {role.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Digital Transformation Focus */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center"
        >
          <h3 className="font-display font-bold text-2xl mb-4 text-white">
            Focused on Digital Transformation
          </h3>
          <p className="text-muted max-w-2xl mx-auto">
            Combining technical expertise with business acumen to help organizations modernize their operations,
            implement AI solutions, and achieve up to 70% cost reduction through intelligent automation.
          </p>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
