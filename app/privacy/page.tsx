import { Metadata } from 'next'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for aboelmakarem.pro — how we collect, use, and protect your data.',
  alternates: {
    canonical: 'https://aboelmakarem.pro/privacy',
  },
  openGraph: {
    url: 'https://aboelmakarem.pro/privacy',
    title: 'Privacy Policy | Abo-Elmakarem Shohoud',
    description: 'Privacy Policy for aboelmakarem.pro — how we collect, use, and protect your data.',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <SimplePageHeader title="Privacy Policy" />
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto blog-content">
          <h1>Privacy Policy</h1>
          <p><em>Last updated: February 2026</em></p>

          <p>
            This Privacy Policy explains how Abo-Elmakarem Shohoud (&quot;I&quot;, &quot;me&quot;, &quot;my&quot;),
            operating through <strong>Aboelmakarem — AI Automation Solutions</strong>, collects, uses, and
            protects your information when you visit{' '}
            <a href="https://aboelmakarem.pro">aboelmakarem.pro</a>.
          </p>

          <h2>1. Information I Collect</h2>

          <h3>Newsletter Subscription</h3>
          <p>
            When you subscribe to the newsletter, I collect your <strong>email address</strong> and
            your <strong>preferred language</strong> (English or Arabic). This data is stored securely
            in <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">Supabase</a>.
          </p>

          <h3>Contact Form</h3>
          <p>
            When you submit the contact form, I collect your <strong>name</strong>,{' '}
            <strong>email address</strong>, and <strong>message</strong>. Form submissions are
            processed by{' '}
            <a href="https://www.netlify.com/products/forms/" target="_blank" rel="noopener noreferrer">
              Netlify Forms
            </a>.
          </p>

          <h3>Analytics</h3>
          <p>
            I use <strong>Google Analytics</strong> to understand how visitors interact with the
            website. This collects anonymous usage data such as pages visited, time on site, and
            referral sources. No personally identifiable information is collected through analytics.
          </p>

          <h2>2. How I Use Your Information</h2>
          <ul>
            <li><strong>Newsletter emails:</strong> To send you blog updates and AI automation insights.</li>
            <li><strong>Contact form data:</strong> To respond to your inquiries.</li>
            <li><strong>Analytics data:</strong> To improve website content and user experience.</li>
          </ul>

          <h2>3. Third-Party Services</h2>
          <p>Your data may be processed by the following services:</p>
          <ul>
            <li><strong>Supabase</strong> — Database hosting for newsletter subscribers and blog content.</li>
            <li><strong>Netlify</strong> — Website hosting and form processing.</li>
            <li><strong>Resend</strong> — Email delivery for newsletter notifications.</li>
            <li><strong>Google Analytics</strong> — Anonymous website traffic analysis.</li>
          </ul>
          <p>
            Each service has its own privacy policy. I encourage you to review them for details on
            how they handle data.
          </p>

          <h2>4. Cookies</h2>
          <p>
            This website uses cookies set by Google Analytics to track anonymous usage patterns.
            No advertising or marketing cookies are used. You can disable cookies in your browser
            settings at any time.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Unsubscribe</strong> from the newsletter at any time using the link in every email.</li>
            <li><strong>Request deletion</strong> of your data by contacting me at the email below.</li>
            <li><strong>Access</strong> any personal data I hold about you.</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            Newsletter subscriber data is kept until you unsubscribe. Contact form submissions are
            retained for as long as needed to respond to your inquiry.
          </p>

          <h2>7. Contact</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your data rights,
            contact me at:{' '}
            <a href="mailto:info@aboelmakarem.pro">info@aboelmakarem.pro</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
