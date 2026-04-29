# Product

## Register

brand

## Users

The site serves three audiences in this order of priority:

1. **Recruiters and hiring managers** (primary). Scanning quickly. Need to verify role, stack, scale of work, and whether it's worth a 15-minute call. They land on the homepage from LinkedIn, a referral, or a search for the candidate's name. Decision window: roughly 30 seconds.
2. **Prospective clients** in Egypt, UAE, and KSA. Looking for someone who can build and ship full-stack, AI-powered SaaS — often Arabic-first. They want proof of comparable work (Tornix.ai, Oravex.app, Costra) and a clear path to contact.
3. **Engineers and readers** arriving at the blog from search or feed. They're after technical writing. They are not the conversion target, but their engagement reinforces credibility for the other two groups.

The site is read on a mix of desktop (recruiters, clients) and mobile (link-in-bio traffic, social referrals). Many users will read it in Arabic; bilingual is not optional.

## Product Purpose

A personal portfolio and blog for Abo-Elmakarem Shohoud (Karem), positioning him as a Full-Stack Developer, DevOps Engineer, Scrum Master, and Business Analyst at Ailigent who has shipped three production AI-powered SaaS products. The site has to do four things, in order:

1. Make recruiters confident in under 30 seconds that the role and seniority match what they need.
2. Show prospective clients the live products (Tornix.ai · Oravex.app · Costra) with enough credibility to start a conversation.
3. Host bilingual technical writing that compounds search authority over time.
4. Provide a friction-free contact path (form, phone, social).

Success looks like: recruiter outreach with role specifics rather than cold templates, client inquiries that already reference one of the SaaS products, and blog traffic from technical queries in both English and Arabic.

The CV (`Abo-Elmakarem_CV-1.pdf`) is the source of truth for identity, role, and product framing. The site must never reintroduce "CEO" or "Co-founder" language — the positioning is Full-Stack Developer / DevOps / Scrum Master / Business Analyst at Ailigent.

## Brand Personality

**Confident · Technical · Modern.**

- **Confident** — the work speaks. No hedging copy, no "passionate about" filler, no over-claimed titles. The site assumes the reader is smart and respects their time.
- **Technical** — concrete stack names, real product links, measurable claims. Nothing is decorative-only. If a section can't justify itself with substance, it's cut.
- **Modern** — current stack (Next.js App Router, TypeScript, Supabase), current motion language, current SEO posture (JSON-LD, IndexNow, hreflang). Looks like 2026, not a 2019 dev portfolio.

The voice is direct and engineer-spoken. First person where it makes sense. No corporate platitudes, no marketing-deck adjectives ("innovative", "cutting-edge", "passionate"). Arabic copy is treated with the same standard — translation quality, native typography, no machine-translation feel.

## Anti-references

This site explicitly should NOT look or feel like any of these:

- **Generic dev portfolios** — Wix / SquareSpace / template-shop output. Symptoms: cookie-cutter "Hi, I'm X" hero, identical project card grid, a "Skills" section with logo cloud, a "Hire me" button to a Calendly. We are not that.
- **Corporate enterprise** — IBM / Accenture / consultancy.com aesthetic. Symptoms: navy + grey neutrality, stock photography of people in suits, "Solutions" / "Services" / "Capabilities" navigation, paragraphs that say nothing. Not us.
- **Generic AI tool landing pages** — every YC AI startup since 2023. Symptoms: dark background + indigo-to-purple-to-pink gradient text, glow shadows on cards, glassmorphism panels, animated orb backgrounds, "AI-powered" stamped on every heading, three identical feature cards with icon + heading + paragraph. *This is the trap the current site is closest to falling into and the most important anti-reference for any future redesign.*

If a design choice could appear unchanged on a generic AI SaaS landing page, it is wrong for this site. Distinctiveness is the point.

## Design Principles

These five principles guide every design decision. Recruiter-conversion is the dominant lens — when principles conflict, recruiter clarity wins.

1. **Recruiters scan, clients read — both convert in under 30 seconds.** Every section above the fold, and every first paragraph below it, must answer "who, what role, what proof, what next" without scrolling laterally or hunting. Decorative pre-amble is forbidden. The hero, About, and Experience sections are scannable first, readable second.
2. **Practice what you preach.** The site itself is proof of the engineering claims. SEO health, Core Web Vitals, accessibility, RTL quality, JSON-LD coverage — the work shows by being built right, not by being claimed. A broken lighthouse score discredits the entire portfolio.
3. **Show, don't tell — link to live products, not screenshots.** Tornix.ai, Oravex.app, and Costra are public URLs. Projects link directly to the running products. Mockups and "coming soon" badges are forbidden. If it can't be linked, it doesn't go on the site.
4. **Bilingual is first-class, not an afterthought.** Arabic and English are equal surfaces — same hierarchy, same loading speed, same SEO indexability, same typographic care. RTL is not a stylesheet patch; it's a co-equal mode. Cairo + IBM Plex Sans Arabic, not English fonts forced to render Arabic.
5. **No category-reflex aesthetics.** The "developer portfolio → dark theme + purple gradients + glassmorphism + glow + animated orbs" combo is the AI training-data reflex. The site has to fight against landing there by default. Every visual decision should be defensible by a reason that isn't "this is what dev portfolios look like."

## Accessibility & Inclusion

- **Target:** WCAG 2.2 AA across both language modes.
- **Bilingual + RTL:** the Arabic surface must pass the same checks as English. Logical reading order, correctly mirrored layout, proper `dir` and `lang` attributes, no English-only ARIA labels.
- **Color:** all text passes 4.5:1 contrast against its background. Decorative gradients never carry meaning that color-blind users would lose; meaning lives in copy and structure.
- **Motion:** `prefers-reduced-motion` is respected. Decorative motion (orbital animations, parallax, gradient shifts, click radiate effects, custom cursor) is disabled or substantially reduced when the user opts out.
- **Keyboard + screen reader:** every interactive element is keyboard-reachable with a visible focus ring. The hidden SSR blog-link nav for Googlebot is `sr-only` — not display-none — so screen readers benefit too.
- **Mobile:** tap targets ≥ 44px. The site is read on mid-range Android in the GCC; performance on that profile is the floor, not the ceiling.
