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
  - ✅ Standardized on `--container-lg` width (1280px) with responsive padding
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

- [ ] **Remove wrapper divs and prefer semantic element styling**
  - `live.astro`: Remove `.live-page` wrapper div, style `<main>` directly
  - `team.astro`: Remove unnecessary `.team-section` and `.container` nesting
  - `speakers.astro`: Simplify `.speakers-grid` to target semantic elements
  - Section components: Remove inner container divs (`.hero-container`, etc.) - apply centering to `<section>` directly using Container component
  - Benefits: Cleaner HTML, less CSS, better semantics

- [ ] **Prefer simple semantic selectors over classes**
  - Leverage Astro's scoped CSS - use `h1`, `h2`, `section`, `article` instead of creating classes
  - Example: `h1 { }` instead of `.hero-title { }` when scope is clear
  - Only add classes when targeting multiple elements of same type with different styles
  - Benefits: Less class naming overhead, cleaner markup, Astro scoping provides isolation

- [ ] **Refactor Button component to use data attributes**
  - Replace `btn`, `btn-${variant}`, `btn-${size}` class pattern
  - Use `data-variant="primary"` and `data-size="md"` attributes instead
  - Update CSS selectors: `.btn[data-variant="primary"]` instead of `.btn-primary`
  - Benefits: Semantic HTML, clearer intent, easier to maintain

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

- [ ] **Audit and remove unused global utilities**
  - Check if `.visually-hidden` is used anywhere (grep found no usage)
  - Check if `.gradient-text` is used anywhere (grep found no usage)
  - Remove if unused, or document if intentionally kept for future use
  - Keep `.heptagon` - legitimate utility used in team.astro and speakers.astro
  - Benefits: Minimal global.css, only essential design tokens and utilities

### Content Collections

- [ ] **Migrate team data to Astro content collection**
  - Create team collection in `src/content/config.ts`:
    - Type: `'data'` (JSON/YAML files, not MDX)
    - Schema: Array of objects with `name` (string), `role` (string), `image` (via `image()` helper)
    - Optional fields for future: `bio`, `social` (LinkedIn, GitHub, Twitter)
  - Convert hardcoded team array from `team.astro` to a single JSON file
  - Create `src/content/team/members.json` with all team members in alphabetical order by name:
    ```json
    [
      { "name": "Andreas Grabner", "role": "...", "image": "../../images/team/AndreasGrabner.jpeg" },
      { "name": "Andreas Taranetz", "role": "...", "image": "../../images/team/AndreasTaranetz.jpg" },
      { "name": "Daniel Drack", "role": "...", "image": "../../images/team/DanielDrack.jpeg" },
      ...
    ]
    ```
  - Update `team.astro` to use `getEntry('team', 'members')` (no sorting needed - already alphabetical)
  - Benefits: Separates data from presentation, single file easier to maintain for small team, alphabetical order is intuitive, type-safe with Zod validation

- [ ] **Document collection usage patterns in AGENTS.md**
  - When to use collections: Static/semi-static content (team, blog posts, docs)
  - When NOT to use collections: Dynamic external data (Sessionize speakers - use build-time API fetching)
  - Collection types: `'content'` (MDX) vs `'data'` (JSON/YAML)
  - Using `image()` schema helper for validated image paths
  - File naming conventions for collection entries

### Speaker Image Optimization

- [ ] **Eliminate speaker image pre-downloading**
  - Current approach downloads 100+ speaker images during prebuild
  - Adds complexity: ~70 lines of download logic in `sessionize.ts` and `cache-sessionize.ts`
  - Build already depends on Sessionize API being available
  - Astro can optimize remote images directly at build time

- [ ] **Configure remote image optimization in astro.config.ts**
  - Add `image.remotePatterns` configuration:
    ```typescript
    image: {
      remotePatterns: [{ protocol: "https" }];
    }
    ```
  - Allows Astro to fetch and optimize images from any HTTPS URL at build time
  - Consider restricting to specific domains for security if needed

- [ ] **Remove image download logic from sessionize utilities**
  - Delete `getExtensionFromMimeType()` function from `src/lib/sessionize.ts` (lines 66-77)
  - Delete `downloadAndSaveImage()` function from `src/lib/sessionize.ts` (lines 82-87)
  - Remove image download loop from `scripts/cache-sessionize.ts` (lines 108-125)
  - Remove `localProfilePicture` field from `Speaker` interface
  - Simplify caching script to only cache speaker data JSON

- [ ] **Update speakers page to use Astro Image component**
  - Replace plain `<img>` tags with Astro's `<Image>` component
  - Use `speaker.profilePicture` (remote URL) directly
  - Add `width={180}`, `height={180}`, `format="webp"` props
  - Benefits:
    - Automatic WebP/AVIF conversion
    - Responsive srcset generation
    - Lazy loading optimization
    - Layout shift prevention
    - Simpler codebase (~70 lines removed)
    - Consistent with team page approach
    - No manual image download complexity

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

**Last Updated**: Step 11 completed

### What Works ✅

- Dev server runs at `http://localhost:4321/`
- Full TypeScript setup with strict mode
- Config file converted to `astro.config.ts`
- All constants migrated to TypeScript (`.ts` files)
- Homepage renders with all sections (Hero, Sponsors, Venue, Previous Events)
- Header with CSS-only mobile menu (details/summary)
- Footer with navigation and social links
- Speakers page with CSS-only popover modals
- Team page with optimized WebP images and heptagon clip-paths
- Global styles and design tokens applied

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
