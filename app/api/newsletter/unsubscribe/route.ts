import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return new NextResponse(
      renderUnsubscribePage('error', 'Invalid unsubscribe link'),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  const supabase = createServerClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('email', email.toLowerCase())

  if (error) {
    console.error('Unsubscribe error:', error)
    return new NextResponse(
      renderUnsubscribePage('error', 'Failed to unsubscribe'),
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  return new NextResponse(
    renderUnsubscribePage('success', 'You have been unsubscribed'),
    { headers: { 'Content-Type': 'text/html' } }
  )
}

function renderUnsubscribePage(status: 'success' | 'error', message: string): string {
  const isSuccess = status === 'success'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isSuccess ? 'Unsubscribed' : 'Error'} | Abo-Elmakarem Shohoud</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0a0a0a;
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 400px;
      text-align: center;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 40px;
    }
    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      background: ${isSuccess ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
    }
    h1 {
      font-size: 24px;
      margin-bottom: 12px;
      color: ${isSuccess ? '#22c55e' : '#ef4444'};
    }
    p {
      color: #9ca3af;
      margin-bottom: 24px;
    }
    a {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    a:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">${isSuccess ? '✓' : '✕'}</div>
    <h1>${isSuccess ? 'Unsubscribed' : 'Error'}</h1>
    <p>${message}</p>
    <a href="https://aboelmakarem.pro">Return to Website</a>
  </div>
</body>
</html>
  `
}
