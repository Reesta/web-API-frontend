import { axiosInstance } from "./axios-instance";

export type Stay = {
  id: string;
  slug: string;
  name: string;
  price: string;
  image: string;
  galleryImages: string[];
  distance: string;
  description: string;
  experience: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
};

export const getStaysApi = async () => {
  const response = await axiosInstance.get("/stays");
  return response.data;
};

export const getStayBySlugApi = async (slug: string) => {
  const response = await axiosInstance.get(`/stays/${slug}`);
  return response.data;
};
