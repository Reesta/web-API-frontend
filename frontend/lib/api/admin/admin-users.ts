import { axiosInstance } from "../axios-instance";
import { ADMIN_USER_ENDPOINTS } from "../endpoints";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "user";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminUserPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: "admin" | "user";
  password?: string;
};

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getAdminUsersApi = async (
  token: string,
  params: { page: number; limit: number; search: string },
) => {
  const response = await axiosInstance.get(ADMIN_USER_ENDPOINTS.LIST, {
    headers: authHeaders(token),
    params,
  });
  return response.data;
};

export const getAdminUserApi = async (token: string, id: string) => {
  const response = await axiosInstance.get(ADMIN_USER_ENDPOINTS.DETAIL(id), {
    headers: authHeaders(token),
  });
  return response.data;
};

export const createAdminUserApi = async (token: string, payload: AdminUserPayload) => {
  const response = await axiosInstance.post(ADMIN_USER_ENDPOINTS.LIST, payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const updateAdminUserApi = async (
  token: string,
  id: string,
  payload: AdminUserPayload,
) => {
  const response = await axiosInstance.patch(
    ADMIN_USER_ENDPOINTS.DETAIL(id),
    payload,
    { headers: authHeaders(token) },
  );
  return response.data;
};

export const deleteAdminUserApi = async (token: string, id: string) => {
  const response = await axiosInstance.delete(ADMIN_USER_ENDPOINTS.DETAIL(id), {
    headers: authHeaders(token),
  });
  return response.data;
};
