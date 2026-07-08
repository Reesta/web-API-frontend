import { Router } from "express";
import { AdminBlogController } from "../../controllers/admin/blog.controller";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/auth.middleware";
import { blogUpload } from "../../middlewares/upload.middleware";

const adminBlogRouter = Router();
const adminBlogController = new AdminBlogController();

adminBlogRouter.use(authorizedMiddleware, adminMiddleware);

adminBlogRouter.get("/", adminBlogController.getAllBlogs);
adminBlogRouter.get("/:id", adminBlogController.getBlogById);
adminBlogRouter.post("/", blogUpload.single("coverImage"), adminBlogController.createBlog);
adminBlogRouter.put("/:id", blogUpload.single("coverImage"), adminBlogController.updateBlog);
adminBlogRouter.patch("/:id", blogUpload.single("coverImage"), adminBlogController.updateBlog);
adminBlogRouter.delete("/:id", adminBlogController.deleteBlog);

export default adminBlogRouter;
