import type { APIRoute } from 'astro';

const agentSkills = (site: URL) =>
  JSON.stringify(
    {
      $schema: 'https://agentskills.io/schemas/v0.2.0/agent-skills.schema.json',
      skills: [
        {
          name: 'register-turistfiskebedrift',
          type: 'form',
          description:
            'Registrer turistfiskebedriften din i export.fish-appen for å rapportere fangst',
          url: new URL('registrer', site).href,
        },
      ],
    },
    null,
    2,
  );

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Astro.site is not configured. Set `site` in astro.config.mjs.');
  }
  return new Response(agentSkills(site), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
