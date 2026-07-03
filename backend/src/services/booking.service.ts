import { CreateBookingDTO, UpdateBookingDTO } from "../dtos/booking.dto";
import { HttpException } from "../exceptions/http-exception";
import { IBooking } from "../models/booking.model";
import { BookingMongoRepository } from "../repositories/booking.repository";

const bookingRepository = new BookingMongoRepository();

export class BookingService {
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

  async createBooking(userId: string, bookingData: CreateBookingDTO) {
    const booking = await bookingRepository.create({
      ...bookingData,
      userId: userId as any,
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
