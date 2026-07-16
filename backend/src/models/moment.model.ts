import mongoose, { Document, Schema } from "mongoose";
import { MomentType } from "../types/moment.type";

export interface IMoment extends MomentType, Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MomentMongoSchema = new Schema<IMoment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    caption: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    trailSlug: { type: String, trim: true },
    image: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

export const MomentModel = mongoose.model<IMoment>("Moment", MomentMongoSchema);
