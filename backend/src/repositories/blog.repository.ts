import { IBlog, BlogModel } from "../models/blog.model";
import { BlogCommentType } from "../types/blog.type";

type BlogQuery = Record<string, unknown>;

export class BlogMongoRepository {
  async create(blog: Partial<IBlog>): Promise<IBlog> {
    return BlogModel.create(blog);
  }

  async getPublished(filters?: { search?: string; category?: string }): Promise<IBlog[]> {
    const query: BlogQuery = { status: "published" };

    if (filters?.category?.trim()) {
      query.category = filters.category.trim();
    }

    if (filters?.search?.trim()) {
      const escapedSearch = filters.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
        { content: { $regex: escapedSearch, $options: "i" } },
        { authorName: { $regex: escapedSearch, $options: "i" } },
        { category: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    return BlogModel.find(query).sort({ featured: -1, publishDate: -1, createdAt: -1 });
  }

  async getBySlug(slug: string): Promise<IBlog | null> {
    return BlogModel.findOne({ slug });
  }

  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    status?: string,
  ): Promise<{ data: IBlog[]; total: number }> {
    const query: BlogQuery = {};

    if (status?.trim()) {
      query.status = status.trim();
    }

    if (search?.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { slug: { $regex: escapedSearch, $options: "i" } },
        { authorName: { $regex: escapedSearch, $options: "i" } },
        { category: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      BlogModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      BlogModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async getById(id: string): Promise<IBlog | null> {
    return BlogModel.findById(id);
  }

  async update(id: string, blog: Partial<IBlog>): Promise<IBlog | null> {
    return BlogModel.findByIdAndUpdate(id, blog, {
      new: true,
      runValidators: true,
    });
  }

  async addComment(slug: string, comment: BlogCommentType): Promise<IBlog | null> {
    return BlogModel.findOneAndUpdate(
      { slug, status: "published" },
      { $push: { comments: comment } },
      { new: true, runValidators: true },
    );
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await BlogModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
