import type { APIRoute } from 'astro';

const agentSkills = JSON.stringify(
  {
    $schema: 'https://agentskills.io/schemas/v0.2.0/agent-skills.schema.json',
    skills: [],
  },
  null,
  2,
);

export const GET: APIRoute = () => {
  return new Response(agentSkills, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
