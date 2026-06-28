"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { getTokenCookie } from "@/lib/cookies";
import {
  AdminUserPayload,
  createAdminUserApi,
  deleteAdminUserApi,
  getAdminUserApi,
  getAdminUsersApi,
  updateAdminUserApi,
} from "@/lib/api/admin/admin-users";

const failure = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return {
    success: false,
    message: axiosError.response?.data?.message || fallback,
    data: null,
    meta: null,
  };
};

const getAdminToken = async () => {
  const token = await getTokenCookie();
  if (!token) throw new Error("You need to login first");
  return token;
};

export const getAdminUsersAction = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const result = await getAdminUsersApi(await getAdminToken(), {
      page: Math.max(1, page),
      limit: Math.min(50, Math.max(1, limit)),
      search,
    });
    return { success: true, data: result.data, meta: result.meta, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load users");
  }
};

export const getAdminUserAction = async (id: string) => {
  try {
    const result = await getAdminUserApi(await getAdminToken(), id);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load user");
  }
};

export const createAdminUserAction = async (payload: AdminUserPayload) => {
  try {
    const result = await createAdminUserApi(await getAdminToken(), payload);
    revalidatePath("/admin/users");
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to create user");
  }
};

export const updateAdminUserAction = async (id: string, payload: AdminUserPayload) => {
  try {
    const result = await updateAdminUserApi(await getAdminToken(), id, payload);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to update user");
  }
};

export const deleteAdminUserAction = async (id: string) => {
  try {
    const result = await deleteAdminUserApi(await getAdminToken(), id);
    revalidatePath("/admin/users");
    return { success: true, data: null, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to delete user");
  }
};
