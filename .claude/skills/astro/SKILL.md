---
name: astro
description: Expert guidance for building Astro sites - components, layouts, content collections, integrations, and deployment. Use when working with Astro projects or .astro files.
type: domain
enforcement: suggest
priority: high
keywords: astro, astro.build, .astro, content collections, astro components, astro layouts, astro integrations
patterns: .*\.astro$, astro.*config, content.*collection, astro.*component
---

# Astro Development

## Overview

Expert guidance for building with Astro - the web framework for content-driven websites. Covers components, layouts, routing, content collections, integrations, and deployment.

## When to Use This Skill

Activate when:
- Working with `.astro` files
- Configuring `astro.config.mjs`
- Setting up content collections
- Adding Astro integrations
- Building or deploying Astro projects
- Questions about Astro architecture or best practices

## Core Capabilities

### 1. Component Development

**Astro Components (.astro files)**
- Frontmatter (---) contains TypeScript/JavaScript
- Template uses HTML-like syntax
- Islands architecture - partial hydration for interactivity
- Props typing with TypeScript interfaces

**Example Structure:**
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div class="component">
  <h2>{title}</h2>
  {description && <p>{description}</p>}
</div>

<style>
  .component {
    /* Scoped styles by default */
  }
</style>
```

**Framework Components:**
- Use `client:*` directives for hydration
- `client:load` - hydrate immediately
- `client:idle` - hydrate when idle
- `client:visible` - hydrate when visible
- `client:only` - only runs on client

### 2. Layouts

**Layout Pattern:**
```astro
---
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 3. Routing

**File-based Routing:**
- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/blog/[slug].astro` → `/blog/*` (dynamic routes)

**Dynamic Routes:**
```astro
---
export async function getStaticPaths() {
  return [
    { params: { slug: 'post-1' } },
    { params: { slug: 'post-2' } },
  ];
}

const { slug } = Astro.params;
---
```

### 4. Content Collections

**Define Collections:**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

**Query Collections:**
```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog');
---
```

### 5. Integrations

**Adding Integrations:**
```bash
npx astro add tailwind
npx astro add react
npx astro add mdx
npx astro add sitemap
```

**Common Integrations:**
- `@astrojs/tailwind` - Tailwind CSS
- `@astrojs/react` / `@astrojs/vue` / `@astrojs/svelte` - UI frameworks
- `@astrojs/mdx` - MDX support
- `@astrojs/sitemap` - Automatic sitemap
- `@astrojs/partytown` - Web workers for scripts

### 6. Configuration

**astro.config.mjs:**
```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  base: '/repo-name', // for GitHub Pages project repos
  output: 'static', // or 'server' for SSR
  vite: {
    plugins: [tailwindcss()]
  }
});
```

### 7. SEO Best Practices

**Essential Meta Tags:**
- Title (50-60 characters)
- Meta description (150-160 characters)
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- Canonical URLs
- Structured data (JSON-LD)

**Image Optimization:**
```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.png';
---

<Image src={myImage} alt="Description" />
```

### 8. Deployment

**Static Site (GitHub Pages):**
```yaml
# .github/workflows/deploy.yml
- name: Build
  run: npm run build
- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./dist
```

**Configuration for GitHub Pages:**
- Set `site` in config
- Set `base` if using project repo (not username.github.io)
- Enable Pages in repo settings (Source: GitHub Actions)

**Other Platforms:**
- Vercel: Auto-detected, zero config
- Netlify: Auto-detected, zero config
- Cloudflare Pages: Auto-detected, zero config

## Best Practices

1. **Use Content Collections** for structured content (blogs, docs)
2. **Minimize JavaScript** - use framework components only when needed
3. **Leverage Static Generation** - pre-render whenever possible
4. **Optimize Images** - use Astro's `<Image>` component
5. **Implement SEO** - meta tags, structured data, sitemaps
6. **Type Safety** - use TypeScript interfaces for props
7. **Scoped Styles** - keep CSS component-scoped by default

## Common Patterns

### Landing Page Structure
- Hero section with CTA
- Features grid (3-4 columns)
- Social proof / testimonials
- Final CTA section
- Footer

### Blog Architecture
- Content collection for posts
- Dynamic route for individual posts
- Index page listing all posts
- Tag/category filtering

### Documentation Site
- Use Starlight theme (`npm create astro@latest -- --template starlight`)
- Sidebar navigation
- Search functionality
- Code syntax highlighting

## Troubleshooting

**Build Errors:**
- Check `astro.config.mjs` syntax
- Verify all imports resolve correctly
- Ensure content collection schemas match frontmatter

**Styling Issues:**
- Global styles: import in Layout
- Tailwind: ensure `global.css` imported in Layout
- Component styles: default scoped, use `:global()` for global

**Hydration Errors:**
- Ensure framework integration installed
- Use correct `client:*` directive
- Check for SSR compatibility issues

## Resources

Access comprehensive Astro documentation through the Astro Docs MCP server configured for this project.

**Quick Reference:**
- Components: `.astro` files with frontmatter, template, styles
- Routing: File-based in `src/pages/`
- Content: Collections in `src/content/` with schema validation
- Config: `astro.config.mjs` for site settings
- Build: `npm run build` → static output in `dist/`
