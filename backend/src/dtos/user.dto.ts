import { z } from "zod";
import { UserSchema } from "../types/user.type";
 
// DTO for user registration
export const CreateUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  password: true,
});
 
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;
 
// DTO for user login
export const LoginUserDTO = UserSchema.pick({
  email: true,
  password: true,
});
 
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
})
  .partial()
  .extend({
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 character long")
      .optional(),
    confirmPassword: z.string().optional(),
  });

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;
 
