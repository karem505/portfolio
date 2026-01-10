import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, language = 'en' } = await request.json()

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate language
    const validLanguage = language === 'ar' ? 'ar' : 'en'

    const supabase = createServerClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 409 }
        )
      }

      // Reactivate if previously unsubscribed
      const { error: updateError } = await supabase
        .from('newsletter_subscribers')
        .update({
          status: 'active',
          unsubscribed_at: null,
          language: validLanguage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Reactivation error:', updateError)
        return NextResponse.json(
          { message: 'Subscription failed' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, reactivated: true })
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        language: validLanguage,
        source: 'website',
        status: 'active',
      })

    if (insertError) {
      console.error('Insert error:', insertError)

      // Handle unique constraint violation
      if (insertError.code === '23505') {
        return NextResponse.json(
          { message: 'Already subscribed' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { message: 'Subscription failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { message: 'Subscription failed' },
      { status: 500 }
    )
  }
}
