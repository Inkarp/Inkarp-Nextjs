# Inkarp project review and long-term roadmap

Review date: 7 September 2026

## Assessment

The project already has substantial customer-facing functionality. Its best next investment is connecting product discovery, enquiries, sales follow-up, and instrument support into a dependable customer journey. More interactive sections alone will add maintenance without necessarily improving sales or repeat use.

Keep the existing Next.js application and evolve it incrementally. Long life depends on accurate content, reliable operations, clear ownership, and routine upgrades; no framework or feature removes that ongoing work.

## Scope and verification

- Reviewed route inventory, homepage/site layout, catalogue architecture, search, comparison, quote handling, accounts/authentication, service/career submissions, chatbot, analytics, SEO, deployment, and backup code. This is a broad source review, not a line-by-line audit of every product record.
- Production build passed using a separate `.next-audit` output directory; 188 static pages were generated.
- Twelve local HTTP checks passed: home, products, compare, quote, service, contact, application resources, a pharma workflow page, sign-in, sitemap, search API, and one product detail page.
- Sitemap returned 504 URLs. Individual sitemap URLs were not exhaustively crawled.
- Search for `evaporator` returned 23 results, with an autosampler first. This is a concrete relevance test case, not proof that all searches rank poorly.
- Source-scoped ESLint finished with 14 errors and 6 warnings, including React effect/state and hook-dependency findings. The unrestricted lint command was stopped because alternate build directories are not ignored by the current ESLint configuration. Resolve the source findings before making lint a release gate.
- No live enquiries, emails, logins, uploads, or external account changes were performed. Production monitoring, actual backup scheduling/restoration, database indexes, mobile appearance, keyboard/screen-reader behavior, and external integrations remain unverified.
- Application code was not changed. This document records recommendations.
- The temporary local server was stopped. Automatic approval review blocked cleanup of the generated `.next-audit` folder, which remains in the workspace.

## Existing capabilities worth retaining

The repository implements searchable/filterable products, detailed specifications, comparison, quote baskets, a printable quote document, passwordless accounts, saved baskets and request history, industry workflows, application resources, magazines, blogs, webinars, events, contact/service/career forms, calculators and selection guides, AI/catalogue chat with fallback, live chat integration, metadata, sitemap, breadcrumbs, and analytics hooks.

Do not plan these as new features. Extend their depth and operational usefulness.

## Fixes to prioritise before expansion

| Priority | Finding and source | Recommended correction |
|---|---|---|
| High | `src/app/api/forms/route.js` accepts unknown form types because missing required-field definitions default to an empty array. Arbitrary submitted fields are spread into the stored record. | Allowlist form types and fields; validate types and lengths; keep server-owned fields outside client-controlled spreads. |
| High | Quote-basket handling only checks for a nonempty items array; the comment about validation against the live catalogue is not implemented in this route. | Resolve submitted product IDs against the catalogue; enforce item limits and supported quantities; store a trusted product snapshot. |
| High | Forms, search-log, and careers routes have no application-level rate limiter in the reviewed code. Chat limits are in process; login limits are per email. Upstream protection is unknown. | Add shared abuse controls, request-size limits, and email/AI spending limits; test limits across workers. |
| High | `src/app/api/careers/submit/route.js` persists resume metadata but sends the file only as an email attachment. Once the record is saved, an email failure can leave no retained resume. | Store resumes privately with retention rules and authorised access; queue notifications with retry and delivery status. |
| High | `.github/workflows/deploy.yml` installs/builds directly on the serving checkout and restarts PM2, with no lint/test gate or explicit rollback. | Validate pull requests, use `npm ci`, build an isolated release, health-check it, and switch releases with rollback. Stop the deployment on command failure. |
| Medium | `src/app/api/search-log/route.js` writes `timestamp`, while `src/lib/auth/store.js` creates its expiry index on `createdAt`. Index setup also depends on auth-store activity. | Standardise the date field, migrate existing records, and provision indexes through an explicit migration/startup process. |
| Medium | `src/lib/mongodb.js` retains its initial connection promise even if it rejects. | Clear failed initial connection state so later requests can recover; add connection failure monitoring. |
| Medium | `src/lib/formValidation.js` requires GSTIN for single-product enquiries but intentionally omits it for basket enquiries. | Make initial enquiry requirements consistent; collect procurement/tax details when needed later in the sales process. |
| Medium | Submission persistence and email delivery are independent, and there is no durable notification retry workflow in the reviewed forms route. | Use a stored request plus an outbox/job queue; show customers an unambiguous request reference and track delivery failures internally. |
| Medium | `src/app/sitemap.js` defaults many modification dates to the current date. | Use actual content revision dates; preserve redirects when slugs change. |
| Medium | README is the starter template; no automated test suite was found. A backup script exists, but operation and restore success are unverified. | Write setup/deployment/recovery documentation and test key journeys. Schedule off-site backups and verify restoration. |

Application-level resource limits follow the concerns described in [OWASP API4: Unrestricted Resource Consumption](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/).

## Additions with the strongest long-term value

These priorities are based on the implemented B2B instrument-enquiry journey. Confirm them against sales/support workload and customer interviews before large investments.

| Order | Addition | Concrete first release | Value and dependency |
|---|---|---|---|
| 1 | Enquiry management and CRM connection | Every enquiry gets a reference, assigned branch/specialist, status, follow-up date, internal notes, and overdue alert. | Makes lead follow-up measurable. Choose one system of record and avoid duplicating a CRM the team already uses. |
| 2 | Product/content administration | Editors update specifications, brochures, product status, events, and articles through drafts, review, preview, and publishing. | Reduces developer dependence. Start with structured product schemas and stable IDs before selecting a CMS. |
| 3 | Customer instrument and service portal | Register serial-numbered instruments, view support tickets, installation dates, warranty details, documents, and maintenance reminders. | Gives customers a reason to return after purchase. Requires verified ownership and an internal service workflow. |
| 4 | Quote lifecycle | Extend existing request history with received/reviewing/quoted/closed status, quotation versions, secure downloads, and customer questions. | Reduces repeated calls and fragmented email. Depends on sales ownership and quote data integration. |
| 5 | Better search and meaningful comparison | Prioritise exact model/name matches, add scientific synonyms and typo tolerance, and normalise comparable specifications and units. | Improves selection using existing features. Build a reviewed search-query test set before introducing a separate search service. |
| 6 | Guided lab/project planning | Save a multi-instrument project including application, sample type, throughput, utilities, space, accessories, and an expert-reviewed equipment list. | Helps larger purchases. Reuse current workflows and calculators; do not duplicate them. |
| 7 | Resource and training centre | Link manuals, application notes, recorded webinars, training requests, and revision dates to products and workflows. | Supports discovery and post-sale use. Check document distribution rights and keep public material easy to access. |
| 8 | Funnel and service dashboard | Show search-to-product-to-enquiry conversion, no-result searches, response time, quote outcomes, and service turnaround. | Guides investment by observed demand. Existing dataLayer hooks and Vercel analytics are a starting point, not proof of a complete reporting pipeline. |
| 9 | More accountable AI assistance | Answers cite approved product/document sources, distinguish estimates from specifications, and transfer useful context to a specialist. | Improves the existing assistant. Add evaluation cases, configurable model selection, cost limits, and source revision tracking first. |
| 10 | Consumables and spare-parts reordering | Show compatible items against a customer's verified instrument and allow repeat-order requests. | Potential recurring value. Requires maintained compatibility, availability, and commercial data. |

## Architecture for a longer useful life

1. **Use one canonical catalogue.** Current data spans principal JSON files, workbook-derived records, and JavaScript detail/mapping files. Define product IDs, specification types/units, provenance, review dates, documents, region authorisation, lifecycle status, and replacement products. Validate imports and prevent duplicate slugs and broken assets.
2. **Separate business records from page components.** Model enquiries, quotes, organisations, instruments, service tickets, and documents explicitly. Give integrations documented APIs and retryable events. Preserve data export so changing providers remains possible.
3. **Keep the application modular without an immediate rewrite.** Organise catalogue, enquiries, account, service, content, and chat responsibilities within the current application. Introduce TypeScript gradually at data and API boundaries if the team can maintain it.
4. **Build appropriate staff access controls.** Sales, service, editors, and administrators should have scoped permissions and an audit trail. Customer organisation sharing needs verified invitations and explicit access checks. Add session revocation before sensitive staff administration.
5. **Treat content as maintained data.** Assign owners, review deadlines, approval rules, document revisions, and archived-product behavior. Record calculator assumptions and have specialists verify scientific claims.
6. **Make recovery routine.** Add uptime/error alerts, notification failure monitoring, database migrations, dependency update reviews, staged releases, and documented restore exercises. Agree recovery targets with the business rather than assuming a backup script meets them.

## Experience, accessibility, performance, and discoverability

- Simplify initial enquiry forms and preserve entered values after recoverable failures. Measure completion rates before and after changes.
- Test overlap among chat, quick actions, shortlists, promotional popups, and product engagement popups on small screens. Their coexistence is visible in code; an actual overlap defect was not visually verified.
- Test keyboard navigation, dialog focus/escape, labels, validation announcements, contrast, zoom, touch targets, and reduced motion against [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Existing reduced-motion rules are a useful start, not an accessibility certification.
- Profile client JavaScript on product pages: `UniversalProductPage.jsx` is a client component with many static interactive-section imports. Split expensive optional tools where measurement supports it.
- Some PDF assets are approximately 25–59 MB. Offer optimised reading/download versions, visible sizes, and appropriately cached document delivery. These sizes do not establish initial-page load cost.
- Measure actual field performance and conversion on mobile. Review production practices against the [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist); the successful build is not a performance benchmark.
- Improve product-specific sharing cards, accurate structured data where applicable, document linking, redirect coverage, and authentic industry/application content. Keep modification dates truthful.
- Review third-party tracking/chat loading and retention against the site's actual privacy commitments. Configure user choices where required; this review does not establish legal compliance.

## Suggested delivery sequence

The windows below are planning phases, not fixed effort estimates; scope depends on staffing, existing CRM/ERP systems, and data quality.

**First 30 days:** Fix form validation and data retention defects, secure resume persistence, establish deployment checks, reduce enquiry friction, baseline analytics, and document recovery. Define catalogue schema and enquiry ownership.

**Days 31–90:** Deliver enquiry routing/status and a small content-admin pilot. Improve search ranking using real queries. Add critical journey tests and delivery-failure alerts. Pilot quote status with one sales team.

**Months 3–6:** Pilot instrument registration and service tracking with one branch. Add secure documents and maintenance reminders. Expand content ownership and CRM integration based on measured adoption.

**After the foundations prove useful:** Add project collaboration, compatibility-aware reordering, source-backed AI improvements, and selected language support when customer demand justifies their content-maintenance cost.

## Success measures and operating ownership

- Sales: median first-response time, unassigned/overdue enquiries, enquiry-to-quote rate, quote-to-order rate.
- Service: ticket response/resolution times, overdue maintenance, repeat portal usage.
- Catalogue/content: missing-spec/document rate, overdue reviews, time required to publish an approved correction.
- Website: search success, no-result frequency, enquiry abandonment, mobile field performance.
- Engineering/operations: failed deployments, notification failure rate, recovery-test results, unresolved critical defects.
- AI owner: grounded-answer accuracy on approved examples, handoff success, fallback rate, and cost per useful conversation.

Set numeric targets after collecting a baseline. Assign an owner to each shipped feature and review usage quarterly; retire features that add upkeep without helping customers or staff.

The recommended first three investments are reliable enquiry follow-up, maintainable product administration, and a customer service portal. They extend the current work and connect the site to everyday business use.
