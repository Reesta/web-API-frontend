import { axiosInstance } from "../axios-instance";
import { Review } from "../reviews";

export type AdminReview = Review;

export type ReviewListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getAdminReviewsApi = async (
  token: string,
  params: { page: number; limit: number; search: string },
) => {
  const response = await axiosInstance.get("/admin/reviews", {
    headers: authHeaders(token),
    params,
  });
  return response.data;
};

export const updateAdminReviewApi = async (
  token: string,
  id: string,
  payload: { rating?: number; title?: string; text?: string; helpfulCount?: number },
) => {
  const response = await axiosInstance.patch(`/admin/reviews/${id}`, payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const deleteAdminReviewApi = async (token: string, id: string) => {
  const response = await axiosInstance.delete(`/admin/reviews/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
};
