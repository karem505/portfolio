// Production-preview acceptance tests. Never submit forms or call third-party services.
// PLAYWRIGHT_MODULE=/path/to/playwright-core/index.mjs MOTION_TEST_URL=http://127.0.0.1:3022 node scripts/test-home-regression.mjs
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright-core')
const base = process.env.MOTION_TEST_URL || 'http://127.0.0.1:3022'
const output = process.env.MOTION_TEST_OUTPUT || '/tmp/mywebsite-motion-regression'
await mkdir(output, { recursive: true })
let browser
const launch = () => chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const results = []
const cases = ['en','ar'].flatMap(lang => [
  { id: `${lang}-desktop`, lang, w: 1440, h: 900 },
  { id: `${lang}-mobile`, lang, w: 390, h: 844 },
  { id: `${lang}-small`, lang, w: 360, h: 740 },
  { id: `${lang}-tablet`, lang, w: 768, h: 1024 },
  { id: `${lang}-reduced`, lang, w: 1440, h: 900, reduced: true },
  { id: `${lang}-nojs`, lang, w: 390, h: 844, nojs: true },
  { id: `${lang}-no-webgl`, lang, w: 1440, h: 900, nogl: true },
])
try {
  for (const c of cases) {
    // Isolate SwiftShader contexts; repeated context-loss tests can exhaust a shared GPU process.
    browser = await launch()
    const context = await browser.newContext({ viewport: { width: c.w, height: c.h }, javaScriptEnabled: !c.nojs, reducedMotion: c.reduced ? 'reduce' : 'no-preference', isMobile: c.w < 600, hasTouch: c.w < 600 })
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort())
    await context.addInitScript(({ nogl }) => {
      window.__draws = 0; window.__contexts = []
      const get = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (nogl && /webgl/.test(type)) return null
        const gl = get.call(this, type, ...args)
        if (gl && /webgl/.test(type) && !window.__contexts.includes(gl)) {
          window.__contexts.push(gl)
          for (const key of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
            const fn = gl[key]; if (fn) gl[key] = function (...params) { window.__draws++; return fn.apply(this, params) }
          }
        }
        return gl
      }
    }, { nogl: c.nogl })
    const page = await context.newPage(), errors = []
    page.on('pageerror', e => errors.push(e.message))
    const response = await page.goto(`${base}/?lang=${c.lang}`, { waitUntil: 'networkidle' })
    assert.equal(response.status(), 200)
    await page.waitForTimeout(800)
    const hero = await page.evaluate(() => {
      const rect = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { top:r.top, bottom:r.bottom, width:r.width } }
      return { name:rect('#home h1'), photo:rect('.hero-photo'), cta:rect('#home a[download]'), overflow:document.documentElement.scrollWidth>innerWidth }
    })
    assert.equal(hero.overflow, false, `${c.id}: horizontal overflow`)
    for (const key of ['name', 'photo']) assert(hero[key].top >= 0 && hero[key].bottom <= c.h, `${c.id}: ${key} not in the opening screen: ${JSON.stringify(hero)}`)
    if (c.w < 600) assert(hero.cta.bottom <= c.h, `${c.id}: portfolio CTA below fold`)
    assert.equal(await page.locator('#home h1').count(), 1)
    // Preserve the pre-existing bilingual SEO heading as well as the visible H1.
    assert.equal(await page.locator('h1').count(), 2)
    assert.equal(await page.locator('[data-assembly]').count(), 7)
    await page.screenshot({ path: `${output}/${c.id}-hero.png` })
    for (const id of ['about', 'experience', 'projects', 'contact']) {
      await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior: 'instant' }), id)
      await page.waitForTimeout(450)
      const hidden = await page.locator(`#${id} h2,#${id} h3,#${id} p,#${id} a:not([aria-hidden=true])`).evaluateAll(elements => elements.filter(el => {
        if (el.closest('[aria-hidden=true]')) return false
        const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.bottom <= 80 || r.top >= innerHeight) return false
        for (let n=el;n;n=n.parentElement) { const s=getComputedStyle(n); if (+s.opacity<.99||s.visibility==='hidden') return true }
        return false
      }).map(e=>e.textContent))
      assert.deepEqual(hidden, [], `${c.id} ${id}: concealed content`)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth), false)
    }
    if (!c.nojs) {
      const first = page.locator('[data-pin-card] a:not([tabindex="-1"])').first()
      await first.focus()
      await page.waitForFunction(() => { const e=document.activeElement,r=e?.getBoundingClientRect();return r&&r.top>=70&&r.bottom<=innerHeight }, null, { timeout: 4000 })
      assert.equal(await first.evaluate(e => getComputedStyle(e.closest('[data-pin-card]')).opacity), '1')
      const faq = page.locator('#faq button').first()
      await faq.scrollIntoViewIfNeeded(); await faq.click()
      assert.equal(await faq.getAttribute('aria-expanded'), 'true')
    }
    if (c.id.endsWith('-desktop')) {
      const target = page.locator('[data-assembly=expertise]')
      await target.scrollIntoViewIfNeeded(); await page.mouse.move(800, 350)
      await page.waitForFunction(() => document.querySelector('[data-assembly=expertise]').dataset.rendered==='true')
      const initial = await target.getAttribute('data-pose')
      assert((await page.evaluate(() => window.__draws))>0, 'GPU must actually render')
      await page.evaluate(() => scrollBy({ top:90, behavior:'instant' })); await page.waitForTimeout(400)
      assert.notEqual(await target.getAttribute('data-pose'), initial, 'scroll changes geometry')
      await page.evaluate(() => scrollBy({ top:-90, behavior:'instant' })); await page.waitForTimeout(400)
      assert.equal(await target.getAttribute('data-pose'), initial, 'reverse scroll restores exact pose')
      const idle = await page.evaluate(() => window.__draws); await page.waitForTimeout(600)
      assert.equal(await page.evaluate(() => window.__draws), idle, 'no idle GPU loop')
      await page.screenshot({ path:`${output}/${c.id}-expertise-3d.png` })
      for (const kind of ['tornix','oravex','costra','signature']) {
        await page.locator(`[data-assembly=${kind}]`).scrollIntoViewIfNeeded()
        await page.waitForFunction(kind=>document.querySelector(`[data-assembly=${kind}]`).dataset.rendered==='true',kind)
      }
      await page.screenshot({path:`${output}/${c.id}-signature-3d.png`})
      await page.emulateMedia({ reducedMotion:'reduce' }); await page.waitForTimeout(600)
      const reduced = await page.evaluate(() => window.__draws)
      await page.evaluate(()=>scrollBy({top:80,behavior:'instant'}));await page.waitForTimeout(500)
      assert.equal(await page.evaluate(()=>window.__draws),reduced)
      assert.equal(await page.locator('[data-rendered=true]').count(),0)
      await page.emulateMedia({ reducedMotion:'no-preference' }); await page.mouse.move(700,360)
      await page.waitForFunction(()=>document.querySelector('[data-assembly=signature]').dataset.rendered==='true')
      await page.evaluate(()=>{window.__lost=window.__contexts.at(-1).getExtension('WEBGL_lose_context');window.__lost.loseContext()})
      await page.waitForFunction(()=>!document.querySelector('[data-rendered=true]'))
      const lost = await page.evaluate(()=>window.__draws);await page.waitForTimeout(400)
      assert.equal(await page.evaluate(()=>window.__draws),lost)
      await page.evaluate(()=>window.__lost.restoreContext())
      await page.waitForFunction(()=>document.querySelector('[data-assembly=signature]').dataset.rendered==='true')
      await page.setViewportSize({width:390,height:844})
      await page.waitForTimeout(500)
      assert.equal(await page.locator('[data-rendered=true]').count(),0,'resize to mobile restores static artwork')
      const mobileDraws=await page.evaluate(()=>window.__draws)
      await page.evaluate(()=>scrollBy({top:30,behavior:'instant'}));await page.waitForTimeout(400)
      assert.equal(await page.evaluate(()=>window.__draws),mobileDraws)
      await page.setViewportSize({width:1440,height:900})
      await page.locator('[data-assembly=signature]').scrollIntoViewIfNeeded()
      await page.waitForFunction(()=>document.querySelector('[data-assembly=signature]').dataset.rendered==='true')
      const other=c.lang==='en'?'ar':'en'
      await page.locator(`nav button[aria-label="${other==='ar'?'العربية':'English'}"]:visible`).click()
      await page.waitForFunction(lang=>document.documentElement.lang===lang,other)
      assert.equal(await page.locator('[data-assembly]').count(),7,'language switch keeps a single set of art anchors')
      assert.equal(await page.locator('canvas').count(),1)
    } else if (!c.nojs) {
      assert.equal(await page.evaluate(()=>window.__draws),0,`${c.id}: static fallback should not use GPU`)
      assert.equal(await page.locator('[data-rendered=true]').count(),0)
    }
    assert.deepEqual(errors,[], `${c.id}: page errors`)
    results.push({ id:c.id,status:'PASS',hero }); console.log(`PASS ${c.id}`)
    await writeFile(`${output}/results.json`,JSON.stringify(results,null,2))
    await context.close(); await browser.close()
  }
} finally { await browser?.close() }
assert.equal(results.length,cases.length)
console.log(`${results.length} verified cases`)
