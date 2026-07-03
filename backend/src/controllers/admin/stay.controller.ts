import { Request, Response } from "express";
import { z } from "zod";
import { CreateStayDTO, UpdateStayDTO } from "../../dtos/stay.dto";
import { StayService } from "../../services/stay.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const stayService = new StayService();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
});

export class AdminStayController {
  async getAllStays(req: Request, res: Response) {
    try {
      const query = paginationSchema.safeParse(req.query);
      if (!query.success) return ApiResponseHelper.error(res, z.prettifyError(query.error), 400);
      const { data, meta } = await stayService.getAdminStays(query.data.page, query.data.limit, query.data.search);
      return ApiResponseHelper.success(res, data, "Admin stays fetched successfully", 200, meta);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to fetch stays", error.status || 500);
    }
  }

  async getStayById(req: Request, res: Response) {
    try {
      const stay = await stayService.getAdminStayById(req.params.id as string);
      return ApiResponseHelper.success(res, stay, "Stay fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to fetch stay", error.status || 500);
    }
  }

  async createStay(req: Request, res: Response) {
    try {
      const files = req.files as
        | { image?: Express.Multer.File[]; galleryImages?: Express.Multer.File[] }
        | undefined;
      const stayData = CreateStayDTO.safeParse({
        ...req.body,
        image: files?.image?.[0]
          ? `/uploads/stays/${files.image[0].filename}`
          : req.body.image,
        galleryImages: files?.galleryImages?.length
          ? files.galleryImages.map((file) => `/uploads/stays/${file.filename}`)
          : parseGalleryImages(req.body.galleryImages),
        amenities: parseAmenities(req.body.amenities),
      });
      if (!stayData.success) return ApiResponseHelper.error(res, z.prettifyError(stayData.error), 400);
      const stay = await stayService.createStay(stayData.data);
      return ApiResponseHelper.success(res, stay, "Stay created successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to create stay", error.status || 500);
    }
  }

  async updateStay(req: Request, res: Response) {
    try {
      const files = req.files as
        | { image?: Express.Multer.File[]; galleryImages?: Express.Multer.File[] }
        | undefined;
      const stayData = UpdateStayDTO.safeParse({
        ...req.body,
        ...(files?.image?.[0] ? { image: `/uploads/stays/${files.image[0].filename}` } : {}),
        ...(files?.galleryImages?.length
          ? {
              galleryImages: files.galleryImages.map(
                (file) => `/uploads/stays/${file.filename}`,
              ),
            }
          : req.body.galleryImages !== undefined
            ? { galleryImages: parseGalleryImages(req.body.galleryImages) }
            : {}),
        ...(req.body.amenities !== undefined ? { amenities: parseAmenities(req.body.amenities) } : {}),
      });
      if (!stayData.success) return ApiResponseHelper.error(res, z.prettifyError(stayData.error), 400);
      const stay = await stayService.updateStay(req.params.id as string, stayData.data);
      return ApiResponseHelper.success(res, stay, "Stay updated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to update stay", error.status || 500);
    }
  }

  async deleteStay(req: Request, res: Response) {
    try {
      await stayService.deleteStay(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Stay deleted successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to delete stay", error.status || 500);
    }
  }
}

function parseAmenities(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    return JSON.parse(value);
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

function parseGalleryImages(value: unknown) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}
