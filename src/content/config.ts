import { z, defineCollection } from 'astro:content';

const projects = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    thumbnail: image().optional(),
    bidName: z.string(),
    borough: z.enum(['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']),
    yearEstablished: z.number().optional(),
    featured: z.boolean().default(false),
    revisionMode: z.boolean().default(false).describe('If true, displays visualization placeholders even if no components exist'),
    tags: z.array(z.string()).default([]),
    
    // Visualization component references - now as arrays to support multiple components per section
    insightComponents: z.array(z.string()).optional().describe('Array of relative filepaths to TSX components for Insight visualizations'),
    transformationComponents: z.array(z.string()).optional().describe('Array of relative filepaths to TSX components for Transformation visualizations'),
    predictionComponents: z.array(z.string()).optional().describe('Array of relative filepaths to TSX components for Prediction visualizations'),
    consensusComponents: z.array(z.string()).optional().describe('Array of relative filepaths to TSX components for Consensus visualizations'),
    
    // Additional optional metadata for visualizations
    dataSource: z.string().optional(),
    visualizationTechniques: z.array(z.string()).optional(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = {
  'projects': projects,
};