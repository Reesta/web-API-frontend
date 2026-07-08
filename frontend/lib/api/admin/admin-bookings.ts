import { Booking } from "../bookings";
import { axiosInstance } from "../axios-instance";

export type AdminBooking = Booking & {
  userId: string;
};

export type AdminBookingPayload = {
  status: "Pending" | "Confirmed" | "Cancelled";
  startDate: string;
  endDate?: string;
  travelers: number;
  fullName: string;
  email: string;
  phone: string;
  pickupCity?: string;
  specialRequest?: string;
  amount: string;
};

export type BookingListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getAdminBookingsApi = async (
  token: string,
  params: { page: number; limit: number; search: string },
) => {
  const response = await axiosInstance.get("/admin/bookings", {
    headers: authHeaders(token),
    params,
  });
  return response.data;
};

export const getAdminBookingApi = async (token: string, id: string) => {
  const response = await axiosInstance.get(`/admin/bookings/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const updateAdminBookingApi = async (
  token: string,
  id: string,
  payload: AdminBookingPayload,
) => {
  const response = await axiosInstance.patch(`/admin/bookings/${id}`, payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const deleteAdminBookingApi = async (token: string, id: string) => {
  const response = await axiosInstance.delete(`/admin/bookings/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
};
