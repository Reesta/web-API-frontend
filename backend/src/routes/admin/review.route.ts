import { Router } from "express";
import { AdminReviewController } from "../../controllers/admin/review.controller";
import { adminMiddleware, authMiddleware } from "../../middlewares/auth.middleware";

const adminReviewRouter = Router();
const adminReviewController = new AdminReviewController();

adminReviewRouter.use(authMiddleware, adminMiddleware);
adminReviewRouter.get("/", adminReviewController.getAllReviews);
adminReviewRouter.patch("/:id", adminReviewController.updateReview);
adminReviewRouter.delete("/:id", adminReviewController.deleteReview);

export default adminReviewRouter;
