import { z } from "zod";

export const StaySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens"),
  name: z.string().trim().min(1, "Name is required"),
  price: z.string().trim().min(1, "Price is required"),
  image: z.string().trim().min(1, "Image is required"),
  galleryImages: z.array(z.string().trim().min(1)).default([]),
  distance: z.string().trim().min(1, "Distance is required"),
  description: z.string().trim().min(1, "Description is required"),
  experience: z.string().trim().min(1, "Experience is required"),
  amenities: z.array(z.string().trim().min(1)).default([]),
});

export type StayType = z.infer<typeof StaySchema>;
