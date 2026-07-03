import { z } from "zod";
import { TrailSchema } from "../types/trail.type";

export const CreateTrailDTO = TrailSchema;
export type CreateTrailDTO = z.infer<typeof CreateTrailDTO>;

export const UpdateTrailDTO = TrailSchema.partial().extend({
  waypoints: TrailSchema.shape.waypoints.optional(),
});
export type UpdateTrailDTO = z.infer<typeof UpdateTrailDTO>;
