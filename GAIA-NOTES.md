# Notes

## Architecture & Rendering

### Dynamic Page Engine
The site is built on a block-based CMS architecture using Contentful's `landingPage` content type. Each page is composed of an ordered `blocks` array — currently supporting `heroBlock` and `reviewsBlock` — which the `app/[slug]/page.tsx` server component iterates and maps to React components.

The renderer uses a chain of `if (contentTypeId === '...')` checks rather than a generic registry. This is intentional: `reviewsBlock` requires a data transformation step (mapping raw Contentful entries into typed `Review[]` objects) before rendering, which fits naturally in the if/else structure. Unknown or unpublished blocks fall through to `return null`, so CMS editors can safely work with draft content without breaking the page.

### Data Fetching & ISR Strategy
Pages are fetched server-side using Contentful's REST client and statically cached via Next.js ISR (`revalidate = 60`). This means:
- **First visit after cache expiry**: Next.js serves the stale page immediately and rebuilds in the background — no user-facing latency.
- **On content publish**: Contentful sends a webhook to `/api/revalidation`, which invalidates the cache immediately. Marketing sees their changes live within seconds, not after 60 seconds.

The balance: page loads are fast because they serve pre-rendered HTML from the CDN edge. Marketing's speed-to-publish is handled by on-demand revalidation, not by shrinking the revalidation window.

### Performance
- **Server components by default**: all data fetching is server-side. `'use client'` is scoped only to components that need browser APIs — HeroBlock (modal state), ReviewsCarousel (scroll/keyboard), LeadCaptureForm (form state).
- **Image optimization**: `next/image` is configured with Contentful's CDN (`images.ctfassets.net`) whitelisted in `remotePatterns`. Plain `<img>` tags should not be used.
- **Loading state**: `app/[slug]/loading.tsx` provides a skeleton mirroring the Hero + Reviews layout, shown automatically by Next.js on cache misses.

---

## Execution of Business Goals

### Reviews Carousel — Accessibility
- `role="region"` with `aria-label="Customer reviews"` scopes the landmark for screen readers.
- The scroll track is a `<ul role="list">` with each card as `<li role="listitem">` — correct semantics for a navigable collection.
- Cards are `tabIndex={0}` and keyboard-navigable via `ArrowLeft`/`ArrowRight`, handled via a `keydown` listener on the track.
- Star ratings use `role="img"` with `aria-label="{n} out of 5 stars"`; individual SVG stars are `aria-hidden`.
- `prefers-reduced-motion` is respected — scroll behavior switches from `smooth` to `instant`.

### Reviews Carousel — Top-of-Funnel
- JSON-LD structured data (`schema.org/Review`) is injected per-carousel, enabling Google to surface star ratings as rich snippets in search results, directly increasing organic CTR.
- The carousel is a standalone CMS block, so Marketing can reorder it relative to the hero or remove it entirely without a code deploy.

---

## Form Architecture & Data Flow

### State Management
`LeadCaptureForm` holds a single flat `FormState` object in `useState`. Every field is a controlled input. Conditional fields (`financeAck`, `carbFloorAck`) are derived from state rather than stored separately — `showFinanceAck` and `showCarbFloorAck` are computed booleans that gate both rendering and submit-time validation.

`useState` was chosen deliberately over React Hook Form. For this scope — five base fields, two conditional acknowledgements, one validation rule — adding RHF would introduce a dependency without solving a real problem. The threshold for RHF is when the form grows to 10+ fields, validation rules need to be shared with a server-side schema (e.g. Zod), or the codebase standardises on it across multiple forms. At that point the migration is straightforward since the state shape and business logic are already cleanly separated from the form rendering.

### Sales Routing Payload
On submit, `computeSalesRoutingPods(state)` derives the routing array:
- Company size `501-1000` / `1000+`, or interest in `CrumbTrail Analytics` → `enterprise_pod`; otherwise `smb_pod`.
- Interest in `C.A.R.B. Fleet` → additionally appends `hardware_specialist_pod`.

The final payload is a flat object with snake_case keys, structured for direct CRM ingestion.

### Scaling to 15+ Routing Rules
The current `computeSalesRoutingPods` function uses imperative if/else logic that would become unmaintainable at scale. The right move is a **rule engine pattern**: an array of rule objects, each with a `condition: (state) => boolean` and a `pod: SalesPod`. The engine reduces over the rules and collects all matching pods — rules become declarative, independently testable, and editable without touching control flow.

```ts
const rules: { condition: (s: FormState) => boolean; pod: SalesPod }[] = [
  { condition: (s) => s.companySize === '1000+', pod: 'enterprise_pod' },
  { condition: (s) => s.productInterests.includes('C.A.R.B. Fleet'), pod: 'hardware_specialist_pod' },
  // ...
];
const pods = [...new Set(rules.filter(r => r.condition(state)).map(r => r.pod))];
```

---

## Visibility & Measurement

### Engineering
- **Uptime monitoring**: a service like Checkly or Better Uptime pinging the production URL on a schedule, alerting on non-2xx responses or timeouts.
- **Error tracking**: Sentry to capture client-side and server-side exceptions with stack traces and session context.
- **Webhook delivery**: monitor the `/api/revalidation` route for failures — a failed webhook means stale content silently persists for editors.
- **Core Web Vitals**: Vercel Analytics or a RUM tool to track LCP, CLS, FID with real user data, not just Lighthouse scores.

### Marketing
- **GA4** is already instrumented. Next step is custom events:
  - CTA button click → `cta_click`
  - Demo form submission → `generate_lead` (GA4's recommended lead gen event)
- **Funnel analysis**: GA4 Explore → Funnel exploration: page view → CTA click → form submit → success. Identifies exactly where drop-off happens.
- **Conversion rate by slug**: since multiple landing pages may exist, segment by `page_path` to compare which CMS content drives more leads.

---

## Production Readiness

### Security & Validation
- **Form**: server-side validation is missing. Before connecting to a real CRM, inputs must be validated and sanitised server-side (email format, string length limits, enum membership for dropdowns).
- **Rate limiting**: the form endpoint and `/api/revalidation` route should be rate-limited to prevent abuse — Vercel's Edge Middleware or Upstash Rate Limit are good fits.
- **Revalidation secret**: confirm the `/api/revalidation` route verifies the shared secret from Contentful's webhook headers before going to production.
- **Content Security Policy**: add CSP headers to restrict script sources — currently GA4 and GTM load from external origins without explicit allowlisting.

### Data Integrity
- **Lead deduplication**: the form disables re-submission in-session via `submitted` state, but the CRM integration should handle deduplication server-side on email.
- **Error states**: if the CRM POST fails, the user currently sees nothing. A proper error state and retry path are needed before launch.
- **Scalability**: ISR handles traffic spikes well — the CDN serves cached HTML regardless of origin load. If the Contentful fetch becomes a bottleneck (many slugs, deep `include` depth), consider caching the response at the application layer between ISR rebuilds.

---

## If I Had More Time

- **Component registry pattern**: a `const registry = { heroBlock: HeroBlock, ... }` object would be worth introducing at ~6–8 block types when the if/else chain becomes unwieldy. The current approach has an advantage: `reviewsBlock` requires a data transformation step (mapping raw Contentful entries into typed `Review[]`) that fits naturally in if/else. Revisit when a new block type with no transformation is added.
- **Rule engine for sales routing**: formalise the routing logic before the rule count grows, as described above.
- **Form → CRM integration**: replace the `console.log` with a real POST to HubSpot/Salesforce/etc., with server-side validation, error handling, and retry.
- **E2E tests**: Playwright smoke tests covering landing page render, CTA → modal open, and form submit flow.
- **React Hook Form + Zod**: the current form uses `useState` with manual validation. For this scope — one form, five base fields, two conditional acknowledgements — `useState` is the right call. RHF becomes worth the dependency when: (a) the form grows to 10+ fields, (b) validation rules need a shared schema (e.g. Zod) to be reused server-side, or (c) the team standardises on it across multiple forms. Adding it now would be over-engineering.
- **CSS modules + design tokens over Tailwind**: Tailwind is fast to scaffold but creates friction with designers and makes systematic visual changes harder. The preferred direction is CSS modules per component (already used for Footer) paired with a design token layer — CSS custom properties defined once (`--color-bg`, `--color-accent`, `--color-highlight`) and consumed everywhere. This makes handoff cleaner and a full rebrand a one-file change rather than a grep-and-replace across every component.
- **Carousel library**: the current `ReviewsCarousel` hand-rolls scroll snapping, keyboard navigation, and focus management. A library like **Embla Carousel** (headless, ~7kb, excellent touch/keyboard support) or **Splide** (slightly heavier but with strong built-in accessibility) would handle this more robustly and allow the component to be truly reusable — accepting `children` rather than being coupled to `Review` data. The carousel should be a generic `<Carousel>` wrapper with `<ReviewCard>` passed as children, not a single monolithic component.
- **Carousel edge fades**: add left/right gradient overlays on `ReviewsCarousel` fading from `bg-brand-navy` to transparent, so cards don't look cut off when swiping. Implemented as absolutely positioned `pointer-events-none` divs at `z-[1]` inside a relative wrapper, with carousel arrow buttons above at `z-10`.
- **AI editor blueprint**: create a `CLAUDE.md` (or equivalent) that documents the design system, component conventions, color tokens, and styling rules so that AI editors (Claude, Copilot, Cursor, etc.) can keep building in the same style without drifting — covering things like the brand color palette, Tailwind-only styling (no CSS modules), button patterns, and block-based CMS architecture.

---

## AI Workflow

**Prompted to AI:**
- The initial scaffolding session (~3pm Day 1) produced the bulk of the core components in one pass: `LeadCaptureForm`, `ReviewsCarousel`, `HeroBlock`, and the Contentful type definitions (`EntrySkeletonType` skeletons for all content types). This gave me a working skeleton to iterate on rather than starting from scratch.
- `LeadCaptureForm` business logic: the `computeSalesRoutingPods` routing function, conditional acknowledgement fields (Finance dept liability, C.A.R.B. Fleet floor check), and the final payload structure.
- `str()`, `assetUrl()`, `num()` helper functions in `[slug]/page.tsx` to safely handle Contentful v11's locale-keyed field format and prevent render crashes on missing data.
- JSON-LD structured data on `ReviewsCarousel` for SEO rich snippets.
- NOTES.md architecture writeups, scaling considerations, and production readiness sections.
- Styling passes, color system, Footer CSS-to-Tailwind migration, OG metadata, and 404 page.

**Where I had to course-correct or write logic myself:**
- The Vercel × Contentful starter is built around an articles pattern that had nothing to do with the brief. I worked through the starter's assumptions, then scrapped the articles routing entirely and re-architected around a flexible landing page engine — AI scaffolded on top of the wrong foundation initially.
- The `[slug]/page.tsx` block renderer needed significant rework after the initial scaffold: the data transformation layer for nested Contentful entries (especially `reviewsBlock` with its linked `review` entries) required manual handling that AI didn't get right the first time.
- Identified that `revalidateTag("articles")` in the webhook route was a dead-end — the Contentful SDK doesn't use Next.js `fetch()` so cache tags never applied. Rewrote it to `revalidatePath()` with slug extraction from the Contentful webhook payload.
- Visual QA catches: carousel arrow contrast (white buttons invisible on white cards), favicon triangle issue. Both required human eyes to spot and diagnose.
