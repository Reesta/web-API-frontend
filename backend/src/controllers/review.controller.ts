import { Request, Response } from "express";
import { z } from "zod";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { ReviewService } from "../services/review.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const reviewService = new ReviewService();

const photoPaths = (req: Request) => {
  const files = (req.files || []) as Express.Multer.File[];
  return files.map((file) => `/uploads/reviews/${file.filename}`);
};

export class ReviewController {
  async getStayReviews(req: Request, res: Response) {
    try {
      const data = await reviewService.getStayReviews(req.params.staySlug as string);
      return ApiResponseHelper.success(res, data, "Reviews fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch reviews",
        error.status || 500,
      );
    }
  }

  async createReview(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const reviewData = CreateReviewDTO.safeParse(req.body);
      if (!reviewData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(reviewData.error), 400);
      }

      const review = await reviewService.createReview(
        userId,
        reviewData.data,
        photoPaths(req),
      );
      return ApiResponseHelper.success(res, review, "Review submitted successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to submit review",
        error.status || 500,
      );
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      const reviewData = UpdateReviewDTO.safeParse(req.body);
      if (!reviewData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(reviewData.error), 400);
      }

      const review = await reviewService.updateReview(
        userId,
        req.params.id as string,
        reviewData.data,
        photoPaths(req),
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
      const userId = req.user?._id?.toString();
      if (!userId) return ApiResponseHelper.error(res, "Unauthorized", 401);

      await reviewService.deleteReview(userId, req.params.id as string);
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
