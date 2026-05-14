# Wikidata Q-Item Creation Guide — Abo-Elmakarem Shohoud

## Why Wikidata (not Wikipedia)

Wikidata is a structured-data graph, not a narrative encyclopedia. The notability bar is simply "anything you can cite with a stable URL" — no "significant coverage in secondary sources" required, unlike Wikipedia. Once a Q-item exists, AI search systems (ChatGPT web search, Perplexity, Google AI Overviews / Knowledge Graph, Bing Copilot) use it as the canonical entity record for disambiguation, linking your name to your work, employer, and identifiers. This is the single highest-leverage GEO move for an individual professional without press coverage.

## Workflow

1. Go to https://www.wikidata.org and click **Create account** (top-right). Pick a username, confirm email.
2. While signed in, open https://www.wikidata.org/wiki/Special:NewItem
3. Fill the four base fields (English label/description + Arabic label/description). Click **Create**.
4. On the new item page, add aliases via **edit** next to each language row.
5. For each row in the **Statements** table below: click **+ add statement**, type the P-property number, pick the value, then click **+ add reference** under the statement and paste a source URL with property **P854 (reference URL)**.
6. Click **publish** on each statement. The Q-number is shown at the top (e.g. `Q123456789`).

## Base fields (paste-ready)

| Field | Value |
|---|---|
| Label (en) | `Abo-Elmakarem Shohoud` |
| Description (en) | `Egyptian full-stack developer, DevOps engineer and Scrum Master at Ailigent, based in Cairo` |
| Label (ar) | `ابوالمكارم شهود` |
| Description (ar) | `مطور برمجيات Full-Stack ومهندس DevOps وسكرام ماستر في شركة Ailigent، يقيم في القاهرة` |
| Aliases (en) | `Karem Shohoud` · `Abo Elmakarem` · `Abo-Elmakarem` · `karem shohoud` |
| Aliases (ar) | `كارم شهود` · `أبو المكارم شهود` |

Descriptions are under Wikidata's 250-char limit and avoid promotional language (required).

## Statements

Add these one at a time. All Q/P numbers below were verified against wikidata.org.

| Property | Value | Reference URL |
|---|---|---|
| **P31** instance of | **Q5** human | https://aboelmakarem.pro |
| **P21** sex or gender | **Q6581097** male | https://aboelmakarem.pro |
| **P27** country of citizenship | **Q79** Egypt | https://aboelmakarem.pro |
| **P1559** name in native language | `ابوالمكارم شهود` (monolingual text, language = ar) | https://aboelmakarem.pro |
| **P106** occupation | **Q96072517** full stack developer | https://aboelmakarem.pro |
| **P106** occupation | **Q5482740** programmer | https://github.com/karem505 |
| **P106** occupation | **Q15618675** scrum master | https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244 |
| **P106** occupation | **Q1017553** business analyst | https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244 |
| **P937** work location | **Q85** Cairo | https://aboelmakarem.pro |
| **P1412** languages spoken/written | **Q13955** Arabic | https://aboelmakarem.pro |
| **P1412** languages spoken/written | **Q1860** English | https://aboelmakarem.pro |
| **P856** official website | `https://aboelmakarem.pro` | (self-referencing — no extra ref needed) |
| **P2002** X (Twitter) username | `karem_shohud` | https://twitter.com/karem_shohud |
| **P2037** GitHub username | `karem505` | https://github.com/karem505 |
| **P6634** LinkedIn personal profile ID | `abo-el-makarem-shohoud-745367244` | https://www.linkedin.com/in/abo-el-makarem-shohoud-745367244 |

### Optional / leave blank

- **P19** place of birth — skip unless you want to publish Cairo or another city. Optional.
- **P569** date of birth — skip unless you're comfortable publishing it. Optional and often omitted for privacy.
- **P108** employer (Ailigent) — **skip for now.** Ailigent has no Wikidata Q-item; creating one for a small private company will likely be deleted as non-notable. If you ever want it, the cleanest path is: add Ailigent as a string-only statement using `P2561` (name) on a future item, or simply mention "Ailigent" inside the English description (already done above).
- **DevOps engineer occupation** — no clean Wikidata item exists yet (Q110262633 is the "DevOps" practice, not an occupation). Cover this via the English description string instead of a P106 statement. If a `DevOps engineer` item is created later, add it then.

## Verifiability — what counts as a source

Wikidata is far more permissive than Wikipedia. For statements about a living person's own professional details, these are all acceptable references:

- **aboelmakarem.pro** — self-published personal site is OK for non-controversial claims (occupation, location, languages, identifiers).
- **LinkedIn profile** — OK for employment, location, and work history.
- **GitHub profile** — OK as a primary source for the technical profile and as the canonical reference for P2037.
- **Twitter/X profile** — OK as the canonical reference for P2002.

Wikidata explicitly accepts self-published sources for non-extraordinary claims about the subject. You do NOT need third-party press coverage.

## After creation — checklist

- [ ] Note the assigned **Q-number** (top of the item page, format `Q` + 8–9 digits).
- [ ] Send the Q-number to the dev so `components/JsonLd.tsx` Person schema can be updated:
  - Add `"identifier": "Qxxxxxxxx"`
  - Add `"https://www.wikidata.org/wiki/Qxxxxxxxx"` to the `sameAs` array
- [ ] Wait 2–6 weeks for Google Knowledge Graph to crawl Wikidata and link the entity.
- [ ] Re-run `/seo-geo` on aboelmakarem.pro to confirm the entity is now detected by AI crawler heuristics.
- [ ] (Optional) Submit `https://www.wikidata.org/wiki/Qxxxxxxxx` via IndexNow so Bing picks it up:
  ```bash
  curl -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json" \
    -d '{"host":"aboelmakarem.pro","key":"aboelmakarem2026indexnowkey","keyLocation":"https://aboelmakarem.pro/aboelmakarem2026indexnowkey.txt","urlList":["https://www.wikidata.org/wiki/Qxxxxxxxx"]}'
  ```

## Common gotchas

- **Don't use promotional language** in the description ("expert", "leading", "talented"). Stick to factual job titles + location.
- **Arabic label must be the Arabic-script form** (`ابوالمكارم شهود`), not a transliteration.
- **Don't add unverified employer claims.** If Ailigent gets challenged, the whole item may be flagged. Cleaner to omit.
- **Add at least one reference per statement.** Unsourced items get tagged and sometimes deleted by patrollers.
- **If the item is deleted**, it's usually because aliases conflict with a non-notable claim. Recreate without the contested statement.
