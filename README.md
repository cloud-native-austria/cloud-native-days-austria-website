# CNDA (Cloud Native Days Austria) Website

formerly known as KCD (Kubernetes Community Days) Austria

Website for the Cloud Native Days Austria available at [cloudnativedays.at](https://cloudnativedays.at).

> **Note**: This project is being migrated from Gatsby to Astro. See [ROADMAP.md](./ROADMAP.md) for migration progress.

> Forked from [KCDMunich/website](https://github.com/KCDMunich/website) -> Thank you! :)

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Run the website](#run-the-website)
  - [Build the website](#build-the-website)
  - [Preview the built website](#preview-the-built-website)
- [Project Structure](#project-structure)
- [Sessionize Data Caching](#sessionize-data-caching)
- [AI Agent Instructions](#ai-agent-instructions)

## Getting Started

1. Clone this repository

```bash
git clone git@github.com:cloud-native-austria/kcd-austria-website.git
```

2. Install dependencies (using Bun)

```bash
bun install
```

## Usage

### Run the website

```bash
bun run dev
```

The site will be available at `http://localhost:4321/`

### Build the website

```bash
bun run build
```

This will:

1. Run the prebuild script to cache Sessionize data and download speaker images
2. Build the Astro site to the `dist/` directory

### Preview the built website

```bash
bun run preview
```

## Project Structure

```text
├── public/              # Static assets
│   ├── fonts/          # Web fonts (Plus Jakarta Sans, Fira Code)
│   ├── images/         # Static images (sponsors, etc.)
│   └── cache/          # Generated: Cached Sessionize data (not in git)
├── scripts/            # Build scripts
│   └── cache-sessionize.ts  # Downloads speaker data and images
├── src/
│   ├── components/     # Astro components
│   │   ├── sections/   # Homepage sections
│   │   ├── Button.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Person.astro
│   │   └── SponsorLogo.astro
│   ├── constants/      # TypeScript constants
│   ├── layouts/        # Page layouts
│   ├── lib/           # Utilities (Sessionize API)
│   ├── pages/         # Astro pages (routes)
│   └── styles/        # Global CSS and design tokens
├── astro.config.ts    # Astro configuration
├── tsconfig.json      # TypeScript configuration
└── ROADMAP.md         # Migration progress tracking
```

## Sessionize Data Caching

Speaker data and images are cached locally at build time to improve performance and reduce runtime dependencies on external services.

### How it works

1. **Prebuild script** (`scripts/cache-sessionize.ts`) runs before each build
2. Fetches all speaker data from the Sessionize API
3. Downloads speaker profile pictures to `public/images/speakers/`
4. Saves the complete speaker data (with local image paths) to `public/cache/speakers-cache.json`
5. The Astro site reads from the cache instead of making API calls at runtime

### Benefits

- ⚡ **Faster page loads**: Images served from the same domain
- 🔒 **No runtime dependencies**: Site works even if Sessionize is down
- 🎨 **Better optimization**: Can apply further image optimization if needed
- 💾 **Consistent builds**: Data is frozen at build time

### Manual cache refresh

To manually refresh the cached data:

```bash
bun run scripts/cache-sessionize.ts
```

The cache is automatically regenerated on every build via the `prebuild` script in `package.json`.

## AI Agent Instructions

For AI agents contributing to this project, see [AGENTS.md](./AGENTS.md) for detailed guidelines on:

- Project conventions (TypeScript, CSS, no JavaScript policy)
- Component patterns
- Code style requirements
- Migration goals
