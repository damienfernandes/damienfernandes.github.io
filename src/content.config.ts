import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: z.object({
    title: z.string(),
    section: z.enum([
      'blog',
      'news',
      'teaching',
      'people',
      'books',
      'repositories',
      'cv',
    ]),
    description: z.string(),
    date: z.coerce.date().optional(),
    url: z.string().url().optional(),
    repoVisibility: z
      .enum(['public', 'upon-publication', 'internal', 'private'])
      .optional(),
    platform: z.string().optional(),
    license: z.string().optional(),
    order: z.number().optional(),
    public: z.boolean().default(false),
  }),
});

export const collections = { entries };