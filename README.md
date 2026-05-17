# SnackOverflow 🍪

A Next.js marketing site for SnackOverflow — an enterprise B2B SaaS platform for predictive office snack supply chain management. Built as a take-home assignment.

## Stack

- **Next.js App Router** — dynamic landing page engine driven by Contentful CMS
- **Contentful** — block-based content model (`heroBlock`, `reviewsBlock`, `leadCaptureBlock`) composable per page
- **TypeScript** — fully typed, including Contentful entry skeletons
- **Tailwind CSS** — responsive UI
- **Vercel** — deployment with ISR and on-demand revalidation via Contentful webhook

## Features

- Dynamic `[slug]` page engine — Marketing can spin up landing pages by stacking CMS blocks, no deploy needed
- Reviews carousel with full accessibility (keyboard nav, reduced motion, ARIA, JSON-LD structured data)
- Lead capture form with conditional business logic and sales routing payload
- On-demand ISR — Contentful webhook hits `/api/revalidation` to bust the cache on publish

## Environment Variables

```
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
CONTENTFUL_PREVIEW_ACCESS_TOKEN=
CONTENTFUL_REVALIDATE_SECRET=
CONTENTFUL_PREVIEW_SECRET=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the homepage, or [http://localhost:3000/b2b](http://localhost:3000/b2b) for the main landing page.
