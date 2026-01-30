# AI Agent Instructions for Cloud Native Days Austria Website

This document provides guidelines for AI agents contributing to this codebase.

## Project Overview

This is the website for Cloud Native Days Austria (CNDA formerly Kubernetes Community Days KCD Austria), being migrated from Gatsby to Astro.

- **Framework**: Astro
- **Language**: TypeScript (strict mode)
- **Package Manager**: Bun (not npm/yarn)
- **Styling**: Vanilla CSS only (no Tailwind, no CSS-in-JS)
- **JavaScript Policy**: No JavaScript except for the live page Preact island
- **Target Browsers**: Modern browsers only (ES2022+, no IE11)

## Key Conventions

### TypeScript

All code uses TypeScript with strict mode:

- **Config files**: Use `.ts` extension (e.g., `astro.config.ts`)
- **Constants/utilities**: Write in TypeScript with proper types
- **Astro components**: Use TypeScript in frontmatter for Props interfaces
- **Preact components**: Full TypeScript with `.tsx` extension
- **No `any` types**: Always provide specific types

```typescript
// src/constants/links.ts
interface Link {
  to: string;
  target?: string;
}

const LINKS: Record<string, Link> = {
  home: { to: '/' },
  speakers: { to: '/speakers' },
};

export default LINKS;
```

### No JavaScript Rule

This project aims for zero JavaScript except where absolutely necessary:

- Use `popover` attribute for modals (no JS)
- Use `<details>`/`<summary>` for accordions/mobile menu (no JS)
- Use CSS `@keyframes` for animations (no JS)
- Use `:target` or `popover` for show/hide (no JS)
- Do NOT add JavaScript for interactions that CSS can handle
- Exception: `src/components/CurrentSessions.tsx` uses Preact for live polling

### CSS Guidelines

1. **Scoped CSS**: Put styles in `<style>` blocks within Astro components
2. **No utility classes**: Write semantic CSS, not Tailwind-style utilities
3. **CSS Custom Properties**: Use variables from `src/styles/global.css`
4. **Minimal rules**: Only include CSS that's actually used
5. **No unused variables**: Don't define CSS properties that aren't referenced
6. **No component styles in global.css**: The `global.css` file is ONLY for design tokens (colors, fonts, spacing variables), CSS reset, and `@font-face` declarations. Component-specific styles belong in the component's `<style>` block.
7. **Single breakpoint**: Use only one media query breakpoint (`768px`) for major layout changes
8. **Container queries**: Prefer `@container` queries for component-level responsiveness instead of media queries

```astro
---
// Component logic here
---

<div class="card">
  <h2>Title</h2>
</div>

<style>
  .card {
    padding: var(--space-4);
    background: var(--color-white);
  }

  h2 {
    font-family: var(--font-heading);
    color: var(--color-text);
  }
</style>
```

### Component Patterns

#### Astro Components

- Place in `src/components/`
- Use `.astro` extension
- **Always** define Props interface in TypeScript frontmatter
- Use proper TypeScript types for all variables

```astro
---
interface Props {
  title: string;
  variant?: 'primary' | 'secondary';
}

const { title, variant = 'primary' } = Astro.props;
---

<button class:list={['btn', variant]}>
  {title}
</button>
```

#### Preact Components (Live page only)

- Place in `src/components/`
- Use `.tsx` extension
- Only use with `client:load` directive
- Keep minimal - only for features requiring client-side JS

### Image Handling

**ALWAYS** use Astro's `<Image>` or `<Picture>` component for images. Never use raw `<img>` tags.

Use `<Picture>` when you want multiple format fallbacks (recommended for most cases):

```astro
---
import { Picture } from 'astro:assets';
import photo from '@images/speaker.jpg';
---

<!-- For people (speakers, team) - generates WebP and AVIF with fallbacks -->
<Picture src={photo} alt="Speaker name" formats={['avif', 'webp']} />

<!-- For sponsors -->
<Picture src={logo} alt="Sponsor name" formats={['avif', 'webp']} />
```

Use `<Image>` for simpler cases when you only need a single format:

```astro
---
import { Image } from 'astro:assets';
import photo from '@images/speaker.jpg';
---

<!-- Single format (WebP) -->
<Image src={photo} alt="Speaker name" format="webp" />
```

**Why?**

- Automatic WebP conversion and optimization
- Lazy loading by default
- Proper `width`/`height` attributes prevent layout shift
- Responsive `srcset` generation

❌ **Never do this:**

```html
<img src="/images/logo.png" alt="Logo" />
```

✅ **Always do this:**

```astro
<Image src={logo} alt="Logo" />
```

### Path Aliases

Configured in `tsconfig.json`:

| Alias         | Path             |
| ------------- | ---------------- |
| `@components` | `src/components` |
| `@layouts`    | `src/layouts`    |
| `@styles`     | `src/styles`     |
| `@images`     | `src/images`     |
| `@icons`      | `src/icons`      |
| `@lib`        | `src/lib`        |

### Modal/Dialog Pattern

Use the `popover` attribute for modals:

```astro
<!-- Trigger button -->
<button popovertarget="modal-id">Open Modal</button>

<!-- Modal content -->
<div id="modal-id" popover>
  <h2>Modal Title</h2>
  <p>Content here</p>
  <button popovertarget="modal-id" popovertargetaction="hide">Close</button>
</div>

<style>
  [popover] {
    /* Centered modal */
    margin: auto;
    padding: var(--space-6);
    border: none;
    border-radius: var(--radius-lg);
  }

  [popover]::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
</style>
```

### Mobile Menu Pattern

Use `<details>`/`<summary>` for the mobile menu:

```astro
<details class="mobile-menu">
  <summary class="burger" aria-label="Menu">
    <span></span>
  </summary>
  <nav>
    <a href="/">Home</a>
    <a href="/speakers">Speakers</a>
  </nav>
</details>

<style>
  .mobile-menu[open] .burger span {
    /* Animate to X */
  }
</style>
```

## Commands

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Data Fetching

### Build-time (Astro)

Sessionize data is fetched at build time in page frontmatter:

```astro
---
import { fetchSpeakers } from '@lib/sessionize';

const speakers = await fetchSpeakers();
---
```

### Client-side (Preact - Live page only)

The live page polls Sessionize every 30 seconds for current sessions:

```tsx
// src/components/CurrentSessions.tsx
import { useState, useEffect } from 'preact/hooks';

export function CurrentSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      /* ... */
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return <div>{/* render sessions */}</div>;
}
```

## Accessibility Requirements

1. **Skip link**: Layout includes skip-to-main-content link
2. **Focus visible**: All interactive elements have visible focus states
3. **Alt text**: All images have descriptive alt text
4. **Semantic HTML**: Use `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`
5. **ARIA labels**: Add labels where visual context is missing
6. **Color contrast**: Minimum 4.5:1 for text

## File Structure

```text
src/
├── components/          # Astro components (and one Preact)
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Button.astro
│   ├── Person.astro
│   ├── SponsorLogo.astro
│   ├── CurrentSessions.tsx  # Only Preact component
│   └── sections/        # Homepage sections
│       ├── Hero.astro
│       ├── Sponsors.astro
│       └── ...
├── content/
│   └── static-pages/    # MDX content
├── layouts/
│   └── Layout.astro     # Main layout
├── lib/
│   └── sessionize.ts    # Data fetching utilities
├── pages/
│   ├── index.astro
│   ├── speakers.astro
│   ├── team.astro
│   ├── live.astro
│   ├── 404.astro
│   └── [...slug].astro  # Dynamic MDX pages
├── styles/
│   └── global.css       # CSS custom properties
├── images/              # Local images
└── icons/               # SVG icons
```

## Migration Status

See [ROADMAP.md](./ROADMAP.md) for current migration progress.

## Brand Guidelines

- **Primary Purple**: #531CB3
- **Pink**: #E30282
- **Orange**: #FFBC42
- **Body Font**: Plus Jakarta Sans
- **Heading Font**: Fira Code (monospace)

Full brand guide: [CNDA Style Guide v1.0](https://github.com/cloud-native-austria/cloud-native-days-austria/blob/main/Brand/CNDA_StyleGuide_v1.0.pdf)
