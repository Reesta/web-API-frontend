import { Request, Response } from "express";
import { z } from "zod";
import { CreateBlogCommentDTO, SubmitStoryDTO } from "../dtos/blog.dto";
import { BlogService } from "../services/blog.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const blogService = new BlogService();

const blogFilterSchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
});

export class BlogController {
  async getAllBlogs(req: Request, res: Response) {
    try {
      const query = blogFilterSchema.safeParse(req.query);
      if (!query.success) {
        return ApiResponseHelper.error(res, z.prettifyError(query.error), 400);
      }

      const blogs = await blogService.getPublishedBlogs(query.data);
      return ApiResponseHelper.success(res, blogs, "Blogs fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch blogs",
        error.status || 500,
      );
    }
  }

  async getBlogBySlug(req: Request, res: Response) {
    try {
      const blog = await blogService.getPublishedBlogBySlug(req.params.slug as string);
      return ApiResponseHelper.success(res, blog, "Blog fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch blog",
        error.status || 500,
      );
    }
  }

  async submitStory(req: Request, res: Response) {
    try {
      const user = req.user;
      const storyData = SubmitStoryDTO.safeParse({
        ...req.body,
        coverImage: req.file ? `/uploads/blogs/${req.file.filename}` : req.body.coverImage,
        authorName: user?.fullName || req.body.authorName,
        relatedTrailSlugs: parseRelatedTrails(req.body.relatedTrailSlugs),
      });
      if (!storyData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(storyData.error), 400);
      }

      const story = await blogService.submitStory(storyData.data);
      return ApiResponseHelper.success(
        res,
        story,
        "Story submitted for admin approval",
        201,
      );
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to submit story",
        error.status || 500,
      );
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const user = req.user;
      const commentData = CreateBlogCommentDTO.safeParse({
        ...req.body,
        authorName: user?.fullName || req.body.authorName,
      });
      if (!commentData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(commentData.error), 400);
      }

      const blog = await blogService.addComment(req.params.slug as string, commentData.data);
      return ApiResponseHelper.success(res, blog, "Comment added successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to add comment",
        error.status || 500,
      );
    }
  }
}

function parseRelatedTrails(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    return JSON.parse(value);
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}
