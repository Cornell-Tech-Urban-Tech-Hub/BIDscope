import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
});

const photos = defineCollection({
  schema: ({ image }) =>
    z.object({
      albumId: z.string(),
      title: z.string().optional(),
      photo: image(),
      caption: z.string().optional(),
      pubDatetime: z.string().or(z.date()).default(() => new Date().toISOString()),
      order: z.number().optional(),
      metadata: z.object({
        camera: z.string().optional(),
        lens: z.string().optional(),
        settings: z.object({
          aperture: z.string().optional(),
          shutterSpeed: z.string().optional(),
          iso: z.union([z.string(), z.number()]).optional(),
          focalLength: z.string().optional(),
        }).optional(),
      }).optional(),
    }),
});

const albums = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["untagged"]),
    borderColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Border color must be a valid hex color code",
    }).default("#ffffff"),
    location: z.string().optional(),
    coverPhotoId: z.string().optional(),
  }),
});

const snips = defineCollection({
  schema: z.object({
    albumId: z.string().optional(),
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["untagged"]),
    source: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    order: z.number().optional(),
  }),
});

const playlists = defineCollection({
  schema: z.object({
    albumId: z.string().optional(),
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    platform: z.enum(["spotify", "apple"]),
    playlistUrl: z.string().url(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["untagged"]),
    coverImage: z.string().optional(),
    mood: z.array(z.string()).optional(),
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      venue: z.string(),
      tag: z.string().optional(),
      href: z.string().url(),
      image: image().optional(),
      youtubeId: z.string().optional(),
      pubDatetime: z.date(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string().optional(),
      order: z.number().optional(),
    }),
});

export const collections = { blog, albums, photos, snips, playlists, projects };