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
2. **Utility components for shared patterns**: Use utility components like `Container.astro` for common layout patterns (centering, max-width). This provides reusability without the downsides of global utility classes.
3. **Prefer simple semantic selectors**: Leverage Astro's scoped CSS by targeting elements directly (`h1`, `section`, `article`) instead of creating classes. Astro's scoping provides component isolation automatically. Only add classes when targeting multiple elements of the same type with different styles.
4. **Avoid wrapper divs**: Style semantic HTML elements directly instead of wrapping them in divs with classes. Use the `Container.astro` component when you need centering.
5. **CSS Custom Properties**: Use variables from `src/styles/global.css`
6. **Minimal global.css**: Keep `global.css` ONLY for design tokens (colors, fonts, spacing variables), CSS reset, `@font-face` declarations, and legitimate shape utilities (like `.heptagon`). Component-specific styles belong in component `<style>` blocks.
7. **Single breakpoint**: Use only one media query breakpoint (`768px`) for major layout changes
8. **Container queries**: Prefer `@container` queries for component-level responsiveness instead of media queries
9. **Data attributes over BEM classes**: For component variants, use data attributes (`data-variant="primary"`) instead of BEM class patterns (`btn btn-primary`)

#### Good CSS Patterns

```astro
---
import Container from '@components/Container.astro';
---

<!-- ✅ Use Container component for centering -->
<Container>
  <section>
    <!-- ✅ Target semantic elements directly -->
    <h1>Page Title</h1>
    <p>Simple selectors work because Astro scopes styles to this component.</p>
  </section>
</Container>

<style>
  /* ✅ Simple selectors - Astro scoping provides isolation */
  section {
    padding: var(--space-8);
  }

  h1 {
    font-family: var(--font-heading);
    color: var(--color-purple);
  }

  p {
    color: var(--color-text);
  }
</style>
```

#### Poor CSS Patterns (Avoid)

```astro
---
// ❌ Don't do this
---

<!-- ❌ Unnecessary wrapper div -->
<div class="page-wrapper">
  <!-- ❌ Unnecessary container div -->
  <div class="container">
    <section class="section">
      <!-- ❌ Unnecessary class when semantic element works -->
      <h1 class="page-title">Title</h1>
      <p class="page-description">Description</p>
    </section>
  </div>
</div>

<style>
  /* ❌ Multiple wrappers and over-specific classes */
  .page-wrapper {
    width: 100%;
  }

  .container {
    max-width: var(--container-lg);
    margin-inline: auto;
  }

  .section {
    padding: var(--space-8);
  }

  .page-title {
    font-family: var(--font-heading);
    color: var(--color-purple);
  }

  .page-description {
    color: var(--color-text);
  }
</style>
```

#### Container Component Usage

The `Container.astro` component provides unified centering at `--container-lg` width (1280px):

```astro
---
import Container from '@components/Container.astro';
---

<Container>
  <!-- Your content here -->
  <!-- Automatically centered with max-width and responsive padding -->
</Container>
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

<button data-variant={variant}>
  {title}
</button>

<style>
  button {
    /* Base button styles */
    padding: var(--space-3) var(--space-6);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  button[data-variant="primary"] {
    background: var(--gradient-brand);
    color: var(--color-white);
  }

  button[data-variant="secondary"] {
    background: var(--color-white);
    color: var(--color-purple);
    border: 2px solid var(--color-purple);
  }
</style>
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

## Content Collections

### When to Use Collections

Use Astro content collections for **static or semi-static content** that's managed as files in the repository:

✅ **Good candidates for collections:**

- Team members (rarely changes, managed by developers)
- Blog posts or articles
- Documentation pages
- Static pages (privacy policy, code of conduct) - already using collections

❌ **NOT for collections:**

- Speakers from Sessionize API (dynamic external data)
- Sponsors (frequently updated, may come from CMS)
- Live session data (real-time external API)

### Collection Types

**Type: `'content'`** - For Markdown/MDX files with rich content:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
  }),
});
```

**Type: `'data'`** - For JSON/YAML data files:

```typescript
const team = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      image: image(), // Validates image paths
      order: z.number(),
    }),
});
```

### Using the `image()` Helper

For collections with images, use Astro's `image()` schema helper:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const team = defineCollection({
  type: 'data',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(), // Validates and types image imports
    }),
});
```

```json
// src/content/team/john-doe.json
{
  "name": "John Doe",
  "image": "../../images/team/john-doe.jpg"
}
```

### File Naming Conventions

- Use kebab-case for filenames: `andreas-grabner.json`, `data-privacy.mdx`
- Filename becomes the entry ID (slug)
- For collections with `order` field, filename doesn't determine display order

### Fetching Collections

```astro
---
import { getCollection } from 'astro:content';

// Get all entries
const teamMembers = await getCollection('team');

// Sort by custom field
const sortedTeam = teamMembers.sort((a, b) => a.data.order - b.data.order);
---

{sortedTeam.map(member => (
  <div>
    <img src={member.data.image.src} alt={member.data.name} />
    <h3>{member.data.name}</h3>
  </div>
))}
```

## Data Fetching

### Build-time API Fetching (Astro)

For **dynamic external data** (not collections), fetch at build time in page frontmatter:

```astro
---
import { fetchSpeakers } from '@lib/sessionize';

// Fetched once at build time
const speakers = await fetchSpeakers();
---
```

**When to use:**

- External APIs (Sessionize, GitHub, etc.)
- Data that changes frequently and shouldn't be committed to repo
- Large datasets that would bloat the repository

**Example: Speakers**

- Fetched from Sessionize API at build time
- Data cached during prebuild step
- Images optimized via Astro's remote image handling

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
