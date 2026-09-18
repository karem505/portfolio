# Personal portfolio motion enhancement

Status: implemented and verified locally; production release approved on 2026-09-18. Deployment verification is recorded separately in the release evidence.
Preview: http://127.0.0.1:3022/ (Arabic: /?lang=ar).

## Design intent

Karem's name, face and professional identity lead. The conceptual “complexity to a working system” slogan was not added. Existing bilingual professional copy, titles, metadata, links and schema remain unchanged.

- Hero: prominent color portrait, two-line English name lockup, compact mobile composition with portrait/name/portfolio-download in the opening viewport. The existing download is a **portfolio PDF**, not a CV. Picture is priority-loaded and appropriately sized; WhatsApp number stays on one line.
- Motion: a subtle portrait-frame entrance supports the person. Desktop scroll-linked artwork adds expertise modules, career layers, a Tornix schedule, Oravex modules and Costra cost bars. These are discrete linked visual motifs, not a single persistent object morphing between sections.
- Projects: removed the pinned hidden-card reveal. All project copy and hit targets remain available in native document flow.
- Contact: the original lowercase `a.` brand mark is extruded and settles toward a front-facing pose above contact copy.
- Mobile/tablet/coarse pointer, reduced-motion and unavailable WebGL: SSR vector artwork remains visible. Desktop geometry is confined to reserved artwork regions and cannot cover the portrait or readable copy.

## Runtime

- `components/journey/AssemblyVisual.tsx`: SSR fallback artwork and original personal mark paths.
- `components/journey/GalaxyField.ts`: retained module name, new lazy Three.js renderer. One context, clipped/scissored regions, render-on-demand; no idle loop. Resources are disposed without forcing context loss when rebuilding on the same canvas.
- `components/journey/JourneyStage.tsx`: desktop/fine-pointer/reduced-motion gate, generation-safe lazy imports, visibility handling and GPU context recovery.
- `components/journey/home-enhancements.css`: homepage-only layout and decoration styles.
- `lib/journey/moments.ts`: finite, deterministic reversible poses.
- `lib/journey/reveal.ts`: opaque translation-only copy, no heading splitting/clipping.
- `lib/journey/useAnimeScope.ts`: language/preference/breakpoint rebuild and cleanup.

The original scroll-journey specification's pinned Projects and full-page galaxy behavior are superseded by this local implementation. Legacy field/galaxy pure helpers and tests remain; they are not the new renderer's source of poses. CLAUDE.md was not edited because its protected-file approval did not complete.

## Verified

- Production build: successful, including real public Supabase blog reads.
- Unit tests: 59 passing in 10 files.
- Browser acceptance: 14 passing cases (EN/AR × desktop, mobile, small mobile, tablet, reduced motion, no JavaScript, no WebGL).
- Desktop cases additionally exercise scroll forward/backward, actual GPU draw calls, zero idle draws, preference switching, context loss/restoration, resize down/up and live language switching.
- Visible content and keyboard project focus checked; FAQ expansion checked. No real contact/newsletter submission or analytics action was performed.
- SSR parity: zero differences in titles, metadata, canonical/hreflang, headings, anchors, schema, paragraph/list copy, hidden Arabic block and hidden-inline-content checks. Each language URL preserves 45 headings, 68 anchors and 6 JSON-LD scripts; zero inline opacity-zero content.
- Homepage Arabic continues using the existing client-language behavior and always-rendered Arabic SEO block. This work does not change that rendering contract.
- Existing dirty .gitignore, components/blog/BlogContent.tsx and proposals/wikidata-q-item.md matched their saved hashes after implementation.
- `git diff --check`: passes.
- `npm run lint`: NOT verified. Existing project has no configured ESLint setup; this command opens Next's setup wizard. No dependency/config changes were made to bypass that.

## Local performance evidence

Five alternating baseline/candidate cold-cache runs, 390×844 viewport, 4× CPU throttle, 150 ms latency, 200,000 bytes/sec download. Both production builds used the same actual public blog data. Medians:

- LCP: 2320 ms baseline → 2152 ms candidate.
- Layout shift: 0 → 0.
- Observed long-task excess: 1230 ms → 1095 ms. This is **not Lighthouse TBT**.
- Encoded script bytes observed at load: 171595 → 169516.

Earlier block-sequential measurements were noisy; the paired measurements above are the final comparison. These are local lab results, not Google field CWV, Lighthouse scores or proof of GPU smoothness on every device. Real-device scrolling and post-deploy field measurements remain recommended.

## Repeatable checks

Set `PLAYWRIGHT_MODULE` to an installed playwright-core module. `CHROMIUM_PATH` defaults to /usr/bin/chromium; output paths default to /tmp and may be overridden with `MOTION_TEST_OUTPUT`.

- `npm test`
- `npm run build`
- `MOTION_TEST_URL=http://127.0.0.1:3022 node scripts/test-home-regression.mjs`
- `node scripts/test-home-seo.mjs http://127.0.0.1:3020 baseline`
- `node scripts/test-home-seo.mjs http://127.0.0.1:3022 candidate`
- `PERF_RUNS=5 node scripts/measure-home-performance.mjs`

When comparing blog output, stale `.next/cache/fetch-cache` can retain older published posts across builds. Archive that cache before the comparison rebuild; do not hide genuine differences by excluding blog links from SEO assertions. Public Netlify read settings were injected only into build/start subprocess environments, without modifying .env files or exposing keys.

Evidence is stored outside the repo at `/home/karem505/.hermes/outputs/mywebsite-motion-review/` (regression screenshots/results, build logs, SSR signatures/comparison, paired-performance data and verified-summary.json).

## Release boundary

The local review was approved for deployment on 2026-09-18. Release only the homepage motion implementation, its tests/documentation, and the homepage sitemap modification date; exclude unrelated working-tree changes. Re-run deployment-specific checks against Netlify after release; local tests do not verify Netlify form delivery or real-user SEO outcomes.
