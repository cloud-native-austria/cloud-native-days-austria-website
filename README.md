# CNDA (Cloud Native Days Austria) Website

formerly known as KCD (Kubernetes Community Days) Austria

Website for the Cloud Native Days Austria available at [cloudnativedays.at](https://cloudnativedays.at).

> Forked from [KCDMunich/website](https://github.com/KCDMunich/website) -> Thank you! :)

## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
  - [Run the website](#run-the-website)
  - [Build the website](#build-the-website)
  - [Preview the built website](#preview-the-built-website)
- [Project Structure](#project-structure)
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

This will build the Astro site to the `dist/` directory.

### Preview the built website

```bash
bun run preview
```

## Project Structure

```text
├── public/              # Static assets
│   ├── fonts/          # Web fonts (Plus Jakarta Sans, Fira Code)
│   └── images/         # Static images (sponsors, etc.)
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

## AI Agent Instructions

For AI agents contributing to this project, see [AGENTS.md](./AGENTS.md) for detailed guidelines on:

- Project conventions (TypeScript, CSS, no JavaScript policy)
- Component patterns
- Code style requirements
- Migration goals
