import { axiosInstance } from "./axios-instance";
import { AUTH_ENDPOINTS } from "./endpoints";

export type RegisterPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type YetiTrekUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "user";
  profileImage?: string;
};

export const registerApi = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, payload);
  return response.data;
};

export const whoamiApi = async (token: string) => {
  const response = await axiosInstance.get(AUTH_ENDPOINTS.WHOAMI, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfileApi = async (payload: FormData, token: string) => {
  const response = await axiosInstance.patch(AUTH_ENDPOINTS.UPDATE, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const requestPasswordResetApi = async (email: string) => {
  const response = await axiosInstance.post(
    AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET,
    { email },
  );
  return response.data;
};

export const resetPasswordApi = async (token: string, newPassword: string) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.RESET_PASSWORD(token), {
    newPassword,
  });
  return response.data;
};
