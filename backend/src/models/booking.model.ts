import mongoose, { Document, Schema } from "mongoose";
import { BookingType } from "../types/booking.type";

export interface IBooking extends BookingType, Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: "Confirmed" | "Upcoming" | "Completed" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const BookingMongoSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: {
      type: String,
      enum: ["trail", "stay"],
      required: true,
    },
    itemId: { type: String, default: "" },
    itemSlug: { type: String, required: true, trim: true },
    itemTitle: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, default: "", trim: true },
    travelers: { type: Number, default: 1, min: 1 },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    pickupCity: { type: String, default: "", trim: true },
    specialRequest: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["Confirmed", "Upcoming", "Completed", "Cancelled"],
      default: "Confirmed",
    },
  },
  { timestamps: true },
);

export const BookingModel = mongoose.model<IBooking>("Booking", BookingMongoSchema);
