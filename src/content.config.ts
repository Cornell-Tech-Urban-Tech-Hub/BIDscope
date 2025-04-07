import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string(),
      tags: z.array(z.string()),
      description: z.string(),
      pubDate: z.string().transform((str) => new Date(str)),
      imgUrl: image(),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = {
  blog: blogCollection,
  projects: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      thumbnail: z.string().optional(),
      publishDate: z.date(),
      bidName: z.string(),
      borough: z.string(),
      metrics: z.array(z.string()).optional(),
      featured: z.boolean().default(false),
      // Add more project-specific fields
    }),
  }),
};
