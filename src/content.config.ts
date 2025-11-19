import { defineCollection, z } from 'astro:content';

// Define the legal collection for ToS and other legal documents
const legalCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    lastUpdated: z.date().optional(),
    description: z.string().optional(),
  }),
});

export const collections = {
  legal: legalCollection,
};
