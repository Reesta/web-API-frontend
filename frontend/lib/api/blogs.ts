import { axiosInstance } from "./axios-instance";

export const blogCategories = [
  "Trek Guides",
  "Safety",
  "Weather",
  "Culture",
  "Gear",
  "News",
  "User Stories",
] as const;

export type BlogCategory = (typeof blogCategories)[number];
export type BlogStatus = "draft" | "pending" | "published";
export type BlogSource = "admin" | "user";

export type BlogComment = {
  authorName: string;
  text: string;
  createdAt: string;
};

export type Blog = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  authorName: string;
  publishDate?: string;
  readingTime: string;
  status: BlogStatus;
  source: BlogSource;
  featured: boolean;
  popular: boolean;
  relatedTrailSlugs: string[];
  comments: BlogComment[];
  createdAt: string;
  updatedAt: string;
};

export const getBlogsApi = async (params?: { search?: string; category?: string }) => {
  const response = await axiosInstance.get("/blogs", { params });
  return response.data;
};

export const getBlogBySlugApi = async (slug: string) => {
  const response = await axiosInstance.get(`/blogs/${slug}`);
  return response.data;
};

export const submitStoryApi = async (token: string, payload: FormData) => {
  const response = await axiosInstance.post("/blogs/stories", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addBlogCommentApi = async (
  token: string,
  slug: string,
  payload: { text: string },
) => {
  const response = await axiosInstance.post(`/blogs/${slug}/comments`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
