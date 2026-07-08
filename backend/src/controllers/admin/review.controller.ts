import { Request, Response } from "express";
import { z } from "zod";
import { AdminUpdateReviewDTO } from "../../dtos/review.dto";
import { ReviewService } from "../../services/review.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const reviewService = new ReviewService();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
});

export class AdminReviewController {
  async getAllReviews(req: Request, res: Response) {
    try {
      const query = paginationSchema.safeParse(req.query);
      if (!query.success) {
        return ApiResponseHelper.error(res, z.prettifyError(query.error), 400);
      }

      const { data, meta } = await reviewService.getAdminReviews(
        query.data.page,
        query.data.limit,
        query.data.search,
      );

      return ApiResponseHelper.success(
        res,
        data,
        "Admin reviews fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch reviews",
        error.status || 500,
      );
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const reviewData = AdminUpdateReviewDTO.safeParse(req.body);
      if (!reviewData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(reviewData.error), 400);
      }

      const review = await reviewService.updateAdminReview(
        req.params.id as string,
        reviewData.data,
      );
      return ApiResponseHelper.success(res, review, "Review updated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to update review",
        error.status || 500,
      );
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      await reviewService.deleteAdminReview(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Review deleted successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to delete review",
        error.status || 500,
      );
    }
  }
}
