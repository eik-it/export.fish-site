// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import markdownOutput from './src/integrations/markdown-output.ts';

const SITE_URL = 'https://eksportfiske.no';

function buildBlogLastmodMap() {
  const map = new Map();
  const blogDir = './src/content/blog';
  const skip = new Set(['REVIEW_GUIDELINES.md', 'HERO_IMAGE_GUIDELINES.md']);

  for (const file of readdirSync(blogDir)) {
    if (!file.endsWith('.md') || skip.has(file)) continue;
    const fm = readFileSync(join(blogDir, file), 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1];
    if (!fm) continue;
    const pubDate = fm.match(/^pubDate:\s*(.+)$/m)?.[1]?.trim();
    const updatedDate = fm.match(/^updatedDate:\s*(.+)$/m)?.[1]?.trim();
    const lastmod = updatedDate || pubDate;
    if (!lastmod) continue;
    const slug = file.replace(/\.md$/, '');
    map.set(`${SITE_URL}/blogg/${slug}/`, new Date(lastmod).toISOString());
  }

  return map;
}

const blogLastmod = buildBlogLastmodMap();

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: '',

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/registrer/takk') &&
        !page.includes('/registrer/ny-kunde') &&
        !page.includes('/qr'),
      customPages: [
        `${SITE_URL}/llms.txt`,
        `${SITE_URL}/.well-known/agent-skills/index.json`,
      ],
      serialize(item) {
        const lastmod = blogLastmod.get(item.url);
        if (lastmod) {
          item.lastmod = lastmod;
        }
        return item;
      },
    }),
    markdownOutput(),
  ]
});
