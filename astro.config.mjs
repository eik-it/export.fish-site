// @ts-check
import { defineConfig } from 'astro/config';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import markdownOutput from './src/integrations/markdown-output.ts';

const SITE_URL = 'https://eksportfiske.no';
const PAGES_DIR = './src/pages';
const BLOG_DIR = './src/content/blog';

function gitLastCommitISO(filePath) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? new Date(out).toISOString() : null;
  } catch {
    return null;
  }
}

function resolvePageSourceFile(pathname) {
  // pathname like "/", "/kontakt/", "/registrer/", "/llms.txt"
  const trimmed = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  if (trimmed === '') return join(PAGES_DIR, 'index.astro');

  const candidates = [
    join(PAGES_DIR, `${trimmed}.astro`),
    join(PAGES_DIR, trimmed, 'index.astro'),
    join(PAGES_DIR, `${trimmed}.ts`),
    join(PAGES_DIR, `${trimmed}.js`),
    join(PAGES_DIR, `${trimmed}.md`),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

function buildBlogLastmodMap() {
  const map = new Map();
  const skip = new Set(['REVIEW_GUIDELINES.md', 'HERO_IMAGE_GUIDELINES.md']);

  for (const file of readdirSync(BLOG_DIR)) {
    if (!file.endsWith('.md') || skip.has(file)) continue;
    const fm = readFileSync(join(BLOG_DIR, file), 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1];
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

function lastmodFor(url) {
  // Blog posts: prefer pubDate/updatedDate over git mtime — it's the
  // authoritative "this is when the article was published/edited" signal.
  const fromBlog = blogLastmod.get(url);
  if (fromBlog) return fromBlog;

  const pathname = new URL(url).pathname;
  const sourceFile = resolvePageSourceFile(pathname);
  if (!sourceFile) return null;
  return gitLastCommitISO(sourceFile);
}

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
      ],
      serialize(item) {
        const lastmod = lastmodFor(item.url);
        if (lastmod) {
          item.lastmod = lastmod;
        }
        return item;
      },
    }),
    markdownOutput(),
  ]
});
