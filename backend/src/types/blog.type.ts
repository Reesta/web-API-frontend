import { z } from "zod";

export const BlogCategorySchema = z.enum([
  "Trek Guides",
  "Safety",
  "Weather",
  "Culture",
  "Gear",
  "News",
  "User Stories",
]);

export const BlogStatusSchema = z.enum(["draft", "pending", "published"]);

export const BlogSourceSchema = z.enum(["admin", "user"]);

export const BlogCommentSchema = z.object({
  authorName: z.string().trim().min(2),
  text: z.string().trim().min(2),
  createdAt: z.coerce.date().optional(),
});

export const BlogSchema = z.object({
  slug: z.string().trim().min(2),
  title: z.string().trim().min(2),
  description: z.string().trim().min(10),
  content: z.string().trim().min(20),
  coverImage: z.string().trim().min(1),
  category: BlogCategorySchema,
  authorName: z.string().trim().min(2),
  readingTime: z.string().trim().min(2),
  status: BlogStatusSchema.default("draft"),
  source: BlogSourceSchema.default("admin"),
  featured: z.coerce.boolean().default(false),
  popular: z.coerce.boolean().default(false),
  relatedTrailSlugs: z.array(z.string().trim().min(1)).default([]),
  publishDate: z.coerce.date().optional(),
});

export type BlogCategoryType = z.infer<typeof BlogCategorySchema>;
export type BlogStatusType = z.infer<typeof BlogStatusSchema>;
export type BlogSourceType = z.infer<typeof BlogSourceSchema>;
export type BlogType = z.infer<typeof BlogSchema>;
export type BlogCommentType = z.infer<typeof BlogCommentSchema>;
