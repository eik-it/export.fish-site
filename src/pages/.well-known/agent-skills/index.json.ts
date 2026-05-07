import type { APIRoute } from 'astro';

const agentSkills = JSON.stringify(
  {
    $schema: 'https://agentskills.io/schemas/v0.2.0/agent-skills.schema.json',
    skills: [
      {
        name: 'read-content-as-markdown',
        type: 'instruction',
        description:
          'Read any page as clean markdown by appending .md to the URL, or follow <link rel="alternate" type="text/markdown"> in the page HTML head. Preferred for AI ingestion. (Hent enhver side som markdown ved å legge til .md i URL-en.)',
        url: 'https://eksportfiske.no/index.md',
      },
    ],
  },
  null,
  2,
);

export const GET: APIRoute = () => {
  return new Response(agentSkills, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
