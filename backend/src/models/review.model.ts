import mongoose, { Document, Schema } from "mongoose";
import { ReviewType } from "../types/review.type";

export interface IReview extends ReviewType, Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewMongoSchema = new Schema<IReview>(
  {
    staySlug: { type: String, required: true, lowercase: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    text: { type: String, required: true, trim: true, maxlength: 1200 },
    photos: { type: [String], default: [] },
    helpfulCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

ReviewMongoSchema.index({ staySlug: 1, userId: 1 }, { unique: true });

export const ReviewModel = mongoose.model<IReview>("Review", ReviewMongoSchema);
