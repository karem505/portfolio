import { describe, it, expect } from 'vitest'
import { postPath } from './postPath'

describe('postPath', () => {
  it('English posts are the bare path (never ?lang=en)', () => {
    expect(postPath('hello-world', 'en')).toBe('/blog/hello-world')
  })
  it('Arabic posts carry the ?lang=ar query', () => {
    expect(postPath('hello-world', 'ar')).toBe('/blog/hello-world?lang=ar')
  })
})
