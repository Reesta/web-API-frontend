"use server";

import { AxiosError } from "axios";
import { revalidatePath } from "next/cache";
import { getTokenCookie } from "@/lib/cookies";
import {
  BookingPayload,
  createBookingApi,
  getMyBookingsApi,
} from "@/lib/api/bookings";

const failure = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return {
    success: false,
    message: axiosError.response?.data?.message || fallback,
    data: null,
  };
};

const getToken = async () => {
  const token = await getTokenCookie();
  if (!token) throw new Error("You need to login first");
  return token;
};

export const createBookingAction = async (payload: BookingPayload) => {
  try {
    const result = await createBookingApi(await getToken(), payload);
    revalidatePath("/dashboard/booking-history");
    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    return failure(error, "Unable to create booking");
  }
};

export const getMyBookingsAction = async () => {
  try {
    const result = await getMyBookingsApi(await getToken());
    return { success: true, data: result.data, message: result.message };
  } catch (error) {
    return failure(error, "Unable to load bookings");
  }
};
