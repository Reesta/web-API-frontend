import { Router } from "express";
import { BlogController } from "../controllers/blog.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";
import { blogUpload } from "../middlewares/upload.middleware";

const blogRouter = Router();
const blogController = new BlogController();

blogRouter.get("/", blogController.getAllBlogs);
blogRouter.get("/:slug", blogController.getBlogBySlug);
blogRouter.post(
  "/stories",
  authorizedMiddleware,
  blogUpload.single("coverImage"),
  blogController.submitStory,
);
blogRouter.post("/:slug/comments", authorizedMiddleware, blogController.addComment);

export default blogRouter;
