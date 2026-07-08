"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { getTokenCookie } from "@/lib/cookies";
import {
  addBlogCommentApi,
  getBlogBySlugApi,
  getBlogsApi,
  submitStoryApi,
} from "@/lib/api/blogs";

const failure = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return {
    success: false,
    message: axiosError.response?.data?.message || fallback,
    data: null,
    meta: null,
  };
};

const getUserToken = async () => {
  const token = await getTokenCookie();
  if (!token) throw new Error("You need to login first");
  return token;
};

export const getBlogsAction = async (params?: { search?: string; category?: string }) => {
  try {
    const result = await getBlogsApi(params);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load blogs");
  }
};

export const getBlogBySlugAction = async (slug: string) => {
  try {
    const result = await getBlogBySlugApi(slug);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load blog");
  }
};

export const submitStoryAction = async (payload: FormData) => {
  try {
    const result = await submitStoryApi(await getUserToken(), payload);
    revalidatePath("/dashboard/blogs");
    revalidatePath("/admin/blogs");
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to submit story");
  }
};

export const addBlogCommentAction = async (slug: string, payload: { text: string }) => {
  try {
    const result = await addBlogCommentApi(await getUserToken(), slug, payload);
    revalidatePath(`/blogs/${slug}`);
    revalidatePath(`/dashboard/blogs/${slug}`);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to add comment");
  }
};
