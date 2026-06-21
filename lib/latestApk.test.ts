import { describe, it, expect } from 'vitest'
import { parseApkVersion, pickLatestApk, formatBytes, parseReadmeHashes } from './latestApk'

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

describe('parseReadmeHashes', () => {
  const README = [
    '### Verify your download (optional)',
    '- **SHA-256 of the APK:** `9723f39c6645f7ecbc87a6fffaebd0d090098f0d06bf840001bed295e7117a7b`',
    '  (`sha256sum pharmacy-manual-v0.3.0.apk`)',
    '- **Signing certificate SHA-256:** `98a8ac45aa15f1c068ff8c7a6602592b0472be353bfb22158c43dd53f05b9403`',
  ].join('\n')

  it('extracts both fingerprints from the README', () => {
    expect(parseReadmeHashes(README)).toEqual({
      apkSha256: '9723f39c6645f7ecbc87a6fffaebd0d090098f0d06bf840001bed295e7117a7b',
      certSha256: '98a8ac45aa15f1c068ff8c7a6602592b0472be353bfb22158c43dd53f05b9403',
    })
  })

  it('returns nulls when the README has no fingerprints', () => {
    expect(parseReadmeHashes('# Pharmacy Manual\n\nNo hashes here.')).toEqual({
      apkSha256: null,
      certSha256: null,
    })
  })
})
