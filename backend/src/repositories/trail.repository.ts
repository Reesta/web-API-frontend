import { ITrail, TrailModel } from "../models/trail.model";

export class TrailMongoRepository {
  async create(trail: Partial<ITrail>): Promise<ITrail> {
    return TrailModel.create(trail);
  }

  async getAll(): Promise<ITrail[]> {
    return TrailModel.find().sort({ createdAt: -1 });
  }

  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: ITrail[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (search?.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { slug: { $regex: escapedSearch, $options: "i" } },
        { difficulty: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      TrailModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      TrailModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async getById(id: string): Promise<ITrail | null> {
    return TrailModel.findById(id);
  }

  async getBySlug(slug: string): Promise<ITrail | null> {
    return TrailModel.findOne({ slug });
  }

  async update(id: string, trail: Partial<ITrail>): Promise<ITrail | null> {
    return TrailModel.findByIdAndUpdate(id, trail, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await TrailModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
