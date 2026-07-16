import { Request, Response } from "express";
import { z } from "zod";
import { AdminUpdateMomentDTO } from "../../dtos/moment.dto";
import { MomentService } from "../../services/moment.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const service = new MomentService();
const querySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(10), search: z.string().trim().optional() });

export class AdminMomentController {
  async getAll(req: Request, res: Response) {
    try {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const { data, meta } = await service.getAdminMoments(parsed.data.page, parsed.data.limit, parsed.data.search);
      return ApiResponseHelper.success(res, data, "Admin moments fetched successfully", 200, meta);
    } catch (error: Error | any) { return ApiResponseHelper.error(res, error.message, error.status || 500); }
  }

  async update(req: Request, res: Response) {
    try {
      const parsed = AdminUpdateMomentDTO.safeParse(req.body);
      if (!parsed.success) return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      const data = await service.updateAdminMoment(req.params.id as string, parsed.data);
      return ApiResponseHelper.success(res, data, "Moment updated successfully");
    } catch (error: Error | any) { return ApiResponseHelper.error(res, error.message, error.status || 500); }
  }

  async delete(req: Request, res: Response) {
    try {
      await service.deleteAdminMoment(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Moment deleted successfully");
    } catch (error: Error | any) { return ApiResponseHelper.error(res, error.message, error.status || 500); }
  }
}
