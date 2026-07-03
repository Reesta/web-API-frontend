"use server";

import { AxiosError } from "axios";
import { getStayBySlugApi, getStaysApi } from "../api/stays";

const failure = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return {
    success: false,
    message: axiosError.response?.data?.message || fallback,
    data: null,
    meta: null,
  };
};

export const getStaysAction = async () => {
  try {
    const result = await getStaysApi();
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load stays");
  }
};

export const getStayBySlugAction = async (slug: string) => {
  try {
    const result = await getStayBySlugApi(slug);
    return { success: true, data: result.data, meta: null, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load stay");
  }
};
