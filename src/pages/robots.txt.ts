import type { APIRoute } from 'astro';

const robotsTxt = (site: URL) => `User-agent: *
Content-Signal: search=yes, ai-train=yes, ai-input=yes
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}

# AI-agentressurser:
# - llms.txt: ${new URL('llms.txt', site).href}
# - Agent Skills: ${new URL('.well-known/agent-skills/index.json', site).href}
# - Alle sider tilgjengelig som markdown ved å legge til .md på URL-en
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Astro.site is not configured. Set `site` in astro.config.mjs.');
  }
  return new Response(robotsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
