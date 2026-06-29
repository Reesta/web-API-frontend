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

export const RequestPasswordResetDTO = z.object({
  email: z.string().email("Invalid email address"),
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetDTO>;

export const ResetPasswordDTO = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordDTO>;

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

// Admins can choose a role when creating a user and can update any profile
// field without needing the user's current password.
export const CreateAdminUserDTO = UserSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  password: true,
  role: true,
});

export type CreateAdminUserDTO = z.infer<typeof CreateAdminUserDTO>;

export const UpdateAdminUserDTO = CreateAdminUserDTO.partial().extend({
  password: z
    .string()
    .min(6, "Password must be at least 6 character long")
    .optional(),
});

export type UpdateAdminUserDTO = z.infer<typeof UpdateAdminUserDTO>;
 
