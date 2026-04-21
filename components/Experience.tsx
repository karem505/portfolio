'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaCode, FaClipboardList, FaBuilding, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'

const roles = [
  {
    icon: FaCode,
    title: 'Full-Stack Developer / DevOps / Scrum Master',
    focus: 'Engineering & Delivery',
    period: '2023 – Present',
    location: 'Cairo, Egypt',
    bullets: [
      'Serve concurrently as Full-Stack Developer, DevOps Engineer, and Scrum Master across three live SaaS platforms.',
      'Architect and build full-stack applications using TypeScript, React, Next.js, Python, FastAPI, and Node.js.',
      'Manage cloud infrastructure, containerization, and CI/CD pipelines on Railway and AWS EC2 using Docker and GitHub Actions.',
      'Facilitate Agile ceremonies, maintain product backlogs, and coordinate sprint planning across cross-functional teams.',
      'Design and deploy voice AI agents using LiveKit Agents framework and OpenAI Realtime API for sales and customer support automation.',
      'Built OpenClaw Agent Dashboard — a glassmorphic agent management UI with 11 API integrations and real-time monitoring.',
      'Developed PE Live AI Agent: production-ready voice AI with MCP database integration, 8 database tools, and Tavus video avatar support.',
      'Deliver client engagements end-to-end from requirements analysis and system architecture to deployment and post-launch optimization.',
    ],
  },
  {
    icon: FaClipboardList,
    title: 'Business Analyst',
    focus: 'Requirements & ROI',
    period: '2023 – Present',
    location: 'Cairo, Egypt',
    bullets: [
      'Conduct requirements workshops and process mapping for digital transformation engagements across Egypt, KSA, and UAE.',
      'Translate stakeholder needs into technical specifications, user stories, and sprint-ready backlogs.',
      'Lead cost-benefit analysis and ROI modelling for AI automation projects, consistently demonstrating 50–70% cost reduction potential.',
    ],
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
            Two concurrent roles driving AI automation and digital transformation for clients across Egypt, UAE, and KSA.
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

        {/* Roles */}
        <div className="grid lg:grid-cols-2 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              className="group relative p-8 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all duration-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                {/* Icon + Focus */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <role.icon className="text-white text-xl" />
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {role.focus}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl md:text-2xl mb-3 text-white group-hover:text-primary transition-colors">
                  {role.title}
                </h3>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-primary/70" />
                    {role.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FaMapMarkerAlt className="text-primary/70" />
                    {role.location}
                  </span>
                </div>

                {/* Bullets */}
                <ul className="space-y-2.5">
                  {role.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-3 text-muted text-sm leading-relaxed">
                      <span className="text-primary flex-shrink-0 mt-1.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
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
            Combining technical delivery with business analysis to help organizations modernize their operations,
            implement AI solutions, and achieve up to 70% cost reduction through intelligent automation.
          </p>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
