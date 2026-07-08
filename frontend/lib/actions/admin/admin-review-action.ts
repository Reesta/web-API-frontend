"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { getTokenCookie } from "@/lib/cookies";
import {
  deleteAdminReviewApi,
  getAdminReviewsApi,
  updateAdminReviewApi,
} from "@/lib/api/admin/admin-reviews";

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

export const getAdminReviewsAction = async ({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const result = await getAdminReviewsApi(await getAdminToken(), {
      page: Math.max(1, page),
      limit: Math.min(50, Math.max(1, limit)),
      search,
    });
    return { success: true, data: result.data, meta: result.meta, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load reviews");
  }
};

export const updateAdminReviewAction = async (
  id: string,
  staySlug: string,
  payload: { rating?: number; title?: string; text?: string; helpfulCount?: number },
) => {
  try {
    const result = await updateAdminReviewApi(await getAdminToken(), id, payload);
    revalidatePath("/admin/reviews");
    revalidatePath(`/dashboard/stay/${staySlug}`);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to update review");
  }
};

export const deleteAdminReviewAction = async (id: string, staySlug: string) => {
  try {
    const result = await deleteAdminReviewApi(await getAdminToken(), id);
    revalidatePath("/admin/reviews");
    revalidatePath(`/dashboard/stay/${staySlug}`);
    return { success: true, data: null, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to delete review");
  }
};
