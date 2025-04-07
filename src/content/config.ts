import { z, defineCollection } from 'astro:content';

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    thumbnail: z.string().optional(),
    bidName: z.string(),
    borough: z.enum(['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']),
    budget: z.number().optional(),
    yearEstablished: z.number().optional(),
    metrics: z.object({
      cleaningBudget: z.number().optional(),
      marketingBudget: z.number().optional(),
      publicSpaceBudget: z.number().optional(),
      securityBudget: z.number().optional(),
      totalAssessment: z.number().optional(),
    }).optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    geoJson: z.string().optional(),
    streetCoverage: z.number().optional(), // miles
    businesses: z.number().optional(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  'projects': projects,
};