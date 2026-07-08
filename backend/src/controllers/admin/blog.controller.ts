import { Request, Response } from "express";
import { z } from "zod";
import { CreateBlogDTO, UpdateBlogDTO } from "../../dtos/blog.dto";
import { BlogService } from "../../services/blog.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const blogService = new BlogService();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

export class AdminBlogController {
  async getAllBlogs(req: Request, res: Response) {
    try {
      const query = paginationSchema.safeParse(req.query);
      if (!query.success) {
        return ApiResponseHelper.error(res, z.prettifyError(query.error), 400);
      }

      const { data, meta } = await blogService.getAdminBlogs(
        query.data.page,
        query.data.limit,
        query.data.search,
        query.data.status,
      );

      return ApiResponseHelper.success(res, data, "Admin blogs fetched successfully", 200, meta);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch blogs",
        error.status || 500,
      );
    }
  }

  async getBlogById(req: Request, res: Response) {
    try {
      const blog = await blogService.getAdminBlogById(req.params.id as string);
      return ApiResponseHelper.success(res, blog, "Blog fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch blog",
        error.status || 500,
      );
    }
  }

  async createBlog(req: Request, res: Response) {
    try {
      const blogData = CreateBlogDTO.safeParse({
        ...req.body,
        coverImage: req.file ? `/uploads/blogs/${req.file.filename}` : req.body.coverImage,
        relatedTrailSlugs: parseRelatedTrails(req.body.relatedTrailSlugs),
      });
      if (!blogData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(blogData.error), 400);
      }

      const blog = await blogService.createBlog(blogData.data);
      return ApiResponseHelper.success(res, blog, "Blog created successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to create blog",
        error.status || 500,
      );
    }
  }

  async updateBlog(req: Request, res: Response) {
    try {
      const blogData = UpdateBlogDTO.safeParse({
        ...req.body,
        ...(req.file ? { coverImage: `/uploads/blogs/${req.file.filename}` } : {}),
        ...(req.body.relatedTrailSlugs !== undefined
          ? { relatedTrailSlugs: parseRelatedTrails(req.body.relatedTrailSlugs) }
          : {}),
      });
      if (!blogData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(blogData.error), 400);
      }

      const blog = await blogService.updateBlog(req.params.id as string, blogData.data);
      return ApiResponseHelper.success(res, blog, "Blog updated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to update blog",
        error.status || 500,
      );
    }
  }

  async deleteBlog(req: Request, res: Response) {
    try {
      await blogService.deleteBlog(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Blog deleted successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to delete blog",
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
