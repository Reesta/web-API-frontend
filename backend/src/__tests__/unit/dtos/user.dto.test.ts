import { CreateAdminUserDTO, CreateUserDTO, LoginUserDTO, ResetPasswordDTO, UpdateUserDTO } from "../../../dtos/user.dto";

const user = { fullName: "Test User", email: "test@example.com", phoneNumber: "9812345678", password: "Password123" };

describe("user DTO validation", () => {
  it("accepts a valid registration", () => expect(CreateUserDTO.safeParse(user).success).toBe(true));
  it("rejects an invalid registration email", () => expect(CreateUserDTO.safeParse({ ...user, email: "bad" }).success).toBe(false));
  it("accepts valid login credentials", () => expect(LoginUserDTO.safeParse({ email: user.email, password: user.password }).success).toBe(true));
  it("rejects a short reset password", () => expect(ResetPasswordDTO.safeParse({ newPassword: "123" }).success).toBe(false));
  it("accepts a partial profile update", () => expect(UpdateUserDTO.safeParse({ fullName: "Updated User" }).success).toBe(true));
  it("rejects an unsupported admin role", () => expect(CreateAdminUserDTO.safeParse({ ...user, role: "manager" }).success).toBe(false));
});
