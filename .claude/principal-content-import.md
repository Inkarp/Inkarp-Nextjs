# Principal content import — reusable prompt

Copy everything below the line, fill in the two placeholders, paste as one message.

---

## PRINCIPAL CONTENT IMPORT — `<PRINCIPAL NAME>`

**Source of truth (every product for this principal):**

```
<paste all Google Doc / Sheet links here, one per line>
```

These documents are the **source of truth**. Where the site and a document
disagree, the document wins — including wording, ordering, and section names.
Do not "improve" on the document; do not invent facts, figures, prices, or
claims that are not in it.

### Hard scope boundary

Only `<PRINCIPAL NAME>` products may change. **No other principal, product, or
page may render differently after this work.** Shared components may be extended
only in ways that stay inert unless a product's own data opts in. If a change
cannot be made without touching other pages, stop and tell me instead of doing it.

---

## PHASE 1 — AUDIT ONLY. Change no files.

1. **Pull each document as raw text**, not via a summarizing fetch:
   `curl -sL "https://docs.google.com/document/d/<ID>/export?format=txt" -o doc.txt`
   (Sheets: `/export?format=csv&gid=<GID>`.) Work from the raw text — a
   summarizer drops rows and silently loses table cells.

2. **Locate the principal in the repo**: `src/data/principals/<principal>/*.json`,
   plus `src/data/principals/catalog.js`, `workbook-product-metadata.json`,
   `src/data/products/productImageMap.js`, and `src/data/productWorkflows.js`.

3. **Map every document `<H1>` to a product slug.** Report any document product
   with no page, any page with no document, and any slug/name mismatch.

4. **Content diff.** Normalize (lowercase, strip punctuation/accents/®) and check
   every document line — bullets, table cells, FAQ questions, CTA labels — against
   the flattened product JSON. Then **verify every miss by hand before reporting it.**
   These are routinely false positives, not gaps:
   - stats and config notes stored as split `value`/`label` or `title`/`description`
   - table column headers stored in `columnHeaders`
   - copy deliberately rewritten or expanded from the document's terse phrasing
   - content that lives inside a tab panel and so is absent from server HTML

5. **Count check** per product: quick stats, key features, applications rows,
   spec rows, comparison rows, industries, service areas, doc resources, FAQs.
   Count table rows by the table's real column count.

6. **UI gap checklist** — walk all of these explicitly:
   - **Data with no renderer**: keys present in JSON that no component reads.
   - **Renderer with no data**: sections the doc specifies that no key feeds.
   - **Module type mismatch**: a module the doc calls a *Calculator* built as a
     multiple-choice picker, or vice versa. Numeric inputs and a computed
     readout are not optional when the doc says "Enter…" and "readout".
   - **CTA coverage**: every module CTA, the Documentation CTA, the hero
     secondary CTA, and the Final CTA — label text must match the document.
   - **Duplicate `<h2>`**: usually `booking.title` equal to `longForm.cta.title`.
   - **`inPageNav`**: every anchor must resolve to a rendered section id.
   - **SEO**: rendered `<title>`, `<meta name="description">`, `<meta name="keywords">`.
     A product missing its `workbook-product-metadata.json` entry silently falls
     back to a generic title — check the rendered head, not the JSON.
   - **Images**: each product's own image, not a sibling's or the principal
     fallback. Confirm the file exists and returns 200.
   - **Section shape**: multi-paragraph document sections flattened into one
     `description` string instead of a `body` array.
   - **`tabSummary`** present for each tab.
   - **Sitemap**: every product slug present.
   - **Dead internal links** in `internalLinks` (note whether anything renders them).
   - **Workbook metadata override collision**: if the product's `slug` matches a row in
     `workbook-product-metadata.json`, `applyWorkbookMetadata()` in `catalog.js` does
     `{...product, ...metadataFields}` — the workbook row's `applications` (if non-empty)
     silently **replaces** the product JSON's own `applications` array, since `applications`
     is in `WORKBOOK_METADATA_FIELDS`. This breaks the Applications tab (which renders
     `product.applications` directly) with the workbook's terse 1-2 word tags instead of the
     authored copy. Check `bySlug`/`byKey` in `getWorkbookMetadataMaps()` for a match before
     writing `applications`, and if the workbook row's version is a placeholder, set that row's
     `applications` to `[]` in `workbook-product-metadata.json` (an empty array is skipped by
     `getWorkbookMetadataFields`, so the product's own array survives). Same risk applies to
     every other field in `WORKBOOK_METADATA_FIELDS` (canonicalUrl, breadcrumbPath, imageAlt,
     h1, subhead, metaTitle/Description/Keywords, manufacturerUrl, internalLinks,
     synonymUseCaseKeywords, searchKeywords, usp, processApplication) — harmless if your
     authored value already matches the workbook row, worth a diff if it doesn't.

7. **Report** — group as: *Content complete* (with the count table), *Content
   gaps*, *UI gaps*, *Structural differences from the doc*, *Data hygiene*.
   Rank by impact. State plainly what is already correct — do not pad the list.
   End with a numbered list of proposed changes, most valuable first.

**Then stop and wait for my approval.**

---

## PHASE 2 — IMPLEMENT (only after I approve, and only what I approve)

### Reuse before building

Prefer an existing section component and give it new content. Add a new
component only when the data shape genuinely differs from everything in
`src/components/products/sections/`. If two products need the same new thing,
build it once, data-driven, and use it for both.

### Every new render path must be data-gated

Add the section in `UniversalProductPage.jsx` as `product.<newKey> && {…}` so it
cannot appear on a product that does not define the key. When extending a shared
component, keep today's behaviour as the fallback:

```js
const label = data?.ctaLabel ?? 'existing default';   // yes
```

Never change a shared component's default output.

### Before choosing a product key, check for collisions

`grep -n "product\." src/components/products/UniversalProductPage.jsx` — key names
are already taken (`calculator` is SolventCalculator, `planners`, `suitability`,
`configWizard`, `comparison`, …). A duplicate key mounts two sections and produces
duplicate headings.

### Editing product JSON

- **Targeted string or line replacement only.** Never `json.dump` the whole file —
  it reformats compact objects and produces a 100k-line diff.
- Re-validate with `json.load` after every edit.
- Match the surrounding indentation exactly.
- Beware commented-out code when string-matching in `.jsx` — several files carry
  a disabled slide with near-identical markup that will absorb your replacement.
  Split the file at the live function first.

### Other places a new section may need registering

- new form types → `src/app/api/forms/route.js` (labels, required fields, acknowledgement)
- new anchors → the product's `inPageNav`
- new images → `src/data/products/productImageMap.js`
- new keyframes → reuse what is in `src/app/globals.css` before adding any

### Never invent numbers

If the document asks for a cost or savings figure it does not supply, take the
rate as a user input and compute from it. State constants and their source in the
section disclaimer.

---

## VERIFICATION — required, report the output

1. `npx next build` — must compile and prerender cleanly.
2. `npx next start -p <free port>` — **check the log line actually says it bound.**
   A port collision returns another server's HTML and produces confident, wrong results.
3. Crawl **every** product page for this principal. Report per product: HTTP status,
   rendered section ids, dead `inPageNav` anchors, duplicate `<h2>`, `<title>`/description/
   keywords, product image URL, and any new markers your change adds.
4. If a calculator or interactive module was added, print its **rendered default
   readout** and check the arithmetic by hand in the report.
5. **Regression sweep**: sample at least 15 untouched products — including any that
   share a component or key you touched — and assert the new markers appear **zero**
   times and their existing sections are unchanged. Report `N/N unchanged, 0 regressions`.
6. `git status --short` so the changed-file list is visible.

Do not commit unless I ask.

---

## Report honestly

If something is blocked, partly done, or you are unsure a change is safe, say so
in a sentence and carry on with the rest. If a verification step fails, show the
output rather than describing it. Correct earlier claims of yours that turn out
to be wrong, briefly, and move on.
