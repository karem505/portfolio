'use client'

import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'
import { SiUpwork } from 'react-icons/si'

const contacts = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'info@aboelmakarem.pro',
    href: 'mailto:info@aboelmakarem.pro',
  },
  {
    icon: FaPhone,
    label: 'Phone',
    value: '+20 100 886 7488',
    href: 'https://wa.me/201008867488',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    value: 'Abo-Elmakarem Shohoud',
    href: 'https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    value: '@karem505',
    href: 'https://github.com/karem505',
  },
  {
    icon: SiUpwork,
    label: 'Upwork',
    value: 'Karem S.',
    href: 'https://www.upwork.com/freelancers/~01ecbec4eb4f418011',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Location',
    value: 'Cairo, Egypt',
    href: null,
  },
]

export default function ContactList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {contacts.map((contact, index) => {
        const Card = (
          <motion.div
            key={contact.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className="group flex items-center gap-5 p-5 bg-graphite border border-wire hover:border-signal transition-colors duration-200 font-mono"
          >
            <div className="w-11 h-11 border border-wire flex items-center justify-center text-paper group-hover:border-signal group-hover:text-signal transition-colors shrink-0">
              <contact.icon className="text-base" />
            </div>
            <div className="flex-1">
              <div className="text-ash text-[0.7rem] tracking-[0.18em] uppercase">{contact.label}</div>
              <div className="text-paper font-medium mt-1 group-hover:text-signal transition-colors" dir="ltr">{contact.value}</div>
            </div>
            {contact.href && <span className="text-ash group-hover:text-signal transition-colors">↗</span>}
          </motion.div>
        )

        if (contact.href) {
          return (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith('mailto:') || contact.href.startsWith('tel:') ? undefined : '_blank'}
              rel={contact.href.startsWith('mailto:') || contact.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
            >
              {Card}
            </a>
          )
        }

        return Card
      })}
    </div>
  )
}
