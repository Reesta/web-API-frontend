import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { reviewUpload } from "../middlewares/upload.middleware";

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get("/stay/:staySlug", reviewController.getStayReviews);
reviewRouter.post(
  "/",
  authMiddleware,
  reviewUpload.array("photos", 4),
  reviewController.createReview,
);
reviewRouter.patch(
  "/:id",
  authMiddleware,
  reviewUpload.array("photos", 4),
  reviewController.updateReview,
);
reviewRouter.delete("/:id", authMiddleware, reviewController.deleteReview);

export default reviewRouter;
