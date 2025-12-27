import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Abo-Elmakarem Shohoud | AI Automation Expert',
  description: 'CEO & Co-founder @ Ailigent | Helping businesses cut costs by up to 70% using AI & Automation',
  keywords: ['AI', 'Automation', 'Voice Agents', 'LiveKit', 'OpenAI', 'Full-Stack Developer'],
  authors: [{ name: 'Abo-Elmakarem Shohoud' }],
  openGraph: {
    title: 'Abo-Elmakarem Shohoud | AI Automation Expert',
    description: 'CEO & Co-founder @ Ailigent | Helping businesses cut costs by up to 70% using AI & Automation',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#0a0a0a] text-white antialiased noise">
        {children}
      </body>
    </html>
  )
}
