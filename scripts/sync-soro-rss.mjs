/**
 * sync-soro-rss.mjs
 *
 * Fetches the Soro RSS feed and writes new articles to src/content/blog/.
 * New articles are detected by slug (filename) and guid (frontmatter field).
 * Existing articles are never overwritten.
 */

import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// The feed is read-only and served with CORS *; content becomes public on
// eksportfiske.no anyway. Change here if you rotate providers.
const FEED_URL = 'https://app.trysoro.com/api/rss/11cc0329-e7c8-46bf-aa54-faa04eddd48a';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const blogDir = join(projectRoot, 'src', 'content', 'blog');

if (!existsSync(blogDir)) {
  mkdirSync(blogDir, { recursive: true });
  console.log(`Created directory: ${blogDir}`);
}

const feedUrl = FEED_URL;

// Collect guids from existing articles to detect duplicates
function loadExistingGuids() {
  const guids = new Set();
  if (!existsSync(blogDir)) return guids;
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const content = readFileSync(join(blogDir, file), 'utf-8');
    const match = content.match(/^guid:\s*["']?([a-f0-9-]+)["']?/m);
    if (match) {
      guids.add(match[1].trim());
    }
  }
  return guids;
}

// Configure Turndown for clean markdown output
function createTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });
  return td;
}

// Extract a clean slug from the item link
function extractSlug(link) {
  if (!link) return null;
  const parts = link.replace(/\/$/, '').split('/');
  const last = parts[parts.length - 1];
  return last || null;
}

// Safely extract guid string from parsed XML node
function extractGuid(guidNode) {
  if (!guidNode) return null;
  if (typeof guidNode === 'string') return guidNode.trim();
  if (typeof guidNode === 'object') {
    // fast-xml-parser may return { '#text': '...', '@_isPermaLink': 'false' }
    const text = guidNode['#text'] || guidNode['_'] || Object.values(guidNode)[0];
    if (text) return String(text).trim();
  }
  return null;
}

// Extract image URL from enclosure or media:content
function extractImageUrl(item) {
  if (item.enclosure) {
    const enc = item.enclosure;
    if (enc['@_url']) return enc['@_url'];
    if (typeof enc === 'string') return enc;
  }
  const media = item['media:content'];
  if (media) {
    if (media['@_url']) return media['@_url'];
  }
  return null;
}

// Extract tags from category field (may be string or array)
function extractTags(item) {
  const cat = item.category;
  if (!cat) return [];
  if (Array.isArray(cat)) return cat.map((c) => String(c).trim()).filter(Boolean);
  return [String(cat).trim()];
}

// Build YAML frontmatter string
function buildFrontmatter(fields) {
  const lines = ['---'];
  lines.push(`title: ${JSON.stringify(fields.title)}`);
  lines.push(`description: ${JSON.stringify(fields.description)}`);
  lines.push(`slug: ${JSON.stringify(fields.slug)}`);
  lines.push(`guid: ${JSON.stringify(fields.guid)}`);
  lines.push(`pubDate: ${fields.pubDate}`);
  if (fields.source) {
    lines.push(`source: ${JSON.stringify(fields.source)}`);
  }
  if (fields.image) {
    lines.push('image:');
    lines.push(`  src: ${JSON.stringify(fields.image.src)}`);
    lines.push(`  alt: ${JSON.stringify(fields.image.alt)}`);
  }
  if (fields.tags && fields.tags.length > 0) {
    lines.push('tags:');
    for (const tag of fields.tags) {
      lines.push(`  - ${tag}`);
    }
  } else {
    lines.push('tags: []');
  }
  lines.push('---');
  return lines.join('\n');
}

async function main() {
  console.log('Fetching Soro RSS feed...');

  let xmlText;
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      console.error(`Error: Feed responded with HTTP ${response.status}`);
      process.exit(1);
    }
    xmlText = await response.text();
  } catch (err) {
    console.error(`Error fetching feed: ${err.message}`);
    process.exit(1);
  }

  console.log(`Feed fetched (${xmlText.length} bytes)`);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
  });

  let parsed;
  try {
    parsed = parser.parse(xmlText);
  } catch (err) {
    console.error(`Error parsing XML: ${err.message}`);
    process.exit(1);
  }

  const channel = parsed?.rss?.channel;
  if (!channel) {
    console.error('Error: Could not find rss.channel in feed');
    process.exit(1);
  }

  // Normalize items to array (may be single object if only one item)
  let items = channel.item;
  if (!items) {
    console.log('No items found in feed');
    process.exit(0);
  }
  if (!Array.isArray(items)) {
    items = [items];
  }

  console.log(`Found ${items.length} item(s) in feed`);

  const existingGuids = loadExistingGuids();
  const turndown = createTurndown();

  let checkedCount = 0;
  let skippedCount = 0;
  const writtenFiles = [];

  for (const item of items) {
    checkedCount++;

    const title = item.title ? String(item.title).trim() : 'Uten tittel';
    const link = item.link ? String(item.link).trim() : '';
    const slug = extractSlug(link);
    const guid = extractGuid(item.guid);
    const description = item.description ? String(item.description).trim() : '';

    if (!slug) {
      console.log(`  Skipping item "${title}": could not extract slug from link "${link}"`);
      skippedCount++;
      continue;
    }

    if (!guid) {
      console.log(`  Skipping item "${title}": could not extract guid`);
      skippedCount++;
      continue;
    }

    const targetFile = join(blogDir, `${slug}.md`);

    // Skip if file already exists by slug
    if (existsSync(targetFile)) {
      console.log(`  Skipping "${slug}": file already exists`);
      skippedCount++;
      continue;
    }

    // Skip if guid already present in another file
    if (existingGuids.has(guid)) {
      console.log(`  Skipping "${slug}": guid ${guid} already exists in another file`);
      skippedCount++;
      continue;
    }

    const rawDate = item.pubDate ? new Date(item.pubDate) : new Date();
    const pubDateIso = rawDate.toISOString();

    const imageUrl = extractImageUrl(item);
    const tags = extractTags(item);

    const htmlBody = item['content:encoded'] || '';
    const markdownBody = htmlBody ? turndown.turndown(htmlBody) : '';

    const frontmatter = buildFrontmatter({
      title,
      description,
      slug,
      guid,
      pubDate: pubDateIso,
      source: 'Soro (trysoro.com)',
      image: imageUrl ? { src: imageUrl, alt: title } : null,
      tags,
    });

    const fileContent = `${frontmatter}\n\n${markdownBody}\n`;

    try {
      writeFileSync(targetFile, fileContent, 'utf-8');
      writtenFiles.push(targetFile);
      existingGuids.add(guid);
      console.log(`  Written: src/content/blog/${slug}.md`);
    } catch (err) {
      console.error(`  Error writing ${targetFile}: ${err.message}`);
    }
  }

  console.log('');
  console.log('--- Summary ---');
  console.log(`Checked:  ${checkedCount}`);
  console.log(`Skipped:  ${skippedCount}`);
  console.log(`Written:  ${writtenFiles.length}`);
  if (writtenFiles.length > 0) {
    for (const f of writtenFiles) {
      console.log(`  - ${f}`);
    }
  }
}

main();
