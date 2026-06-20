import { describe, it, expect } from 'vitest'
import { parseApkVersion, pickLatestApk, formatBytes } from './latestApk'

describe('parseApkVersion', () => {
  it('parses a valid apk filename', () => {
    expect(parseApkVersion('pharmacy-manual-v0.2.2.apk')).toEqual([0, 2, 2])
  })
  it('rejects non-apk / mismatched names', () => {
    expect(parseApkVersion('README.md')).toBeNull()
    expect(parseApkVersion('pharmacy-manual-v0.2.apk')).toBeNull()
    expect(parseApkVersion('other-v1.0.0.apk')).toBeNull()
  })
})

describe('pickLatestApk', () => {
  it('picks the highest version numerically (0.2.10 > 0.2.9)', () => {
    const got = pickLatestApk([
      { name: 'README.md', size: 100 },
      { name: 'pharmacy-manual-v0.2.9.apk', size: 10 },
      { name: 'pharmacy-manual-v0.2.10.apk', size: 20 },
      { name: 'pharmacy-manual-v0.2.2.apk', size: 5 },
    ])
    expect(got?.version).toBe('0.2.10')
    expect(got?.fileName).toBe('pharmacy-manual-v0.2.10.apk')
    expect(got?.downloadUrl).toBe(
      'https://github.com/karem505/pharmacy-manual-apk/raw/main/pharmacy-manual-v0.2.10.apk'
    )
  })
  it('returns null when no apk present', () => {
    expect(pickLatestApk([{ name: 'README.md', size: 1 }])).toBeNull()
    expect(pickLatestApk([])).toBeNull()
  })
})

describe('formatBytes', () => {
  it('formats MB and KB', () => {
    expect(formatBytes(65148247)).toBe('62 MB')
    expect(formatBytes(950 * 1024)).toBe('950 KB')
    expect(formatBytes(0)).toBe('—')
  })
})
