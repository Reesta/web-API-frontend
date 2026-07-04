"use server";

import { AxiosError } from "axios";
import { getTrailBySlugApi, getTrailsApi } from "../api/trails";

const failure = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return {
    success: false,
    message: axiosError.response?.data?.message || fallback,
    data: null,
    meta: null,
  };
};

export const getTrailsAction = async () => {
  try {
    const result = await getTrailsApi();
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load trails");
  }
};

export const getTrailBySlugAction = async (slug: string) => {
  try {
    const result = await getTrailBySlugApi(slug);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load trail");
  }
};
