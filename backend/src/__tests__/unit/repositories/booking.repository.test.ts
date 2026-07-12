import { BookingModel } from "../../../models/booking.model";
import { BookingMongoRepository } from "../../../repositories/booking.repository";

jest.mock("../../../models/booking.model", () => ({
  BookingModel: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const mockChain = (value: unknown) => {
  const query = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue(value),
  };
  return query;
};

describe("BookingMongoRepository", () => {
  const repository = new BookingMongoRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a booking through BookingModel.create", async () => {
    const payload = { itemTitle: "Mountain Lodge", userId: "user-1" };
    (BookingModel.create as jest.Mock).mockResolvedValue(payload);

    const booking = await repository.create(payload as never);

    expect(BookingModel.create).toHaveBeenCalledWith(payload);
    expect(booking).toEqual(payload);
  });

  it("gets bookings for a user sorted by newest first", async () => {
    const bookings = [{ itemTitle: "Langtang Stay" }];
    const query = { sort: jest.fn().mockResolvedValue(bookings) };
    (BookingModel.find as jest.Mock).mockReturnValue(query);

    const result = await repository.getByUser("user-1");

    expect(BookingModel.find).toHaveBeenCalledWith({ userId: "user-1" });
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toEqual(bookings);
  });

  it("gets paginated bookings with search query", async () => {
    const bookings = [{ itemTitle: "Everest Lodge" }];
    const query = mockChain(bookings);
    (BookingModel.find as jest.Mock).mockReturnValue(query);
    (BookingModel.countDocuments as jest.Mock).mockResolvedValue(1);

    const result = await repository.getAllPaginated(2, 5, "Everest");

    expect(BookingModel.find).toHaveBeenCalledWith({
      $or: [
        { itemTitle: { $regex: "Everest", $options: "i" } },
        { fullName: { $regex: "Everest", $options: "i" } },
        { email: { $regex: "Everest", $options: "i" } },
      ],
    });
    expect(query.sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(query.skip).toHaveBeenCalledWith(5);
    expect(query.limit).toHaveBeenCalledWith(5);
    expect(result).toEqual({ data: bookings, total: 1 });
  });
});
