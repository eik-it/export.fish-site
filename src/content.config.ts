import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Define the legal collection for ToS and other legal documents
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    lastUpdated: z.date().optional(),
    description: z.string().optional(),
  }),
});

// Blog collection for Soro-sourced articles
// Note: the frontmatter `slug` field is consumed by the glob loader as entry.id
// and must not be declared in the schema.
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    guid: z.string(),
    pubDate: z.coerce.date(),
    source: z.string().optional(),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  legal: legalCollection,
  blog: blogCollection,
};
