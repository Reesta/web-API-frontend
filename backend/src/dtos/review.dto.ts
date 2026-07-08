import { z } from "zod";

export const CreateReviewDTO = z.object({
  staySlug: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  text: z.string().trim().min(10).max(1200),
});

export const UpdateReviewDTO = z.object({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  title: z.string().trim().min(3).max(120).optional(),
  text: z.string().trim().min(10).max(1200).optional(),
});

export const AdminUpdateReviewDTO = UpdateReviewDTO.extend({
  helpfulCount: z.coerce.number().int().min(0).optional(),
});

export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;
export type UpdateReviewDTO = z.infer<typeof UpdateReviewDTO>;
export type AdminUpdateReviewDTO = z.infer<typeof AdminUpdateReviewDTO>;
