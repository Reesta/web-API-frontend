import { z } from "zod";
import { StaySchema } from "../types/stay.type";

export const CreateStayDTO = StaySchema;
export type CreateStayDTO = z.infer<typeof CreateStayDTO>;

export const UpdateStayDTO = StaySchema.partial().extend({
  amenities: StaySchema.shape.amenities.optional(),
});
export type UpdateStayDTO = z.infer<typeof UpdateStayDTO>;
