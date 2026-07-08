import { axiosInstance } from "./axios-instance";

export type BookingPayload = {
  itemType: "trail" | "stay";
  itemId?: string;
  itemSlug: string;
  itemTitle: string;
  amount: string;
  location?: string;
  startDate: string;
  endDate?: string;
  travelers: number;
  fullName: string;
  email: string;
  phone: string;
  pickupCity?: string;
  specialRequest?: string;
};

export type Booking = BookingPayload & {
  id: string;
  userId: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: string;
  updatedAt: string;
};

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const createBookingApi = async (token: string, payload: BookingPayload) => {
  const response = await axiosInstance.post("/bookings", payload, {
    headers: authHeaders(token),
  });
  return response.data;
};

export const getMyBookingsApi = async (token: string) => {
  const response = await axiosInstance.get("/bookings", {
    headers: authHeaders(token),
  });
  return response.data;
};
