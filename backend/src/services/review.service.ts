import {
  AdminUpdateReviewDTO,
  CreateReviewDTO,
  UpdateReviewDTO,
} from "../dtos/review.dto";
import { HttpException } from "../exceptions/http-exception";
import { IReview } from "../models/review.model";
import { ReviewMongoRepository } from "../repositories/review.repository";
import { StayMongoRepository } from "../repositories/stay.repository";

const reviewRepository = new ReviewMongoRepository();
const stayRepository = new StayMongoRepository();

type PopulatedUser = {
  _id?: unknown;
  fullName?: string;
};

export class ReviewService {
  private reviewUserId(review: IReview) {
    const user = review.userId as unknown as PopulatedUser;
    return user?._id?.toString?.() || review.userId.toString();
  }

  private toSafeReview(review: IReview) {
    const user = review.userId as unknown as PopulatedUser;

    return {
      id: review._id,
      staySlug: review.staySlug,
      userId: this.reviewUserId(review),
      userName: user?.fullName || "Yeti Trek traveler",
      rating: review.rating,
      title: review.title,
      text: review.text,
      photos: review.photos || [],
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  private summary(reviews: IReview[]) {
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce((total, review) => total + review.rating, 0) /
              totalReviews
            ).toFixed(1),
          );

    return { averageRating, totalReviews };
  }

  async getStayReviews(staySlug: string) {
    const reviews = await reviewRepository.getByStaySlug(staySlug);
    return {
      reviews: reviews.map((review) => this.toSafeReview(review)),
      summary: this.summary(reviews),
    };
  }

  async createReview(userId: string, payload: CreateReviewDTO, photos: string[]) {
    const stay = await stayRepository.getBySlug(payload.staySlug);
    if (!stay) throw new HttpException(404, "Stay not found");

    const existingReview = await reviewRepository.getByUserAndStay(
      userId,
      payload.staySlug,
    );
    if (existingReview) {
      throw new HttpException(400, "You already reviewed this stay");
    }

    try {
      const review = await reviewRepository.create({
        ...payload,
        userId: userId as unknown as IReview["userId"],
        photos,
      });
      const created = await reviewRepository.getById(review._id.toString());
      return this.toSafeReview(created || review);
    } catch (error: Error | any) {
      if (error.code === 11000) {
        throw new HttpException(400, "You already reviewed this stay");
      }
      throw error;
    }
  }

  async updateReview(userId: string, reviewId: string, payload: UpdateReviewDTO, photos?: string[]) {
    const review = await reviewRepository.getById(reviewId);
    if (!review) throw new HttpException(404, "Review not found");
    if (this.reviewUserId(review) !== userId) {
      throw new HttpException(403, "You can edit only your own review");
    }

    const updatedReview = await reviewRepository.update(reviewId, {
      ...payload,
      ...(photos && photos.length ? { photos } : {}),
    });
    if (!updatedReview) throw new HttpException(404, "Review not found");
    return this.toSafeReview(updatedReview);
  }

  async deleteReview(userId: string, reviewId: string) {
    const review = await reviewRepository.getById(reviewId);
    if (!review) throw new HttpException(404, "Review not found");
    if (this.reviewUserId(review) !== userId) {
      throw new HttpException(403, "You can delete only your own review");
    }

    const deleted = await reviewRepository.delete(reviewId);
    if (!deleted) throw new HttpException(404, "Review not found");
  }

  async getAdminReviews(page: number, limit: number, search?: string) {
    const { data, total } = await reviewRepository.getAllPaginated(
      page,
      limit,
      search,
    );

    return {
      data: data.map((review) => this.toSafeReview(review)),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async updateAdminReview(reviewId: string, payload: AdminUpdateReviewDTO) {
    const review = await reviewRepository.update(reviewId, payload);
    if (!review) throw new HttpException(404, "Review not found");
    return this.toSafeReview(review);
  }

  async deleteAdminReview(reviewId: string) {
    const deleted = await reviewRepository.delete(reviewId);
    if (!deleted) throw new HttpException(404, "Review not found");
  }
}
