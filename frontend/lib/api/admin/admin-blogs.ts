import { Blog, BlogCategory, BlogSource, BlogStatus } from "../blogs";
import { axiosInstance } from "../axios-instance";

export type AdminBlog = Blog;

export type BlogListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminBlogPayload = {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  authorName: string;
  readingTime: string;
  status: BlogStatus;
  source: BlogSource;
  featured: boolean;
  popular: boolean;
  relatedTrailSlugs: string[];
  publishDate?: string;
};

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getAdminBlogsApi = async (
  token: string,
  params: { page: number; limit: number; search: string; status: string },
) => {
  const response = await axiosInstance.get("/admin/blogs", {
    headers: authHeaders(token),
    params,
  });
  return response.data;
};

export const getAdminBlogApi = async (token: string, id: string) => {
  const response = await axiosInstance.get(`/admin/blogs/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const createAdminBlogApi = async (token: string, payload: AdminBlogPayload | FormData) => {
  const response = await axiosInstance.post("/admin/blogs", payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const updateAdminBlogApi = async (
  token: string,
  id: string,
  payload: AdminBlogPayload | FormData,
) => {
  const response = await axiosInstance.patch(`/admin/blogs/${id}`, payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const deleteAdminBlogApi = async (token: string, id: string) => {
  const response = await axiosInstance.delete(`/admin/blogs/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
};
