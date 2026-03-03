# AI Agent Instructions for Cloud Native Days Austria Website

This is the website for Cloud Native Days Austria (CNDA formerly Kubernetes Community Days KCD Austria), being migrated from Gatsby to Astro.

- Framework: Astro
- Language: Typescript
- Package Manager: npm
- Styling: Vanilla CSS only

Don't start the dev server, assume it is already running on port 4321.

## No JavaScript Rule

This project aims for zero JavaScript except where absolutely necessary:

- Use `<details>`/`<summary>` for accordions/mobile menu
- Use CSS `@keyframes` for animations
- Use `:target` or `popover` for show/hide

## CSS Guidelines

1. **Scoped CSS**: Put styles in `<style>` blocks within Astro components
2. **Utility components**: Use `Container.astro` for common layout patterns (centering, max-width)
3. **Semantic selectors**: Target elements directly (`h1`, `section`, `article`) instead of creating classes
4. **CSS Custom Properties**: Use variables from `src/styles/global.css`
5. **Minimal global.css**: Only design tokens, CSS reset, `@font-face`, and shape utilities
6. **Single breakpoint**: Use only `768px` for major layout changes
7. **Container queries**: Prefer `@container` over media queries for component-level responsiveness

## Image Handling

**ALWAYS** use Astro's `<Image>` or `<Picture>` component for images. Never use raw `<img>` tags.

Use `<Picture>` when you want multiple format fallback (avif, webp).

## Content Collections

Use Astro content collections for **content that is static at build time**, regardless of its source

## Accessibility Requirements

1. **Focus visible**: All interactive elements have visible focus states
2. **Alt text**: All images have descriptive alt text
3. **Semantic HTML**: Use semantic html instead of div where possible
4. **ARIA labels**: Add labels where visual context is missing
5. **Color contrast**: Minimum 4.5:1 for text

## Brand Guidelines

- **Primary Purple**: #531CB3
- **Pink**: #E30282
- **Orange**: #FFBC42
- **Body Font**: Plus Jakarta Sans
- **Heading Font**: Fira Code (monospace)

Full brand guide: [CNDA Style Guide v1.0](https://github.com/cloud-native-austria/cloud-native-days-austria/blob/main/Brand/CNDA_StyleGuide_v1.0.pdf)
