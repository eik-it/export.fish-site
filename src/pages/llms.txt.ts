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

> Markedsside for export.fish — en rapporteringsplattform for norske turistfiskebedrifter. Hjelper dem med å oppfylle Fiskeridirektoratets krav til fangstrapportering.

## Bloggartikler
${blogLines}

## Sider
- [Om oss](${siteBase}/om-oss/): Om export.fish og teamet bak
- [Kontakt](${siteBase}/kontakt/): Kontaktinformasjon
- [Registrer](${siteBase}/registrer/): Registreringsskjema for export.fish-plattformen (krever eksisterende registrering hos Fiskeridirektoratet)

## Markdown-tilgang
Alle sider er tilgjengelige som ren markdown ved å legge til .md på URL-en (f.eks. ${siteBase}/blogg/daglig-fangstrapportering-turistfiske.md).

## Oppdagelse
- Sitemap: ${siteBase}/sitemap-index.xml
- Agent Skills (Cloudflare RFC v0.2.0): ${siteBase}/.well-known/agent-skills/index.json
- robots.txt: ${siteBase}/robots.txt
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
