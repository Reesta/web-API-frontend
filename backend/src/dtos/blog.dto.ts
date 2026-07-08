import { z } from "zod";
import { BlogCommentSchema, BlogSchema } from "../types/blog.type";

export const CreateBlogDTO = BlogSchema;
export type CreateBlogDTO = z.infer<typeof CreateBlogDTO>;

export const UpdateBlogDTO = BlogSchema.partial().extend({
  relatedTrailSlugs: BlogSchema.shape.relatedTrailSlugs.optional(),
});
export type UpdateBlogDTO = z.infer<typeof UpdateBlogDTO>;

export const SubmitStoryDTO = BlogSchema.pick({
  slug: true,
  title: true,
  description: true,
  content: true,
  coverImage: true,
  readingTime: true,
  relatedTrailSlugs: true,
}).extend({
  category: z.literal("User Stories").default("User Stories"),
  status: z.literal("pending").default("pending"),
  source: z.literal("user").default("user"),
  featured: z.literal(false).default(false),
  popular: z.literal(false).default(false),
  authorName: z.string().trim().min(2),
});
export type SubmitStoryDTO = z.infer<typeof SubmitStoryDTO>;

export const CreateBlogCommentDTO = BlogCommentSchema.pick({
  text: true,
}).extend({
  authorName: z.string().trim().min(2),
});
export type CreateBlogCommentDTO = z.infer<typeof CreateBlogCommentDTO>;
