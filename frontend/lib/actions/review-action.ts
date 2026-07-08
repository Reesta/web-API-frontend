"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { getTokenCookie } from "@/lib/cookies";
import {
  createReviewApi,
  deleteReviewApi,
  getStayReviewsApi,
  updateReviewApi,
} from "@/lib/api/reviews";

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

export const getStayReviewsAction = async (staySlug: string) => {
  try {
    const result = await getStayReviewsApi(staySlug);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load reviews");
  }
};

export const createReviewAction = async (payload: FormData) => {
  try {
    const result = await createReviewApi(await getUserToken(), payload);
    const staySlug = String(payload.get("staySlug") || "");
    if (staySlug) revalidatePath(`/dashboard/stay/${staySlug}`);
    revalidatePath("/admin/reviews");
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to submit review");
  }
};

export const updateReviewAction = async (
  id: string,
  staySlug: string,
  payload: FormData,
) => {
  try {
    const result = await updateReviewApi(await getUserToken(), id, payload);
    revalidatePath(`/dashboard/stay/${staySlug}`);
    revalidatePath("/admin/reviews");
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to update review");
  }
};

export const deleteReviewAction = async (id: string, staySlug: string) => {
  try {
    const result = await deleteReviewApi(await getUserToken(), id);
    revalidatePath(`/dashboard/stay/${staySlug}`);
    revalidatePath("/admin/reviews");
    return { success: true, data: null, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to delete review");
  }
};
