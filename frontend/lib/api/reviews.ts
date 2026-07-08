import { axiosInstance } from "./axios-instance";

export type Review = {
  id: string;
  staySlug: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  photos: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ReviewSummary = {
  averageRating: number;
  totalReviews: number;
};

export type StayReviewResponse = {
  reviews: Review[];
  summary: ReviewSummary;
};

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getStayReviewsApi = async (staySlug: string) => {
  const response = await axiosInstance.get(`/reviews/stay/${staySlug}`);
  return response.data;
};

export const createReviewApi = async (token: string, payload: FormData) => {
  const response = await axiosInstance.post("/reviews", payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const updateReviewApi = async (
  token: string,
  id: string,
  payload: FormData,
) => {
  const response = await axiosInstance.patch(`/reviews/${id}`, payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const deleteReviewApi = async (token: string, id: string) => {
  const response = await axiosInstance.delete(`/reviews/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
};
