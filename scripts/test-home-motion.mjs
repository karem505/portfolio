// Local-only browser regression. PLAYWRIGHT_MODULE may point to an installed playwright-core.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core')
const output = process.env.MOTION_TEST_OUTPUT || '/tmp/mywebsite-motion-tests'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const test = process.env.MOTION_CASE || 'hero'
const results = []
try {
  for (const lang of ['en', 'ar']) {
    const page = await browser.newPage({ viewport: test === 'hero' ? { width: 390, height: 844 } : { width: 1440, height: 1000 } })
    await page.addInitScript(() => {
      window.__draws = 0
      for (const name of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
        const original = WebGL2RenderingContext.prototype[name]
        WebGL2RenderingContext.prototype[name] = function (...args) { window.__draws++; return original.apply(this, args) }
      }
    })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    // No task verification should send analytics or exercise remote services.
    await page.route('**/*', route => {
      const url = new URL(route.request().url())
      return ['127.0.0.1', 'localhost'].includes(url.hostname) ? route.continue() : route.abort()
    })
    await page.goto(`${process.env.MOTION_TEST_URL || 'http://127.0.0.1:3021'}/?lang=${lang}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    if (test === 'hero') {
      const cta = await page.locator('#home a[download]').boundingBox()
      const portrait = await page.locator('.hero-photo').boundingBox()
      await page.screenshot({ path: `${output}/hero-${lang}.png` })
      assert(cta && cta.y >= 0 && cta.y + cta.height <= 844, `${lang}: primary CTA must fit initial viewport; ${JSON.stringify(cta)}`)
      assert(portrait && portrait.y >= 0 && portrait.y + portrait.height <= 844, `${lang}: portrait must remain in first screen`)
      const name = await page.locator('#home h1').boundingBox()
      assert(name && name.y >= 0 && name.y + name.height <= 844, `${lang}: name must remain in first screen`)
      assert(portrait.y < cta.y, `${lang}: personal portrait leads before CTA`)
    }
    if (test === 'lifecycle') {
      await page.locator('[data-assembly=expertise]').scrollIntoViewIfNeeded()
      await page.mouse.move(600, 350)
      await page.waitForSelector('.journey-canvas.is-ready', { state: 'attached', timeout: 15000 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.waitForTimeout(700)
      const before = await page.evaluate(() => window.__draws)
      await page.waitForTimeout(700)
      assert.equal(await page.evaluate(() => window.__draws), before, 'reduce stops actual WebGL draws')
      assert.equal(await page.locator('.journey-canvas.is-ready').count(), 0, 'reduce restores fallback')
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.mouse.move(620, 360)
      await page.waitForSelector('.journey-canvas.is-ready', { state: 'attached', timeout: 15000 })
      assert(await page.evaluate(() => window.__draws) > before, 'restore restarts lazy WebGL')
    }
    if (test === 'projects') {
      await page.locator('#projects').scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
      const cards = await page.locator('[data-pin-card]').evaluateAll(cards => cards.map(card => {
        const style = getComputedStyle(card)
        return { opacity: style.opacity, transform: style.transform, text: card.textContent, links: card.querySelectorAll('a[href]').length }
      }))
      assert.equal(cards.length, 3)
      for (const card of cards) {
        assert.equal(card.opacity, '1', 'Every project stays readable at entry')
        assert.equal(card.transform, 'none', 'Project hit targets stay in their slots')
        assert(card.links > 0)
      }
      assert.equal(await page.locator('#projects').getAttribute('data-pinned'), null)
      await page.screenshot({ path: `${output}/projects-${lang}.png` })
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${lang}: horizontal overflow`)
    assert.deepEqual(errors, [])
    results.push({ test, lang, status: 'PASS' })
    await page.close()
  }
} finally {
  await writeFile(`${output}/${test}-results.json`, JSON.stringify(results, null, 2))
  await browser.close()
}
console.log(JSON.stringify(results))
