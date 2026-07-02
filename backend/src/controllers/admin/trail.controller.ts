import { Request, Response } from "express";
import { z } from "zod";
import { CreateTrailDTO, UpdateTrailDTO } from "../../dtos/trail.dto";
import { TrailService } from "../../services/trail.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const trailService = new TrailService();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
});

export class AdminTrailController {
  async getAllTrails(req: Request, res: Response) {
    try {
      const query = paginationSchema.safeParse(req.query);
      if (!query.success) {
        return ApiResponseHelper.error(res, z.prettifyError(query.error), 400);
      }

      const { data, meta } = await trailService.getAdminTrails(
        query.data.page,
        query.data.limit,
        query.data.search,
      );

      return ApiResponseHelper.success(
        res,
        data,
        "Admin trails fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch trails",
        error.status || 500,
      );
    }
  }

  async getTrailById(req: Request, res: Response) {
    try {
      const trail = await trailService.getAdminTrailById(req.params.id as string);
      return ApiResponseHelper.success(res, trail, "Trail fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch trail",
        error.status || 500,
      );
    }
  }

  async createTrail(req: Request, res: Response) {
    try {
      const trailData = CreateTrailDTO.safeParse({
        ...req.body,
        image: req.file ? `/uploads/trails/${req.file.filename}` : req.body.image,
        waypoints: parseWaypoints(req.body.waypoints),
      });
      if (!trailData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(trailData.error), 400);
      }

      const trail = await trailService.createTrail(trailData.data);
      return ApiResponseHelper.success(res, trail, "Trail created successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to create trail",
        error.status || 500,
      );
    }
  }

  async updateTrail(req: Request, res: Response) {
    try {
      const trailData = UpdateTrailDTO.safeParse({
        ...req.body,
        ...(req.file ? { image: `/uploads/trails/${req.file.filename}` } : {}),
        ...(req.body.waypoints !== undefined
          ? { waypoints: parseWaypoints(req.body.waypoints) }
          : {}),
      });
      if (!trailData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(trailData.error), 400);
      }

      const trail = await trailService.updateTrail(req.params.id as string, trailData.data);
      return ApiResponseHelper.success(res, trail, "Trail updated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to update trail",
        error.status || 500,
      );
    }
  }

  async deleteTrail(req: Request, res: Response) {
    try {
      await trailService.deleteTrail(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Trail deleted successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to delete trail",
        error.status || 500,
      );
    }
  }
}

function parseWaypoints(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
