import { Metadata } from 'next'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'
import ContactList from './ContactList'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Abo-Elmakarem Shohoud — Email, LinkedIn, GitHub, Upwork. AI Automation Expert based in Cairo, Egypt.',
  alternates: {
    canonical: 'https://aboelmakarem.pro/contact-info',
  },
}

export default function ContactInfoPage() {
  return (
    <>
      <SimplePageHeader title="Contact" />
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="tab-eyebrow mb-6 mx-auto block w-fit">contact</span>
          <h1 className="font-mono font-extrabold tracking-[-0.04em] text-4xl md:text-5xl lg:text-6xl mb-6 mt-4 text-paper leading-[0.95] text-center">
            Get in touch<span className="text-signal">.</span>
          </h1>
          <p className="text-ash text-center text-base md:text-lg font-mono leading-relaxed mb-12 max-w-xl mx-auto">
            Have a project in mind or want to discuss how AI automation can help your business?
            Reach out through any of the channels below.
          </p>
          <ContactList />
        </div>
      </main>
      <Footer />
    </>
  )
}
