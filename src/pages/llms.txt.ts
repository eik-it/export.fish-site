import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Astro.site is not configured. Set `site` in astro.config.mjs.');
  }

  const allPosts = await getCollection('blog');
  const posts = allPosts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const blogLines = posts
    .map((post) => {
      const url = new URL(`/blogg/${post.id}/`, site).href;
      return `- [${post.data.title}](${url}): ${post.data.description}`;
    })
    .join('\n');

  const siteBase = site.href.replace(/\/$/, '');

  const content = `# Eksportfiske.no

> Marketing site for export.fish — a reporting platform for Norwegian turistfiskebedrifter (fishing tourism businesses). Helps them comply with the Norwegian Directorate of Fisheries' (Fiskeridirektoratet) catch-reporting requirements. Site content is in Norwegian.

## Articles
${blogLines}

## Pages
- [Om oss](${siteBase}/om-oss/): About the export.fish team and platform
- [Kontakt](${siteBase}/kontakt/): Contact information
- [Registrer](${siteBase}/registrer/): Registration form for the export.fish platform (requires the business to already be registered with Fiskeridirektoratet)

## Markdown access
Every page is available as clean markdown. The URL is constructed as follows:
- Homepage: ${siteBase}/index.md
- Any other page: drop any trailing slash from the path and append .md
  - ${siteBase}/blogg/daglig-fangstrapportering-turistfiske/ → ${siteBase}/blogg/daglig-fangstrapportering-turistfiske.md
  - ${siteBase}/kontakt/ → ${siteBase}/kontakt.md

Each HTML page also exposes its markdown URL via <link rel="alternate" type="text/markdown" href="..."> in the document head — this is the most reliable discovery method.

## Discovery
- Sitemap: ${siteBase}/sitemap-index.xml
- Agent Skills (Cloudflare RFC v0.2.0): ${siteBase}/.well-known/agent-skills/index.json
- robots.txt: ${siteBase}/robots.txt
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
