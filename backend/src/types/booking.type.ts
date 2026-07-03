import { z } from "zod";

export const BookingSchema = z.object({
  itemType: z.enum(["trail", "stay"]),
  itemId: z.string().trim().optional(),
  itemSlug: z.string().trim().min(1, "Item slug is required"),
  itemTitle: z.string().trim().min(1, "Item title is required"),
  amount: z.string().trim().min(1, "Amount is required"),
  location: z.string().trim().optional().default(""),
  startDate: z.string().trim().min(1, "Start date is required"),
  endDate: z.string().trim().optional().default(""),
  travelers: z.coerce.number().int().min(1).default(1),
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().min(1, "Phone is required"),
  pickupCity: z.string().trim().optional().default(""),
  specialRequest: z.string().trim().optional().default(""),
});

export type BookingType = z.infer<typeof BookingSchema>;
