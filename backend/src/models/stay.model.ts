import mongoose, { Document, Schema } from "mongoose";
import { StayType } from "../types/stay.type";

export interface IStay extends StayType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StayMongoSchema = new Schema<IStay>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    galleryImages: { type: [String], default: [] },
    distance: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    amenities: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const StayModel = mongoose.model<IStay>("Stay", StayMongoSchema);
