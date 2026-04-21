'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaGithub, FaExternalLinkAlt, FaRocket, FaTasks, FaLanguage, FaCalculator } from 'react-icons/fa'
import { SiPython, SiJavascript } from 'react-icons/si'
import type { IconType } from 'react-icons'

type Project = {
  title: string
  tagline: string
  description: string
  tech: string[]
  roles: string[]
  icon: IconType
  gradient: string
  result: string
  link?: string
  github?: string
}

const flagships: Project[] = [
  {
    title: 'Tornix.ai',
    tagline: 'AI-Powered Project Management SaaS',
    description:
      'AI-powered project management platform serving construction and enterprise clients. Built a Gantt chart module with Critical Path Method (CPM) engine and Primavera P6 / XER file compatibility.',
    tech: ['React', 'Python', 'AWS EC2', 'Docker', 'GitHub Actions'],
    roles: ['Scrum Master', 'DevOps Engineer', 'Full-Stack Developer'],
    icon: FaTasks,
    gradient: 'from-blue-600 to-cyan-500',
    result: 'CPM engine · Primavera P6/XER compatibility',
    link: 'https://tornix.ai',
  },
  {
    title: 'Oravex.app',
    tagline: 'NLP-Powered Odoo ERP Platform',
    description:
      'Full ERP platform built on Odoo 18 combining Natural Language Processing with core ERP modules — users interact with the ERP using natural language queries. Custom NLP modules on a React/Next.js + Odoo stack.',
    tech: ['React', 'Next.js', 'Odoo 18', 'Python', 'PostgreSQL'],
    roles: ['Scrum Master', 'DevOps Engineer', 'Full-Stack Developer'],
    icon: FaLanguage,
    gradient: 'from-indigo-600 to-violet-500',
    result: 'Natural-language ERP queries',
    link: 'https://oravex.app',
  },
  {
    title: 'Costra.ailigent.ai',
    tagline: 'AI Cost Estimation & Construction Analytics',
    description:
      'AI-driven cost estimation and construction analytics platform with Arabic RTL support. Built interactive cost calculators and financial dashboards; managed deployment with SSL hardening and uptime monitoring.',
    tech: ['Node.js', 'Python', 'Chart.js', 'Docker', 'Nginx'],
    roles: ['Scrum Master', 'DevOps Engineer', 'Full-Stack Developer'],
    icon: FaCalculator,
    gradient: 'from-orange-500 to-red-500',
    result: 'Arabic RTL · secured & monitored',
    link: 'https://costra.ailigent.ai',
  },
]

const notableBuilds: Project[] = [
  {
    title: 'OpenClaw Agent Dashboard',
    tagline: 'Agent Management UI',
    description:
      'Glassmorphic agent management dashboard for OpenClaw with task kanban, document editor, real-time agent monitoring, and 11 API integrations.',
    tech: ['HTML', 'CSS', 'JavaScript', 'OpenClaw'],
    roles: [],
    icon: SiJavascript,
    gradient: 'from-violet-600 to-purple-500',
    result: '11 API integrations · real-time monitoring',
    github: 'https://github.com/karem505/openclaw-agent-dashboard',
  },
  {
    title: 'PE Live AI Agent',
    tagline: 'Production Voice AI',
    description:
      'Voice AI agent built with LiveKit Agents framework, featuring OpenAI Realtime API, MCP database integration, and Tavus video avatar support. Production-ready with 8 database tools.',
    tech: ['Python', 'LiveKit', 'OpenAI Realtime', 'MCP', 'Tavus'],
    roles: [],
    icon: SiPython,
    gradient: 'from-purple-600 to-pink-500',
    result: 'Production-ready · 8 database tools',
    github: 'https://github.com/karem505/PE-live-ai-agent',
  },
]

type ProjectCardProps = {
  project: Project
  index: number
  isInView: boolean
  size?: 'flagship' | 'notable'
  hoveredKey: string | null
  onHoverChange: (key: string | null) => void
  cardKey: string
}

function ProjectCard({
  project,
  index,
  isInView,
  size = 'flagship',
  hoveredKey,
  onHoverChange,
  cardKey,
}: ProjectCardProps) {
  const isFlagship = size === 'flagship'
  const primaryLink = project.link ?? project.github ?? '#'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      onMouseEnter={() => onHoverChange(cardKey)}
      onMouseLeave={() => onHoverChange(null)}
      className="group relative"
    >
      <div
        className={`relative h-full ${isFlagship ? 'p-8' : 'p-6'} rounded-3xl glass border border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        <motion.div
          initial={false}
          animate={{ opacity: hoveredKey === cardKey ? 1 : 0 }}
          className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-xl"
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div
              className={`${isFlagship ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
            >
              <project.icon className={`text-white ${isFlagship ? 'text-2xl' : 'text-xl'}`} />
            </div>

            <div className="flex items-center gap-2">
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl glass text-muted hover:text-white transition-colors"
                  aria-label={`${project.title} on GitHub`}
                >
                  <FaGithub size={18} />
                </motion.a>
              )}
              {project.link && (
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl glass text-muted hover:text-primary transition-colors"
                  aria-label={`Visit ${project.title}`}
                >
                  <FaExternalLinkAlt size={16} />
                </motion.a>
              )}
            </div>
          </div>

          {/* Title + Tagline */}
          <h3
            className={`font-display font-bold ${isFlagship ? 'text-2xl md:text-3xl' : 'text-xl'} mb-1 text-white group-hover:text-primary transition-colors`}
          >
            {project.title}
          </h3>
          <p className="text-primary/80 text-sm font-medium mb-4">{project.tagline}</p>

          {/* Roles (flagship only) */}
          {project.roles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.roles.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-primary/15 text-primary/90 border border-primary/20"
                >
                  {role}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className={`text-muted leading-relaxed mb-4 ${isFlagship ? 'text-base' : 'text-sm'}`}>
            {project.description}
          </p>

          {/* Result Badge */}
          {project.result && (
            <div className="mb-5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${project.gradient} bg-opacity-20 text-white border border-white/10`}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {project.result}
              </span>
            </div>
          )}

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-muted border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Hover Arrow */}
        <motion.a
          href={primaryLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: hoveredKey === cardKey ? 1 : 0,
            x: hoveredKey === cardKey ? 0 : -10,
          }}
          className="absolute bottom-6 right-6 text-primary"
          aria-label={`Open ${project.title}`}
        >
          <FaExternalLinkAlt size={18} />
        </motion.a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  return (
    <section id="projects" ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">My Work</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Flagship <span className="gradient-text">SaaS Products</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Three live SaaS products I architect, ship, and run as Full-Stack Developer, DevOps Engineer, and Scrum Master at Ailigent.
          </p>
        </motion.div>

        {/* Flagships Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {flagships.map((project, index) => (
            <ProjectCard
              key={project.title}
              cardKey={`flagship-${index}`}
              project={project}
              index={index}
              isInView={isInView}
              size="flagship"
              hoveredKey={hoveredKey}
              onHoverChange={setHoveredKey}
            />
          ))}
        </div>

        {/* Notable Builds Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4 mb-8"
        >
          <FaRocket className="text-primary" />
          <h3 className="font-display font-bold text-2xl text-white">Notable Builds</h3>
          <span className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
        </motion.div>

        {/* Notable Builds Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {notableBuilds.map((project, index) => (
            <ProjectCard
              key={project.title}
              cardKey={`notable-${index}`}
              project={project}
              index={index}
              isInView={isInView}
              size="notable"
              hoveredKey={hoveredKey}
              onHoverChange={setHoveredKey}
            />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/karem505"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 font-semibold hover:bg-white/10 transition-all duration-300"
          >
            <FaGithub size={20} />
            More on GitHub
          </motion.a>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
