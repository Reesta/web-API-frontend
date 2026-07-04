import { axiosInstance } from "./axios-instance";

export type TrailWaypoint = {
  day: string;
  title: string;
  altitude: string;
  text: string;
};

export type Trail = {
  id: string;
  slug: string;
  title: string;
  altitude: string;
  distance: string;
  duration: string;
  detailDuration: string;
  image: string;
  difficulty: "Easy" | "Mod" | "Hard";
  text: string;
  waypoints: TrailWaypoint[];
  createdAt: string;
  updatedAt: string;
};

export const getTrailsApi = async () => {
  const response = await axiosInstance.get("/trails");
  return response.data;
};

export const getTrailBySlugApi = async (slug: string) => {
  const response = await axiosInstance.get(`/trails/${slug}`);
  return response.data;
};
