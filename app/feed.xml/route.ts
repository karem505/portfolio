import { NextResponse } from 'next/server'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import { supabase } from '@/lib/supabase'

// Revalidate RSS feed every hour
export const revalidate = 3600

const SITE_URL = 'https://aboelmakarem.pro'
const SITE_TITLE = 'Abo-Elmakarem Shohoud Blog'
const SITE_DESCRIPTION = 'Latest insights on AI, automation, and software development by Abo-Elmakarem Shohoud'

// Markdown → HTML for content:encoded (same remark/rehype stack as the site's
// post renderer, minus syntax highlighting). Feed readers and AI crawlers get
// the whole article instead of a 600-character excerpt.
const markdownToHtml = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify)

async function renderMarkdown(markdown: string | null | undefined): Promise<string> {
  if (!markdown) return ''
  try {
    return String(await markdownToHtml.process(markdown))
  } catch (error) {
    console.error('RSS markdown render error:', error)
    return ''
  }
}

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
      .select('slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, published_at, updated_at, featured_image')
      .eq('status', 'published')
      .eq('seo_noindex', false)
      .order('published_at', { ascending: false })
      .limit(30)

    if (error) {
      console.error('RSS feed error:', error)
      return new NextResponse('Error generating feed', { status: 500 })
    }

    const items = await Promise.all((posts || []).map(async (post) => {
      const pubDate = new Date(post.published_at).toUTCString()
      const title = escapeXml(post.title_en)
      const titleAr = escapeXml(post.title_ar)
      const excerpt = escapeXml(post.excerpt_en)
      const image = post.featured_image ? `<enclosure url="${escapeXml(post.featured_image)}" type="image/jpeg"/>` : ''
      // CDATA cannot contain "]]>"; split it if an article ever does.
      const body = (await renderMarkdown(post.content_en)).replace(/]]>/g, ']]]]><![CDATA[>')
      const arabicUrl = `${SITE_URL}/blog/${post.slug}?lang=ar`

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
      <content:encoded><![CDATA[${body}
        <p dir="rtl" lang="ar"><a href="${arabicUrl}">${titleAr}</a> — النسخة العربية من هذا المقال.</p>
      ]]></content:encoded>
    </item>`
    }))
    const itemsXml = items.join('')

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
    ${itemsXml}
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
