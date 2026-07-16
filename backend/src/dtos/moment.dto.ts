import { z } from "zod";

export const CreateMomentDTO = z.object({
  title: z.string().trim().min(3).max(120),
  caption: z.string().trim().min(3).max(1000),
  location: z.string().trim().min(2).max(120),
  trailSlug: z.string().trim().min(1).max(160).optional(),
});

export const UpdateMomentDTO = CreateMomentDTO.partial();

export const AdminUpdateMomentDTO = UpdateMomentDTO.extend({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export type CreateMomentDTO = z.infer<typeof CreateMomentDTO>;
export type UpdateMomentDTO = z.infer<typeof UpdateMomentDTO>;
export type AdminUpdateMomentDTO = z.infer<typeof AdminUpdateMomentDTO>;
