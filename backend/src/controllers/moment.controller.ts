import { Request, Response } from "express";
import { z } from "zod";
import { CreateMomentDTO, UpdateMomentDTO } from "../dtos/moment.dto";
import { MomentService } from "../services/moment.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const momentService = new MomentService();

const imagePath = (req: Request) =>
  req.file ? `/uploads/moments/${req.file.filename}` : undefined;

export class MomentController {
  async getAllMoments(_req: Request, res: Response) {
    try {
      return ApiResponseHelper.success(
        res,
        await momentService.getAllMoments(),
        "Moments fetched successfully",
      );
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }

  async getMomentById(req: Request, res: Response) {
    try {
      return ApiResponseHelper.success(
        res,
        await momentService.getMomentById(req.params.id as string),
        "Moment fetched successfully",
      );
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }

  async getMyMoments(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      return ApiResponseHelper.success(res, await momentService.getMyMoments(userId), "Your moments fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }

  async createMoment(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = CreateMomentDTO.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      }
      const moment = await momentService.createMoment(
        userId,
        parsed.data,
        imagePath(req) || "",
      );
      return ApiResponseHelper.success(res, moment, "Moment uploaded successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }

  async updateMoment(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      const parsed = UpdateMomentDTO.safeParse(req.body);
      if (!parsed.success) {
        return ApiResponseHelper.error(res, z.prettifyError(parsed.error), 400);
      }
      if (Object.keys(parsed.data).length === 0 && !req.file) {
        return ApiResponseHelper.error(res, "Provide at least one field to update", 400);
      }
      const moment = await momentService.updateMoment(
        userId,
        req.user?.role,
        req.params.id as string,
        parsed.data,
        imagePath(req),
      );
      return ApiResponseHelper.success(res, moment, "Moment updated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }

  async deleteMoment(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);
      await momentService.deleteMoment(
        userId,
        req.user?.role,
        req.params.id as string,
      );
      return ApiResponseHelper.success(res, null, "Moment deleted successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message, error.status || 500);
    }
  }
}
