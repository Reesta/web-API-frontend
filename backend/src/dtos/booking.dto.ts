import { z } from "zod";
import { BookingSchema } from "../types/booking.type";

export const CreateBookingDTO = BookingSchema;
export type CreateBookingDTO = z.infer<typeof CreateBookingDTO>;

export const UpdateBookingDTO = BookingSchema.partial().extend({
  status: z
    .enum(["Confirmed", "Upcoming", "Completed", "Cancelled"])
    .optional(),
});
export type UpdateBookingDTO = z.infer<typeof UpdateBookingDTO>;
