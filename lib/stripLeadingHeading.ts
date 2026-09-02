/**
 * Some posts repeat their title as a leading `# Heading` inside the markdown
 * body, which renders a second h1 under the real one. Remove that first heading
 * when it matches the title (ignoring case, punctuation and surrounding space).
 */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d'"`*_~]/g, '')
    .replace(/[\s\-–—:|.,!?]+/g, ' ')
    .trim()

export function stripLeadingHeading(markdown: string, title: string): string {
  if (!markdown) return markdown
  const match = markdown.match(/^\s*#\s+(.+?)\s*#*\s*(\r?\n|$)/)
  if (!match) return markdown
  if (normalize(match[1]) !== normalize(title)) return markdown
  return markdown.slice(match[0].length).replace(/^\s*\r?\n/, '')
}
