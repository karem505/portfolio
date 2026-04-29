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
        className={`relative h-full ${isFlagship ? 'p-7 md:p-8' : 'p-6'} bg-graphite border border-wire hover:border-signal transition-colors duration-200 overflow-hidden`}
      >
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-wire">
            <div
              className={`${isFlagship ? 'w-12 h-12' : 'w-11 h-11'} border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors`}
            >
              <project.icon className={isFlagship ? 'text-xl' : 'text-lg'} />
            </div>

            <div className="flex items-center gap-1">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
                  aria-label={`${project.title} on GitHub`}
                >
                  <FaGithub size={14} />
                </a>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-wire flex items-center justify-center text-ash hover:text-signal hover:border-signal transition-colors"
                  aria-label={`Visit ${project.title}`}
                >
                  <FaExternalLinkAlt size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Title + Tagline */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ash/60">
                {String(index + 1).padStart(2, '0')} ·
              </span>
              <h3
                className={`font-mono font-extrabold tracking-[-0.04em] ${isFlagship ? 'text-2xl md:text-[1.75rem]' : 'text-xl'} text-paper group-hover:text-signal transition-colors leading-none`}
              >
                {project.title}
              </h3>
            </div>
            <p className="text-ash text-xs md:text-sm font-mono">{project.tagline}</p>
          </div>

          {/* Roles (flagship only) */}
          {project.roles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 text-[0.65rem] font-mono uppercase tracking-[0.04em] border border-wire text-ash"
                >
                  {role}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <p className={`text-ash leading-relaxed mb-5 font-mono ${isFlagship ? 'text-sm' : 'text-xs md:text-sm'}`}>
            {project.description}
          </p>

          {/* Result line */}
          {project.result && (
            <div className="mb-5 pl-3 border-l border-signal">
              <span className="block font-mono text-[0.65rem] tracking-[0.18em] uppercase text-signal mb-1">
                — outcome
              </span>
              <span className="font-mono text-sm text-paper font-medium">
                {project.result}
              </span>
            </div>
          )}

          {/* Tech Stack — last */}
          <div className="mt-auto flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="tag-chip"
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
          initial={false}
          animate={{
            opacity: hoveredKey === cardKey ? 1 : 0,
          }}
          className="absolute bottom-5 right-5 text-signal"
          aria-label={`Open ${project.title}`}
        >
          <FaExternalLinkAlt size={14} />
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
          <span className="tab-eyebrow mb-6">004 · shipped · work</span>
          <h2 className="font-mono font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95]">
            Three production SaaS<span className="text-signal">.</span>
          </h2>
          <p className="text-ash max-w-2xl mx-auto text-base md:text-lg font-mono leading-relaxed">
            Live products I architect, ship, and run as Full-Stack Developer, DevOps Engineer, and Scrum Master at Ailigent.
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
          <FaRocket className="text-signal" />
          <h3 className="font-mono font-extrabold tracking-[-0.03em] text-2xl text-paper">notable · builds</h3>
          <span className="flex-1 h-px bg-wire" />
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
          <a
            href="https://github.com/karem505"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-5 py-3 border border-wire text-paper font-mono text-sm tracking-wide hover:border-signal hover:text-signal transition-colors"
          >
            <FaGithub size={16} />
            <span>More on GitHub</span>
            <span className="text-ash group-hover:text-signal">↗</span>
          </a>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
