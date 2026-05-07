/**
 * Astro integration: markdown-output
 *
 * After the build completes, walks dist/ and converts every HTML page to a
 * clean Markdown file at <path>.md so AI agents can fetch readable content
 * without parsing the full HTML.
 *
 * For dist/blog/sjekkliste/index.html  →  dist/blog/sjekkliste.md
 * For dist/index.html                  →  dist/index.md
 */

import type { AstroIntegration } from 'astro';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { load } from 'cheerio';
import TurndownService from 'turndown';

// Pages we deliberately skip — they are not prose pages.
const SKIP_PATTERNS = [
  /\b404\b/,
  /sitemap/,
  /robots/,
  /agent-skills/,
  /qr\//,
  /registrer\/takk/,
];

function shouldSkip(relPath: string): boolean {
  return SKIP_PATTERNS.some((p) => p.test(relPath));
}

/**
 * Walk a directory recursively, yielding absolute paths to all .html files.
 */
function* walkHtml(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walkHtml(full);
    } else if (entry.endsWith('.html')) {
      yield full;
    }
  }
}

/**
 * Derive the canonical URL path from the HTML file's location in dist/.
 *
 * dist/index.html              → /
 * dist/blog/sjekkliste/index.html → /blog/sjekkliste/
 * dist/kontakt/index.html      → /kontakt/
 */
function htmlToUrlPath(distDir: string, htmlFile: string): string {
  const rel = relative(distDir, htmlFile); // e.g. "blog/sjekkliste/index.html"
  const parts = rel.replace(/\\/g, '/').split('/');
  if (parts[parts.length - 1] === 'index.html') {
    parts.pop();
  } else {
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, '');
  }
  return '/' + parts.join('/') + (parts.length > 0 ? '/' : '');
}

/**
 * Where to write the .md file, given the HTML file path.
 *
 * Convention:  dist/foo/index.html  →  dist/foo.md
 *              dist/index.html      →  dist/index.md
 *
 * This means the URL /foo.md (or /foo/index.md) will serve the file.
 * GitHub Pages resolves /foo.md directly; both conventions work.
 */
function mdOutputPath(distDir: string, htmlFile: string): string {
  const rel = relative(distDir, htmlFile); // "blog/sjekkliste/index.html"
  const normalized = rel.replace(/\\/g, '/');

  if (normalized === 'index.html') {
    // dist/index.html → dist/index.md
    return join(distDir, 'index.md');
  }

  if (normalized.endsWith('/index.html')) {
    // dist/blog/sjekkliste/index.html → dist/blog/sjekkliste.md
    const withoutIndex = normalized.slice(0, -'/index.html'.length); // "blog/sjekkliste"
    return join(distDir, withoutIndex + '.md');
  }

  // dist/kontakt.html → dist/kontakt.md (non-pretty-URL page, rare in Astro)
  return htmlFile.replace(/\.html$/, '.md');
}

/**
 * Configure Turndown for clean Markdown output.
 */
function buildTurndown(): TurndownService {
  const td = new TurndownService({
    headingStyle: 'atx',       // # ## ###
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
  });

  // Handle <picture> elements: extract the inner <img> src/alt instead of
  // trying to markdown the source/srcset children.
  td.addRule('picture', {
    filter: 'picture',
    replacement(_content: string, node: TurndownService.Node) {
      const el = node as unknown as Element;
      const img = el.querySelector?.('img');
      if (!img) return '';
      const src = img.getAttribute('src') ?? '';
      const alt = img.getAttribute('alt') ?? '';
      return src ? `![${alt}](${src})` : '';
    },
  });

  // Drop <source> elements (they're inside <picture> and handled above).
  td.addRule('source', {
    filter: 'source',
    replacement: () => '',
  });

  return td;
}

/**
 * Extract meaningful content from the HTML, stripping chrome.
 */
function extractContent(html: string): {
  title: string;
  description: string;
  bodyHtml: string;
} {
  const $ = load(html);

  const title = $('title').first().text().trim();
  const description = $('meta[name="description"]').attr('content')?.trim() ?? '';

  // Remove boilerplate elements before selecting content.
  $('nav, header, footer, script, style, noscript, [aria-hidden="true"]').remove();
  // Also remove the cookie consent banner and any fixed overlays.
  $('[class*="cookie"], [id*="cookie"], [class*="consent"], [id*="consent"]').remove();

  // Prefer <main>. Use <article> only when there's exactly one — multiple
  // articles indicate cards/lists, not the page's primary content.
  let content = $('main').first();
  if (!content.length) {
    const articles = $('article');
    content = articles.length === 1 ? articles.first() : $('body');
  }

  const bodyHtml = content.html() ?? '';
  return { title, description, bodyHtml };
}

/**
 * Build YAML frontmatter block.
 */
function frontmatter(title: string, description: string, pageUrl: string): string {
  // Escape double quotes inside values.
  const esc = (s: string) => s.replace(/"/g, '\\"');
  return [
    '---',
    `title: "${esc(title)}"`,
    `description: "${esc(description)}"`,
    `url: "${esc(pageUrl)}"`,
    '---',
    '',
  ].join('\n');
}

export default function markdownOutput(): AstroIntegration {
  return {
    name: 'markdown-output',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const td = buildTurndown();
        // dir is a URL object, convert to path string
        const distDir = dir instanceof URL ? dir.pathname : String(dir);
        const siteBase = 'https://eksportfiske.no';

        let generated = 0;
        let skipped = 0;

        for (const htmlFile of walkHtml(distDir)) {
          const relPath = relative(distDir, htmlFile).replace(/\\/g, '/');

          if (shouldSkip(relPath)) {
            skipped++;
            continue;
          }

          try {
            const html = readFileSync(htmlFile, 'utf-8');
            const { title, description, bodyHtml } = extractContent(html);

            if (!bodyHtml.trim()) {
              skipped++;
              continue;
            }

            const urlPath = htmlToUrlPath(distDir, htmlFile);
            const pageUrl = siteBase + urlPath;
            const markdown = td.turndown(bodyHtml);

            const fm = frontmatter(title, description, pageUrl);
            const output = fm + markdown + '\n';

            const outPath = mdOutputPath(distDir, htmlFile);
            writeFileSync(outPath, output, 'utf-8');
            generated++;
          } catch (err) {
            logger.warn(`markdown-output: failed to process ${relPath}: ${err}`);
          }
        }

        logger.info(`markdown-output: generated ${generated} .md files (${skipped} skipped)`);
      },
    },
  };
}
