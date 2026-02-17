import { Metadata } from 'next'
import SimplePageHeader from '@/components/SimplePageHeader'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for Ailigent AI automation consulting services by Abo-Elmakarem Shohoud.',
  alternates: {
    canonical: 'https://aboelmakarem.pro/refund',
  },
}

export default function RefundPage() {
  return (
    <>
      <SimplePageHeader title="Refund Policy" />
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-3xl mx-auto blog-content">
          <h1>Refund Policy</h1>
          <p><em>Last updated: February 2026</em></p>

          <p>
            This Refund Policy applies to consulting and AI automation services provided by
            Abo-Elmakarem Shohoud through <strong>Ailigent — AI Automation Solutions</strong>.
          </p>

          <h2>1. Services Overview</h2>
          <p>
            Ailigent provides AI automation consulting, voice agent development, workflow automation,
            and digital transformation services. Services are typically delivered on a project basis
            with milestones agreed upon before work begins.
          </p>

          <h2>2. Before Work Begins</h2>
          <p>
            If you cancel a project <strong>before any work has started</strong>, you are entitled
            to a <strong>full refund</strong> of any upfront payment or deposit.
          </p>

          <h2>3. During the Project</h2>
          <p>
            If you wish to cancel a project <strong>after work has begun</strong>, refunds will be
            calculated based on:
          </p>
          <ul>
            <li>The percentage of work completed at the time of cancellation.</li>
            <li>Any deliverables already provided to you.</li>
            <li>Third-party costs incurred on your behalf (e.g., API subscriptions, hosting).</li>
          </ul>
          <p>
            You will be invoiced only for work completed and costs incurred. Any remaining balance
            from upfront payments will be refunded.
          </p>

          <h2>4. After Delivery</h2>
          <p>
            Once a project milestone or final deliverable has been <strong>delivered and accepted</strong>,
            that portion of the payment is considered earned and is <strong>non-refundable</strong>.
          </p>
          <p>
            If the deliverable does not meet the agreed-upon specifications, I will work with you to
            resolve the issue at no additional cost within a reasonable revision period.
          </p>

          <h2>5. Refund Process</h2>
          <ol>
            <li>Contact me at <a href="mailto:karm92000@gmail.com">karm92000@gmail.com</a> with your refund request.</li>
            <li>Include your project name and reason for the request.</li>
            <li>I will review the request and respond within <strong>3 business days</strong>.</li>
            <li>Approved refunds are processed within <strong>7–10 business days</strong>.</li>
          </ol>

          <h2>6. Dispute Resolution</h2>
          <p>
            If we cannot reach an agreement on a refund, both parties agree to resolve the dispute
            through good-faith negotiation. If a resolution cannot be reached, the dispute may be
            referred to mediation.
          </p>

          <h2>7. Contact</h2>
          <p>
            For refund requests or questions about this policy, contact me at:{' '}
            <a href="mailto:karm92000@gmail.com">karm92000@gmail.com</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
