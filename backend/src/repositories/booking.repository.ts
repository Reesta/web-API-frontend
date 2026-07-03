import { BookingModel, IBooking } from "../models/booking.model";

export class BookingMongoRepository {
  async create(booking: Partial<IBooking>): Promise<IBooking> {
    return BookingModel.create(booking);
  }

  async getByUser(userId: string): Promise<IBooking[]> {
    return BookingModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: IBooking[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (search?.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { itemTitle: { $regex: escapedSearch, $options: "i" } },
        { fullName: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      BookingModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      BookingModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async getById(id: string): Promise<IBooking | null> {
    return BookingModel.findById(id);
  }

  async update(id: string, booking: Partial<IBooking>): Promise<IBooking | null> {
    return BookingModel.findByIdAndUpdate(id, booking, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await BookingModel.findByIdAndDelete(id);
    return !!deleted;
  }
}
