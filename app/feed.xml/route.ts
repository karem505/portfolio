import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Revalidate RSS feed every hour
export const revalidate = 3600

const SITE_URL = 'https://aboelmakarem.pro'
const SITE_TITLE = 'Abo-Elmakarem Shohoud Blog'
const SITE_DESCRIPTION = 'Latest insights on AI, automation, and software development by Abo-Elmakarem Shohoud'

function escapeXml(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, title_en, title_ar, excerpt_en, excerpt_ar, published_at, featured_image')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('RSS feed error:', error)
      return new NextResponse('Error generating feed', { status: 500 })
    }

    const items = (posts || []).map((post) => {
      const pubDate = new Date(post.published_at).toUTCString()
      const title = escapeXml(post.title_en)
      const titleAr = escapeXml(post.title_ar)
      const excerpt = escapeXml(post.excerpt_en)
      const excerptAr = escapeXml(post.excerpt_ar)
      const image = post.featured_image ? `<enclosure url="${escapeXml(post.featured_image)}" type="image/jpeg"/>` : ''

      return `
    <item>
      <title>${title}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>abo.elmakarem@ailigent.ai (Abo-Elmakarem Shohoud)</author>
      ${image}
      <category>AI &amp; Automation</category>
      <dc:language>en</dc:language>
      <content:encoded><![CDATA[
        <p><strong>English:</strong> ${excerpt}</p>
        <p><strong>العربية:</strong> ${excerptAr}</p>
        <p dir="rtl">${titleAr}</p>
      ]]></content:encoded>
    </item>`
    }).join('')

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/profile.jpg</url>
      <title>${SITE_TITLE}</title>
      <link>${SITE_URL}</link>
    </image>
    <managingEditor>abo.elmakarem@ailigent.ai (Abo-Elmakarem Shohoud)</managingEditor>
    <webMaster>abo.elmakarem@ailigent.ai (Abo-Elmakarem Shohoud)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} Abo-Elmakarem Shohoud</copyright>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`

    return new NextResponse(feed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('RSS feed error:', error)
    return new NextResponse('Error generating feed', { status: 500 })
  }
}
