'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useLanguage } from '@/lib/LanguageContext'

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  const { dir } = useLanguage()

  return (
    <div className="blog-content prose prose-invert max-w-none" dir={dir}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h2: ({ children }) => (
            <h2 className="font-display font-bold text-2xl mt-12 mb-4 gradient-text">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display font-semibold text-xl mt-8 mb-3 text-white">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-muted leading-relaxed">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-accent underline underline-offset-4 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-2 list-disc list-inside text-muted">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 space-y-2 list-decimal list-inside text-muted">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-muted">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary pl-3 sm:pl-4 rtl:pl-0 rtl:pr-3 sm:rtl:pr-4 italic my-4 sm:my-6 text-muted bg-surface/50 py-3 sm:py-4 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg text-sm sm:text-base">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="px-2 py-1 rounded bg-surface text-primary font-mono text-sm">
                  {children}
                </code>
              )
            }
            return (
              <code className={className}>{children}</code>
            )
          },
          pre: ({ children }) => (
            <pre className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-surface border border-white/10 overflow-x-auto my-4 sm:my-6 text-xs sm:text-sm">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => (
            <span className="block my-4 sm:my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || ''}
                className="rounded-lg sm:rounded-xl w-full"
              />
              {alt && (
                <span className="block text-center text-sm text-muted mt-2">
                  {alt}
                </span>
              )}
            </span>
          ),
          hr: () => <hr className="my-8 border-white/10" />,
          iframe: ({ src, ...props }) => (
            <div className="my-4 sm:my-6 aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={src}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                {...props}
              />
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 sm:my-6 -mx-4 px-4 sm:mx-0 sm:px-0">
              <table className="w-full border-collapse min-w-[400px] sm:min-w-0">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-white/10 px-2 py-1.5 sm:px-4 sm:py-2 bg-surface text-left rtl:text-right font-semibold text-xs sm:text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-white/10 px-2 py-1.5 sm:px-4 sm:py-2 text-muted text-xs sm:text-sm">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
