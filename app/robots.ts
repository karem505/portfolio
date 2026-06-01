import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://aboelmakarem.pro'

  // Named AI / LLM crawlers we explicitly welcome (GEO). Listing them by name
  // makes the "allow" intent unambiguous and future-proofs against a future
  // restrictive wildcard edit accidentally blocking AI search engines.
  const aiCrawlers = [
    'GPTBot', // OpenAI training/index
    'OAI-SearchBot', // ChatGPT Search
    'ChatGPT-User', // ChatGPT browsing
    'ClaudeBot', // Anthropic crawler
    'anthropic-ai', // Anthropic
    'Claude-User', // Claude browsing
    'PerplexityBot', // Perplexity index
    'Perplexity-User', // Perplexity browsing
    'Google-Extended', // Gemini / AI Overviews
    'Applebot-Extended', // Apple Intelligence
    'CCBot', // Common Crawl (feeds many LLMs)
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/', '/_next/'],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
