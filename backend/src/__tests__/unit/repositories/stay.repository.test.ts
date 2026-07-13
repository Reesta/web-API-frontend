import { StayModel } from "../../../models/stay.model";
import { StayMongoRepository } from "../../../repositories/stay.repository";

jest.mock("../../../models/stay.model", () => ({
  StayModel: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("StayMongoRepository", () => {
  const repository = new StayMongoRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a stay through StayModel.create", async () => {
    const payload = { name: "Mountain Lodge", slug: "mountain-lodge" };
    (StayModel.create as jest.Mock).mockResolvedValue(payload);

    const stay = await repository.create(payload as never);

    expect(StayModel.create).toHaveBeenCalledWith(payload);
    expect(stay).toEqual(payload);
  });

  it("gets a stay by slug", async () => {
    const stay = { slug: "alpine-tea-house", name: "Alpine Tea House" };
    (StayModel.findOne as jest.Mock).mockResolvedValue(stay);

    const result = await repository.getBySlug("alpine-tea-house");

    expect(StayModel.findOne).toHaveBeenCalledWith({ slug: "alpine-tea-house" });
    expect(result).toEqual(stay);
  });

  it("returns true when deleting an existing stay", async () => {
    (StayModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "stay-1" });

    const result = await repository.delete("stay-1");

    expect(StayModel.findByIdAndDelete).toHaveBeenCalledWith("stay-1");
    expect(result).toBe(true);
  });
});
