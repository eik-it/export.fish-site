import type { APIRoute } from 'astro';

const robotsTxt = (site: URL) => `User-agent: *
Content-Signal: search=yes, ai-train=yes, ai-input=yes
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}

# AI agent resources:
# - llms.txt: ${new URL('llms.txt', site).href}
# - Agent Skills: ${new URL('.well-known/agent-skills/index.json', site).href}
# - Every page is available as markdown by appending .md to the URL
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Astro.site is not configured. Set `site` in astro.config.mjs.');
  }
  return new Response(robotsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
