import { Request, Response } from "express";
import { z } from "zod";
import { CreateBookingDTO } from "../dtos/booking.dto";
import { BookingService } from "../services/booking.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const bookingService = new BookingService();

export class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const bookingData = CreateBookingDTO.safeParse(req.body);
      if (!bookingData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(bookingData.error), 400);
      }

      const booking = await bookingService.createBooking(userId, bookingData.data);
      return ApiResponseHelper.success(res, booking, "Booking created successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to create booking",
        error.status || 500,
      );
    }
  }

  async getMyBookings(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const bookings = await bookingService.getUserBookings(userId);
      return ApiResponseHelper.success(res, bookings, "Bookings fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch bookings",
        error.status || 500,
      );
    }
  }

  async getMyBookingById(req: Request, res: Response) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const booking = await bookingService.getUserBookingById(
        userId,
        req.params.id as string,
      );
      return ApiResponseHelper.success(res, booking, "Booking fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch booking",
        error.status || 500,
      );
    }
  }
}
