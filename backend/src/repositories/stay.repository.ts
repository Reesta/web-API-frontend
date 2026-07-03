import { IStay, StayModel } from "../models/stay.model";

export class StayMongoRepository {
  async create(stay: Partial<IStay>): Promise<IStay> {
    return StayModel.create(stay);
  }

  async getAll(): Promise<IStay[]> {
    return StayModel.find().sort({ createdAt: -1 });
  }

  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IStay[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (search?.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { slug: { $regex: escapedSearch, $options: "i" } },
        { distance: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      StayModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      StayModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async getById(id: string): Promise<IStay | null> {
    return StayModel.findById(id);
  }

  async getBySlug(slug: string): Promise<IStay | null> {
    return StayModel.findOne({ slug });
  }

  async update(id: string, stay: Partial<IStay>): Promise<IStay | null> {
    return StayModel.findByIdAndUpdate(id, stay, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await StayModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
