"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { getTokenCookie } from "@/lib/cookies";
import {
  AdminBlogPayload,
  createAdminBlogApi,
  deleteAdminBlogApi,
  getAdminBlogApi,
  getAdminBlogsApi,
  updateAdminBlogApi,
} from "@/lib/api/admin/admin-blogs";

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

export const getAdminBlogsAction = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const result = await getAdminBlogsApi(await getAdminToken(), {
      page: Math.max(1, page),
      limit: Math.min(50, Math.max(1, limit)),
      search,
      status,
    });
    return { success: true, data: result.data, meta: result.meta, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load blogs");
  }
};

export const getAdminBlogAction = async (id: string) => {
  try {
    const result = await getAdminBlogApi(await getAdminToken(), id);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load blog");
  }
};

export const createAdminBlogAction = async (payload: AdminBlogPayload) => {
  try {
    const result = await createAdminBlogApi(await getAdminToken(), payload);
    revalidateBlogPaths(result.data.slug);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to create blog");
  }
};

export const createAdminBlogFormAction = async (payload: FormData) => {
  try {
    const result = await createAdminBlogApi(await getAdminToken(), payload);
    revalidateBlogPaths(result.data.slug);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to create blog");
  }
};

export const updateAdminBlogAction = async (id: string, payload: AdminBlogPayload) => {
  try {
    const result = await updateAdminBlogApi(await getAdminToken(), id, payload);
    revalidateBlogPaths(result.data.slug, id);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to update blog");
  }
};

export const updateAdminBlogFormAction = async (id: string, payload: FormData) => {
  try {
    const result = await updateAdminBlogApi(await getAdminToken(), id, payload);
    revalidateBlogPaths(result.data.slug, id);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to update blog");
  }
};

export const deleteAdminBlogAction = async (id: string) => {
  try {
    const result = await deleteAdminBlogApi(await getAdminToken(), id);
    revalidatePath("/admin/blogs");
    revalidatePath("/dashboard/blogs");
    return { success: true, data: null, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to delete blog");
  }
};

const revalidateBlogPaths = (slug: string, id?: string) => {
  revalidatePath("/admin/blogs");
  if (id) revalidatePath(`/admin/blogs/${id}/edit`);
  revalidatePath("/dashboard/blogs");
  revalidatePath(`/dashboard/blogs/${slug}`);
};
