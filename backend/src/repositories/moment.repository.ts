import { IMoment, MomentModel } from "../models/moment.model";

export class MomentMongoRepository {
  async create(moment: Partial<IMoment>): Promise<IMoment> {
    return MomentModel.create(moment);
  }

  async getAll(): Promise<IMoment[]> {
    return MomentModel.find({ status: "approved" })
      .populate("userId", "fullName profileImage")
      .sort({ createdAt: -1 });
  }

  async getAllPaginated(page: number, limit: number, search?: string) {
    const query: Record<string, unknown> = {};
    if (search?.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { caption: { $regex: escaped, $options: "i" } },
        { location: { $regex: escaped, $options: "i" } },
      ];
    }
    const [data, total] = await Promise.all([
      MomentModel.find(query).populate("userId", "fullName profileImage").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      MomentModel.countDocuments(query),
    ]);
    return { data, total };
  }

  async getById(id: string): Promise<IMoment | null> {
    return MomentModel.findById(id).populate("userId", "fullName profileImage");
  }

  async getByUser(userId: string): Promise<IMoment[]> {
    return MomentModel.find({ userId })
      .populate("userId", "fullName profileImage")
      .sort({ createdAt: -1 });
  }

  async update(id: string, moment: Partial<IMoment>): Promise<IMoment | null> {
    return MomentModel.findByIdAndUpdate(id, moment, {
      new: true,
      runValidators: true,
    }).populate("userId", "fullName profileImage");
  }

  async delete(id: string): Promise<boolean> {
    return !!(await MomentModel.findByIdAndDelete(id));
  }
}
