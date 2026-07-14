import { TrailModel } from "../../../models/trail.model";
import { TrailMongoRepository } from "../../../repositories/trail.repository";

jest.mock("../../../models/trail.model", () => ({
  TrailModel: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("TrailMongoRepository", () => {
  const repository = new TrailMongoRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a trail through TrailModel.create", async () => {
    const payload = { title: "Everest Base Camp", slug: "everest-base-camp" };
    (TrailModel.create as jest.Mock).mockResolvedValue(payload);

    const trail = await repository.create(payload as never);

    expect(TrailModel.create).toHaveBeenCalledWith(payload);
    expect(trail).toEqual(payload);
  });

  it("gets a trail by slug", async () => {
    const trail = { slug: "annapurna-circuit", title: "Annapurna Circuit" };
    (TrailModel.findOne as jest.Mock).mockResolvedValue(trail);

    const result = await repository.getBySlug("annapurna-circuit");

    expect(TrailModel.findOne).toHaveBeenCalledWith({ slug: "annapurna-circuit" });
    expect(result).toEqual(trail);
  });

  it("updates a trail with validators enabled", async () => {
    const update = { title: "Updated Trail" };
    (TrailModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(update);

    const result = await repository.update("trail-1", update as never);

    expect(TrailModel.findByIdAndUpdate).toHaveBeenCalledWith("trail-1", update, {
      new: true,
      runValidators: true,
    });
    expect(result).toEqual(update);
  });
});
