import { CreateBookingDTO, UpdateBookingDTO } from "../dtos/booking.dto";
import { HttpException } from "../exceptions/http-exception";
import { IBooking } from "../models/booking.model";
import { BookingMongoRepository } from "../repositories/booking.repository";
import { sendEmail } from "../configs/email";
import { Types } from "mongoose";

const bookingRepository = new BookingMongoRepository();

export class BookingService {
  private escapeHtml(value: string | number) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  private toSafeBooking(booking: IBooking) {
    return {
      id: booking._id.toString(),
      userId: booking.userId.toString(),
      itemType: booking.itemType,
      itemId: booking.itemId,
      itemSlug: booking.itemSlug,
      itemTitle: booking.itemTitle,
      amount: booking.amount,
      location: booking.location,
      startDate: booking.startDate,
      endDate: booking.endDate,
      travelers: booking.travelers,
      fullName: booking.fullName,
      email: booking.email,
      phone: booking.phone,
      pickupCity: booking.pickupCity,
      specialRequest: booking.specialRequest,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }

  private buildBookingConfirmationEmail(booking: IBooking) {
    const bookingType = booking.itemType === "trail" ? "Trail" : "Stay";
    const fullName = this.escapeHtml(booking.fullName);
    const itemTitle = this.escapeHtml(booking.itemTitle);
    const location = this.escapeHtml(booking.location || "Nepal");
    const startDate = this.escapeHtml(booking.startDate);
    const amount = this.escapeHtml(booking.amount);
    const status = this.escapeHtml(booking.status);
    const endDateRow = booking.endDate
      ? `<p><strong>End date:</strong> ${this.escapeHtml(booking.endDate)}</p>`
      : "";
    const pickupRow = booking.pickupCity
      ? `<p><strong>Pickup city:</strong> ${this.escapeHtml(booking.pickupCity)}</p>`
      : "";

    return `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
        <h2>Your Yeti Trek booking is confirmed</h2>
        <p>Hello ${fullName},</p>
        <p>Your ${bookingType.toLowerCase()} booking has been confirmed. Here are your booking details:</p>
        <div style="margin:18px 0;padding:16px;border:1px solid #e5e7eb;border-radius:8px;background:#f8fafc">
          <p><strong>Booking:</strong> ${itemTitle}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Start date:</strong> ${startDate}</p>
          ${endDateRow}
          <p><strong>Travelers:</strong> ${booking.travelers}</p>
          <p><strong>Amount:</strong> ${amount}</p>
          ${pickupRow}
          <p><strong>Status:</strong> ${status}</p>
        </div>
        <p>Thank you for booking with Yeti Trek.</p>
      </div>`;
  }

  private async sendBookingConfirmationEmail(booking: IBooking) {
    await sendEmail(
      booking.email,
      "Yeti Trek booking confirmed",
      this.buildBookingConfirmationEmail(booking),
    );
  }

  async createBooking(userId: string, bookingData: CreateBookingDTO) {
    const booking = await bookingRepository.create({
      ...bookingData,
      userId: new Types.ObjectId(userId),
    });

    return this.toSafeBooking(booking);
  }

  async getUserBookings(userId: string) {
    const bookings = await bookingRepository.getByUser(userId);
    return bookings.map((booking) => this.toSafeBooking(booking));
  }

  async getAllAdminBookings(page: number, limit: number, search?: string) {
    const { data, total } = await bookingRepository.getAllPaginated(
      page,
      limit,
      search,
    );

    return {
      data: data.map((booking) => this.toSafeBooking(booking)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getAdminBookingById(bookingId: string) {
    const booking = await bookingRepository.getById(bookingId);
    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }

    return this.toSafeBooking(booking);
  }

  async updateAdminBooking(bookingId: string, bookingData: UpdateBookingDTO) {
    const booking = await bookingRepository.getById(bookingId);
    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }

    const updatedBooking = await bookingRepository.update(bookingId, bookingData);
    if (!updatedBooking) {
      throw new HttpException(404, "Booking not found");
    }

    if (booking.status !== "Confirmed" && updatedBooking.status === "Confirmed") {
      await this.sendBookingConfirmationEmail(updatedBooking);
    }

    return this.toSafeBooking(updatedBooking);
  }

  async deleteAdminBooking(bookingId: string) {
    const deleted = await bookingRepository.delete(bookingId);
    if (!deleted) {
      throw new HttpException(404, "Booking not found");
    }
  }

  async getUserBookingById(userId: string, bookingId: string) {
    const booking = await bookingRepository.getById(bookingId);

    if (!booking || booking.userId.toString() !== userId) {
      throw new HttpException(404, "Booking not found");
    }

    return this.toSafeBooking(booking);
  }
}
