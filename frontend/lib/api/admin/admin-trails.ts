import { Trail, TrailWaypoint } from "../trails";
import { axiosInstance } from "../axios-instance";
import { ADMIN_TRAIL_ENDPOINTS } from "../endpoints";

export type AdminTrail = Trail;

export type TrailListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminTrailPayload = {
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
};

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getAdminTrailsApi = async (
  token: string,
  params: { page: number; limit: number; search: string },
) => {
  const response = await axiosInstance.get(ADMIN_TRAIL_ENDPOINTS.LIST, {
    headers: authHeaders(token),
    params,
  });
  return response.data;
};

export const getAdminTrailApi = async (token: string, id: string) => {
  const response = await axiosInstance.get(ADMIN_TRAIL_ENDPOINTS.DETAIL(id), {
    headers: authHeaders(token),
  });
  return response.data;
};

export const createAdminTrailApi = async (token: string, payload: AdminTrailPayload | FormData) => {
  const response = await axiosInstance.post(ADMIN_TRAIL_ENDPOINTS.LIST, payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const updateAdminTrailApi = async (
  token: string,
  id: string,
  payload: AdminTrailPayload | FormData,
) => {
  const response = await axiosInstance.patch(
    ADMIN_TRAIL_ENDPOINTS.DETAIL(id),
    payload,
    { headers: authHeaders(token) },
  );
  return response.data;
};

export const deleteAdminTrailApi = async (token: string, id: string) => {
  const response = await axiosInstance.delete(ADMIN_TRAIL_ENDPOINTS.DETAIL(id), {
    headers: authHeaders(token),
  });
  return response.data;
};
