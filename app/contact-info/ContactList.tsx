'use client'

import { motion } from 'framer-motion'
import { FaLinkedin, FaGithub, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'
import { SiUpwork } from 'react-icons/si'

const contacts = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'karm92000@gmail.com',
    href: 'mailto:karm92000@gmail.com',
  },
  {
    icon: FaPhone,
    label: 'Phone',
    value: '+20 106 142 2876',
    href: 'tel:+201061422876',
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={contact.href ? { y: -4, scale: 1.02 } : {}}
            className="flex items-center gap-5 p-6 rounded-2xl glass border border-white/5 hover:border-primary/30 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <contact.icon className="text-white text-xl" />
            </div>
            <div>
              <div className="text-muted text-sm">{contact.label}</div>
              <div className="text-white font-medium">{contact.value}</div>
            </div>
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
