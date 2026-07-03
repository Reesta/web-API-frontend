import { Request, Response } from "express";
import { z } from "zod";
import { UpdateBookingDTO } from "../../dtos/booking.dto";
import { BookingService } from "../../services/booking.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const bookingService = new BookingService();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
});

export class AdminBookingController {
  async getAllBookings(req: Request, res: Response) {
    try {
      const query = paginationSchema.safeParse(req.query);
      if (!query.success) {
        return ApiResponseHelper.error(res, z.prettifyError(query.error), 400);
      }

      const { data, meta } = await bookingService.getAllAdminBookings(
        query.data.page,
        query.data.limit,
        query.data.search,
      );

      return ApiResponseHelper.success(
        res,
        data,
        "Admin bookings fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch bookings",
        error.status || 500,
      );
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const booking = await bookingService.getAdminBookingById(req.params.id as string);
      return ApiResponseHelper.success(res, booking, "Booking fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch booking",
        error.status || 500,
      );
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const bookingData = UpdateBookingDTO.safeParse(req.body);
      if (!bookingData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(bookingData.error), 400);
      }

      const booking = await bookingService.updateAdminBooking(
        req.params.id as string,
        bookingData.data,
      );
      return ApiResponseHelper.success(res, booking, "Booking updated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to update booking",
        error.status || 500,
      );
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      await bookingService.deleteAdminBooking(req.params.id as string);
      return ApiResponseHelper.success(res, null, "Booking deleted successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to delete booking",
        error.status || 500,
      );
    }
  }
}
