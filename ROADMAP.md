# Cloud Native Days Austria Website - Gatsby to Astro Migration Roadmap

This document tracks the migration progress from Gatsby to Astro with vanilla CSS.

## Overview

- **From**: Gatsby + React + Tailwind CSS
- **To**: Astro + TypeScript + Vanilla CSS (Preact only for live page)
- **Package Manager**: Bun
- **TypeScript**: Strict mode, all code typed
- **Target**: Modern browsers only (no IE11, no legacy fallbacks)

## Migration Progress

This phase is done

### CSS Architecture Refactoring

- [x] **Create Container utility component**
  - ✅ Created `src/components/Container.astro` for unified centering pattern
  - ✅ Standardized on `--container` width (1280px) with responsive padding
  - ✅ Replaced 18+ duplicated container/centering patterns across components:
    - `Header.astro` (removed `.header-container`)
    - `Footer.astro` (removed `.footer-container`)
    - `Hero.astro` (removed `.hero-container`)
    - `Venue.astro` (removed inline centering styles)
    - `Sponsors.astro` (removed inline centering styles)
    - `SponsorsList.astro` (removed inline centering styles)
    - `PreviousEvents.astro` (removed inline centering styles)
    - `speakers.astro` (removed `.container`)
    - `team.astro` (removed `.container` and `.team-section`)
    - `live.astro` (removed inline centering styles)
  - ✅ Removed global `.container` class from `src/styles/global.css`
  - Benefits: DRY principle, consistent centering, easier maintenance, cleaner HTML

- [x] **Remove wrapper divs and prefer semantic element styling**
  - ✅ `team.astro`: Removed `.team-member` wrapper div, style `<article>` directly with images
  - ✅ `speakers.astro`: Removed `.speaker-card` article wrapper and `.image-wrapper` divs, style button and images directly
  - ✅ `speakers.astro` modals: Removed `.modal-header`, `.modal-title`, `.modal-image-wrapper` wrappers, use semantic `<header>` element
  - ✅ `Hero.astro`: Removed `.hero-content` wrapper, style direct children
  - ✅ `Venue.astro`: Removed `.venue-wrapper`, `.venue-content`, `.venue-image`, `.venue-description` wrappers
  - ✅ `Sponsors.astro`: Removed `.sponsors-wrapper` and `.buttons` wrappers
  - ✅ `PreviousEvents.astro`: Removed `.previous-events-wrapper`, `.event` and `.buttons` wrappers, use semantic `<article>` elements
  - ✅ `SponsorsList.astro`: Removed `.tier`, `.tier-logos`, `.sponsor-link` classes, use semantic `<article>` with `data-tier` attributes
  - Benefits: Cleaner HTML (removed 15+ wrapper classes), less CSS, better semantics, easier to maintain

- [x] **Prefer simple semantic selectors over classes**
  - ✅ `Header.astro`: Removed `.logo-link`, `.logo`, `.desktop-nav`, `.mobile-menu`, `.burger`, `.burger-line`, `.mobile-nav` classes
    - Desktop nav uses `nav:first-of-type` selector
    - Mobile menu uses `details`, `summary`, `summary > span` selectors
    - Burger animation now targets semantic elements with pseudo-selectors
  - ✅ `Footer.astro`: Removed `.logo`, `.footer-nav`, `.contact`, `.email`, `.social-links`, `.social-link` classes
    - Nav uses semantic `nav` selector
    - Contact section uses `footer > :global(.container) > div` selector
    - Social links use nested div selectors
  - ✅ `Hero.astro`: Removed `.hero` class, refactored highlight classes to data attributes
    - Section uses semantic `section` selector
    - Changed `.highlight-purple` and `.highlight-pink` to `strong[data-color="purple"]` and `strong[data-color="pink"]`
    - Kept slideshow classes (needed for different animations on multiple Picture elements)
  - ✅ `Venue.astro`: Removed `.venue` class, uses semantic `section` selector throughout
  - ✅ `Sponsors.astro`: Removed `.sponsors` class, uses semantic `section` selector
  - ✅ `PreviousEvents.astro`: Removed `.previous-events` class, uses semantic `section` selector
  - ✅ `SponsorsList.astro`: Removed `.sponsors-list` and `.subtitle` classes
    - Section uses semantic `section` selector
    - Subtitle uses `section > :global(.container) > p` selector
  - ✅ `SponsorLogo.astro`: Removed `.sponsor-link` and `.sponsor-logo` classes
    - Uses semantic `a`, `div`, and `img` selectors
  - ✅ `live.astro`: Cleaned up unused classes (`.current-sessions-section`, `.info-card`, `.content-grid`)
    - Uses semantic `section`, `table`, `td`, `a` selectors
    - Better structured CSS with section:first-child for current sessions
  - Benefits: Removed 20+ unnecessary classes, cleaner HTML markup, better use of Astro's scoped CSS, easier to maintain

- [x] **Refactor Button component to use data attributes**
  - ✅ Removed `.btn` class entirely from Button component
  - ✅ Removed `class` prop from Props interface (no longer needed)
  - ✅ Updated CSS selectors to use `:where(a, button)` element selectors with data attributes
  - ✅ Changed from `.btn[data-variant="primary"]` to `:where(a, button)[data-variant="primary"]`
  - ✅ Component now uses pure semantic HTML with data attributes for variants and sizes
  - Benefits: Semantic HTML, clearer intent, easier to maintain, no class naming overhead

- [x] **Delete legacy Tailwind CSS files**
  - ✅ Removed `src/styles/container.css` (used `@apply` directive)
  - ✅ Removed `src/styles/content.css` (used `@apply` directive)
  - ✅ Removed `src/styles/safe-paddings.css` (used `@apply` directive)
  - ✅ Removed `src/styles/main.css` (imported Tailwind CSS)
  - ✅ Removed `src/styles/fonts.css` (used `@layer` directive)
  - ✅ Removed `src/styles/grid-gap.css` (used `@apply` directive)
  - ✅ Removed `src/styles/remove-autocomplete-styles.css` (used `@apply` directive)
  - ✅ Removed `src/styles/scrollbar-hidden.css` (used `@apply` directive)
  - ✅ Removed `src/styles/spinner.css` (unused)
  - ✅ Removed `src/components/AnchorHeading.astro` (unused)
  - ✅ Removed `src/components/Person.astro` (imported but never used)
  - Benefits: Clean codebase, only vanilla CSS remains

- [x] **Audit and remove unused global utilities**
  - ✅ Removed `.visually-hidden` utility class (unused - found only in global.css)
  - ✅ Removed `.gradient-text` utility class (unused - found only in global.css)
  - ✅ Kept `.heptagon` shape utility (legitimately used in team.astro and speakers.astro for profile images)
  - ✅ Added documentation comment to `.heptagon` indicating usage locations
  - Benefits: Minimal global.css with only essential design tokens and legitimate utilities

### Content Collections

- [x] **Migrate team data to Astro content collection**
  - ✅ Created team collection in `src/content/config.ts`:
    - Type: `'data'` (JSON array)
    - Schema: Array of objects with `name` (string), `role` (string), `image` (via `image()` helper)
  - ✅ Created `src/content/team/members.json` with all 8 team members in alphabetical order
  - ✅ Updated `team.astro` to use `getEntry('team', 'members')`
  - ✅ Added null check to handle case where entry might be undefined
  - Benefits: Separates data from presentation, single file easier to maintain for small team, alphabetical order is intuitive, type-safe with Zod validation

- [x] **Document collection usage patterns in AGENTS.md**
  - ✅ Added comprehensive "Content Collections" section before "Data Fetching"
  - ✅ Documented when to use collections vs API fetching
  - ✅ Explained collection types: `'content'` (MDX) vs `'data'` (JSON/YAML)
  - ✅ Provided examples of using `image()` schema helper
  - ✅ Documented file naming conventions and fetching patterns
  - ✅ Included example of single-file array collection (team) vs multi-file collections
  - Benefits: Clear guidelines for AI agents and developers on proper collection usage

### Speaker Image Optimization

- [x] **Eliminate speaker image pre-downloading**
  - ✅ Removed image downloading from prebuild process
  - ✅ Deleted ~70 lines of download logic from `sessionize.ts` and `cache-sessionize.ts`
  - ✅ Build now relies on Astro's remote image optimization at build time

- [x] **Configure remote image optimization in astro.config.ts**
  - ✅ Added `image.remotePatterns` configuration to allow HTTPS images:

    ```typescript
    image: {
      remotePatterns: [{ protocol: "https" }];
    }
    ```

  - ✅ Astro now fetches and optimizes images from remote URLs at build time

- [x] **Remove image download logic from sessionize utilities**
  - ✅ Deleted `downloadImage()` function from `src/lib/sessionize.ts`
  - ✅ Removed `SPEAKERS_IMAGE_DIR` constant
  - ✅ Removed `localProfilePicture` field from `Speaker` interface
  - ✅ Simplified `cacheSpeakersData()` to only cache speaker JSON data
  - ✅ Simplified caching script - no image downloading

- [x] **Update speakers page to use Astro Image component**
  - ✅ Replaced `<img>` tags with Astro's `<Picture>` component
  - ✅ Using `speaker.profilePicture` (remote URL) directly
  - ✅ Added `formats={['avif', 'webp']}` for automatic format conversion
  - ✅ Benefits achieved:
    - Automatic WebP/AVIF conversion (251 optimized images generated)
    - Responsive srcset generation
    - Lazy loading optimization
    - Layout shift prevention with width/height
    - Simpler codebase (~70 lines removed)
    - Consistent with team page approach
    - No manual image download complexity

### Further Simplification: Remove Sessionize Caching

- [x] **Eliminate speaker data caching entirely**
  - ✅ Removed prebuild script from `package.json`
  - ✅ Deleted `scripts/cache-sessionize.ts` file
  - ✅ Deleted `public/cache/` directory
  - ✅ Simplified `fetchSpeakers()` to fetch directly from API (like sessions)
  - ✅ Removed `cacheSpeakersData()` function
  - ✅ Removed all cache-related constants (CACHE_DIR, CACHE_FILE)
  - ✅ Updated README.md to remove caching documentation
  - ✅ Benefits:
    - Simpler build process (no prebuild step)
    - Consistent approach (speakers and sessions both fetch from API)
    - Always fresh data on every build
    - Fewer lines of code to maintain
    - No cache directory to manage

## Design Tokens Reference

### Colors (Active)

| Token            | Value     | Usage                   |
| ---------------- | --------- | ----------------------- |
| `--color-purple` | `#531CB3` | Primary brand, links    |
| `--color-pink`   | `#E30282` | Secondary accent, hover |
| `--color-orange` | `#FFBC42` | Tertiary accent         |
| `--color-text`   | `#262F59` | Body text               |

_Note: Removed unused color tokens (teal, blue) during CSS audit._

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

### Pending Deletion ⏳

**None** - All Gatsby-specific files have been removed

---

## Current State Summary

**Last Updated**: Speaker Image Optimization completed

### What Works ✅

- Dev server runs at `http://localhost:4321/`
- Full TypeScript setup with strict mode
- Config file converted to `astro.config.ts`
- All constants migrated to TypeScript (`.ts` files)
- Homepage renders with all sections (Hero, Sponsors, Venue, Previous Events)
- Header with CSS-only mobile menu (details/summary)
- Footer with navigation and social links
- Speakers page with remote image optimization and CSS-only popover modals
- Team page with optimized WebP images and heptagon clip-paths
- Global styles and design tokens applied
- Remote image optimization at build time (no pre-downloading needed)

### What's Next

1. **Step 12**: Live page with Preact island
2. **Step 13**: MDX content collections
3. **Step 14**: 404 page and final cleanup

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
├── images/
│   ├── home/
│   └── team/
├── layouts/
│   └── Layout.astro
├── lib/
│   └── sessionize.ts
├── pages/
│   ├── index.astro
│   ├── speakers.astro
│   └── team.astro
└── styles/
    └── global.css

astro.config.ts
tsconfig.json
```
