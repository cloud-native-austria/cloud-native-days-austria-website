# Cloud Native Days Austria Website - Gatsby to Astro Migration Roadmap

This document tracks the migration progress from Gatsby to Astro with vanilla CSS.

## Overview

- **From**: Gatsby + React + Tailwind CSS
- **To**: Astro + TypeScript + Vanilla CSS (Preact only for live page)
- **Package Manager**: Bun
- **TypeScript**: Strict mode, all code typed
- **Target**: Modern browsers only (no IE11, no legacy fallbacks)

## Migration Progress

### Phase 1: Foundation

- [x] **Step 1: Create ROADMAP.md and AGENTS.md**
  - Documentation for migration tracking
  - AI agent instructions for consistent contributions

- [x] **Step 2: Initialize Astro project with Bun and TypeScript**
  - ✅ Created `astro.config.ts` with `@astrojs/sitemap` and `@astrojs/preact`
  - ✅ Set up TypeScript with strict mode in `tsconfig.json`
  - ✅ Set up path aliases in `tsconfig.json` (`@components`, `@layouts`, `@images`, `@icons`, `@lib`)
  - ✅ Converted all config and constant files to TypeScript
  - ✅ Updated `package.json` with Astro dependencies, installed with `bun install`
  - ✅ Copied `static/` assets to `public/` (fonts, images, sponsors)
  - ✅ Deleted: `tailwind.config.js`, `postcss.config.js`
  - ⏳ Pending deletion: `gatsby-*.js` files (kept for reference, renamed old pages with `_old_` prefix)

- [x] **Step 3: Create global styles and design tokens**
  - ✅ Created `src/styles/global.css` with CSS custom properties
  - ✅ Brand colors: `--color-purple`, `--color-pink`, `--color-orange`
  - ✅ Added `@font-face` for Plus Jakarta Sans and Fira Code
  - ⏳ Pending: Delete old Tailwind files in `src/styles/`

- [x] **Step 4: Build Layout and SEO foundation**
  - ✅ Created `src/layouts/Layout.astro`
  - ✅ Includes `<head>` with title, meta, Open Graph tags
  - ✅ Added skip-link for accessibility
  - ⏳ Pending deletion: `src/components/shared/seo/`, `src/html.jsx`

### Phase 2: Core Components

- [x] **Step 5: Create Header with CSS-only mobile menu**
  - ✅ Built `src/components/Header.astro`
  - ✅ Uses `<details>`/`<summary>` for mobile menu
  - ✅ CSS transitions for burger animation
  - ✅ Burger icon with `::before`/`::after` pseudo-elements
  - ⏳ Pending deletion: `src/components/shared/header/`, `src/components/shared/mobile-menu/`, `src/components/shared/burger/`

- [x] **Step 6: Create Footer component**
  - ✅ Built `src/components/Footer.astro`
  - ✅ Navigation links and inline SVG social icons
  - ⏳ Pending deletion: `src/components/shared/footer/`

- [x] **Step 7: Build reusable UI components**
  - ✅ `Button.astro` - gradient background, hover scale
  - ✅ `Person.astro` - heptagon clip-path
  - ✅ `SponsorLogo.astro` - image optimization for sponsors
  - ⏳ Pending: Use Astro `<Image>` component (currently using `<img>`)
  - ⏳ Pending deletion: `src/components/shared/button/`, `src/components/shared/person/`, `src/components/shared/link/`

### Phase 3: Pages

- [x] **Step 8: Migrate homepage and sections**
  - ✅ Created `src/pages/index.astro`
  - ✅ Created sections: `Hero.astro`, `Sponsors.astro`, `SponsorsList.astro`, `PreviousEvents.astro`, `Venue.astro`
  - ✅ CSS `@keyframes` for hero slideshow
  - ✅ Skipped fork leftovers: Info, Schedule, Tickets
  - ⏳ Pending deletion: `src/components/pages/home/`

- [x] **Step 9: Create Sessionize data utilities**
  - ✅ Built `src/lib/sessionize.ts`
  - ✅ Functions: `fetchSpeakers()`, `fetchSessions()`, `fetchKeynoteSpeakers()`, `fetchAllSessions()`
  - ✅ Hardcoded API ID: `fetamiym`
  - ⏳ Pending deletion: `src/components/shared/data/`

- [x] **Step 10: Migrate Speakers page with popover modals**
  - ✅ Created `src/pages/speakers.astro`
  - ✅ Uses `popover` attribute for CSS-only modals
  - ✅ `<button popovertarget="speaker-{id}">` pattern
  - ✅ No JavaScript required
  - ⏳ Pending deletion: `src/components/pages/speakers/`, `src/components/shared/speaker/`

- [ ] **Step 11: Migrate Team page**
  - Create `src/pages/team.astro`
  - Extract team data from old component
  - Use `Person.astro` component
  - Delete: `src/components/pages/team/`

- [ ] **Step 12: Migrate Live page as Preact island**
  - Create `src/pages/live.astro` (static content)
  - Build `src/components/CurrentSessions.tsx` (Preact)
  - Only JavaScript in project - 30-second polling
  - Delete: `src/components/pages/live/`

- [ ] **Step 13: Set up MDX content collections**
  - Configure `src/content/config.ts`
  - Migrate `content/static-pages/` to `src/content/static-pages/`
  - Create `src/pages/[...slug].astro`
  - Build `AnchorHeading.astro` for MDX
  - Delete: `src/templates/`, `gatsby/`

### Phase 4: Finalization

- [ ] **Step 14: Create 404 and finalize cleanup**
  - Build `src/pages/404.astro`
  - Add `public/manifest.webmanifest`
  - Update `package.json` with Astro scripts
  - Delete remaining: Gatsby files, `src/hooks/`, unused constants
  - Accessibility audit: focus states, alt text, semantic landmarks
  - Mark ROADMAP.md complete

- [ ] **Step 15: Clean up Impressum/Data Privacy content**
  - Remove cookie-related sections from `content/static-pages/data-privacy.md`
  - Remove data storage sections (no cookies or tracking used)
  - Consider renaming from "Data Privacy" to just "Impressum" or "Legal Notice"
  - Review and simplify legal content to match actual site functionality

### Technical Debt / Improvements

- [x] **Cache Sessionize images locally at build time**
  - ✅ Created `scripts/cache-sessionize.ts` to download speaker images
  - ✅ Images cached to `public/images/speakers/`
  - ✅ Speaker data cached to `public/cache/speakers-cache.json`
  - ✅ Added `prebuild` script to `package.json` to run before `build`
  - ✅ Updated `.gitignore` to exclude generated cache files
  - ✅ Updated `fetchSpeakers()` to use cached data
  - Benefits: Faster loading, no runtime dependency on Sessionize CDN, better control

- [ ] **Migrate from `<img>` to Astro `<Image>` component**
  - Update `SponsorLogo.astro` to use `<Image>` instead of `<img>`
  - Update any other components still using raw `<img>` tags
  - Note: Speaker images use `<img>` as they're served from `public/` (already optimized during caching)
  - Ensures automatic image optimization (WebP, lazy loading, etc.) for static images

- [ ] **Simplify breakpoints to single mobile breakpoint**
  - Reduce from 5 breakpoints to 1 (e.g., `--breakpoint-mobile: 768px`)
  - Use CSS container queries (`@container`) for component-level responsiveness
  - Update `global.css` to remove unused breakpoint variables
  - Audit existing components and convert media queries to container queries where appropriate

- [ ] **Audit and remove unnecessary CSS rules**
  - Remove superfluous font-size declarations (rely on semantic HTML defaults where possible)
  - Consolidate duplicate spacing values
  - Remove unused CSS custom properties from `global.css`
  - Check for redundant color definitions
  - Ensure only actively used design tokens remain

## Design Tokens Reference

### Colors

| Token            | Value     | Usage                   |
| ---------------- | --------- | ----------------------- |
| `--color-purple` | `#531CB3` | Primary brand, links    |
| `--color-pink`   | `#E30282` | Secondary accent, hover |
| `--color-orange` | `#FFBC42` | Tertiary accent         |
| `--color-teal`   | `#0DD8B5` | Accent                  |
| `--color-blue`   | `#0086FF` | Accent                  |
| `--color-text`   | `#262F59` | Body text               |

### Typography

| Font              | Usage     | Weights            |
| ----------------- | --------- | ------------------ |
| Plus Jakarta Sans | Body text | 400, 500, 600, 700 |
| Fira Code         | Headings  | 400, 500, 600, 700 |

### Breakpoints

**Target**: Single breakpoint + container queries

| Name   | Max Width | Usage                      |
| ------ | --------- | -------------------------- |
| mobile | 768px     | Global layout changes only |

**Note**: Prefer CSS container queries (`@container`) for component-level responsiveness instead of media queries. This keeps components self-contained and reusable.

## Files to Delete (Cumulative)

After full migration, these Gatsby-specific files/folders should be removed:

### Already Deleted ✅

- `tailwind.config.js`
- `postcss.config.js`
- `src/constants/links.js` (replaced with `links.ts`)
- `src/constants/menus.js` (replaced with `menus.ts`)
- `src/constants/sessionize-app.js` (replaced with `sessionize-app.ts`)
- `src/constants/seo-data.js`

### Pending Deletion ⏳

- `gatsby-browser.js`
- `gatsby-config.js`
- `gatsby-node.js`
- `gatsby-ssr.js`
- `gatsby/` (entire folder)
- `jsconfig.json` (replaced by tsconfig.json)
- `src/html.jsx`
- `src/hooks/`
- `src/templates/`
- `src/components/shared/` (all subfolders)
- `src/components/pages/` (all subfolders)
- `src/pages/_old_*.jsx` files (renamed from original `.jsx`)

---

## Current State Summary

**Last Updated**: Step 10 completed

### What Works ✅

- Dev server runs at `http://localhost:4321/`
- Full TypeScript setup with strict mode
- Config file converted to `astro.config.ts`
- All constants migrated to TypeScript (`.ts` files)
- Homepage renders with all sections (Hero, Sponsors, Venue, Previous Events)
- Header with CSS-only mobile menu (details/summary)
- Footer with navigation and social links
- Speakers page with CSS-only popover modals
- Global styles and design tokens applied

### What's Next

1. **Step 11**: Team page
2. **Step 12**: Live page with Preact island
3. **Step 13**: MDX content collections
4. **Step 14**: 404 page and final cleanup

### File Structure Created

```text
src/
├── components/
│   ├── Button.astro
│   ├── Footer.astro
│   ├── Header.astro
│   ├── Person.astro
│   ├── SponsorLogo.astro
│   └── sections/
│       ├── Hero.astro
│       ├── PreviousEvents.astro
│       ├── Sponsors.astro
│       ├── SponsorsList.astro
│       └── Venue.astro
├── constants/
│   ├── links.ts
│   ├── menus.ts
│   └── sessionize-app.ts
├── layouts/
│   └── Layout.astro
├── lib/
│   └── sessionize.ts
├── pages/
│   ├── index.astro
│   └── speakers.astro
└── styles/
    └── global.css

astro.config.ts
tsconfig.json
```
