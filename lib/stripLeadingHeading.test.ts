import { describe, it, expect } from 'vitest'
import { stripLeadingHeading } from './stripLeadingHeading'

describe('stripLeadingHeading', () => {
  it('removes a leading h1 that repeats the title', () => {
    expect(stripLeadingHeading('# Hello World\n\nBody', 'Hello World')).toBe('Body')
  })
  it('matches loosely: case, punctuation, curly quotes, trailing hashes', () => {
    expect(stripLeadingHeading('#  The 2026 Guide: “Agents” #\nBody', 'the 2026 guide agents')).toBe('Body')
  })
  it('keeps a leading h1 that is a different heading', () => {
    const md = '# Introduction\n\nBody'
    expect(stripLeadingHeading(md, 'Hello World')).toBe(md)
  })
  it('keeps h2 and deeper headings and non-heading starts', () => {
    expect(stripLeadingHeading('## Hello World\nBody', 'Hello World')).toBe('## Hello World\nBody')
    expect(stripLeadingHeading('Body first\n# Hello World', 'Hello World')).toBe('Body first\n# Hello World')
  })
  it('handles empty input and Arabic titles', () => {
    expect(stripLeadingHeading('', 'x')).toBe('')
    expect(stripLeadingHeading('# دليل الأدوية\n\nنص', 'دليل الأدوية')).toBe('نص')
  })
})
