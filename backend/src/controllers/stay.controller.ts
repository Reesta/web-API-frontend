import { Request, Response } from "express";
import { StayService } from "../services/stay.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const stayService = new StayService();

export class StayController {
  async getAllStays(req: Request, res: Response) {
    try {
      const stays = await stayService.getAllStays();
      return ApiResponseHelper.success(res, stays, "Stays fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to fetch stays", error.status || 500);
    }
  }

  async getStayBySlug(req: Request, res: Response) {
    try {
      const stay = await stayService.getStayBySlug(req.params.slug as string);
      return ApiResponseHelper.success(res, stay, "Stay fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to fetch stay", error.status || 500);
    }
  }
}
