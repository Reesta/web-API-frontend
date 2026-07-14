import { UserMongoRepository } from "../../../repositories/user.repository";
import { UserModel } from "../../../models/user.model";

jest.mock("../../../models/user.model", () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe("UserMongoRepository", () => {
  const repository = new UserMongoRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls UserModel.findOne when getting a user by email", async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: "test@example.com" });

    const user = await repository.getUserByEmail("test@example.com");

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(user).toEqual({ email: "test@example.com" });
  });

  it("creates a user through UserModel.create", async () => {
    const payload = {
      fullName: "Test User",
      email: "test@example.com",
      phoneNumber: "9812345678",
      password: "secret",
    };
    (UserModel.create as jest.Mock).mockResolvedValue(payload);

    const user = await repository.createUser(payload as never);

    expect(UserModel.create).toHaveBeenCalledWith(payload);
    expect(user).toEqual(payload);
  });
});
