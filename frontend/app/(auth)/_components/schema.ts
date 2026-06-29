export type RegisterFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export const validateRegisterForm = (values: RegisterFormValues) => {
  if (!values.fullName.trim()) {
    return "Full name is required";
  }

  if (!values.email.trim()) {
    return "Email is required";
  }

  if (!values.email.includes("@")) {
    return "Please enter a valid email address";
  }

  if (!values.phoneNumber.trim()) {
    return "Phone number is required";
  }

  if (values.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (values.password !== values.confirmPassword) {
    return "Password and confirm password do not match";
  }

  return "";
};

export const validateLoginForm = (values: LoginFormValues) => {
  if (!values.email.trim()) {
    return "Email is required";
  }

  if (!values.email.includes("@")) {
    return "Please enter a valid email address";
  }

  if (!values.password.trim()) {
    return "Password is required";
  }

  return "";
};

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type RequestPasswordResetValues = z.infer<typeof RequestPasswordResetSchema>;

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;
import { z } from "zod";
