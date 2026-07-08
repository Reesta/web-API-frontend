import { IReview, ReviewModel } from "../models/review.model";

export class ReviewMongoRepository {
  async create(review: Partial<IReview>): Promise<IReview> {
    return ReviewModel.create(review);
  }

  async getByStaySlug(staySlug: string): Promise<IReview[]> {
    return ReviewModel.find({ staySlug })
      .populate("userId", "fullName")
      .sort({ createdAt: -1 });
  }

  async getByUserAndStay(userId: string, staySlug: string): Promise<IReview | null> {
    return ReviewModel.findOne({ userId, staySlug });
  }

  async getById(id: string): Promise<IReview | null> {
    return ReviewModel.findById(id).populate("userId", "fullName");
  }

  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IReview[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (search?.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { staySlug: { $regex: escapedSearch, $options: "i" } },
        { title: { $regex: escapedSearch, $options: "i" } },
        { text: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      ReviewModel.find(query)
        .populate("userId", "fullName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ReviewModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async update(id: string, review: Partial<IReview>): Promise<IReview | null> {
    return ReviewModel.findByIdAndUpdate(id, review, {
      new: true,
      runValidators: true,
    }).populate("userId", "fullName");
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await ReviewModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
