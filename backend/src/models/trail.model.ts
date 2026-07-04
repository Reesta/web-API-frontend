import mongoose, { Document, Schema } from "mongoose";
import { TrailType, WaypointType } from "../types/trail.type";

export interface ITrail extends TrailType, Document {
  _id: mongoose.Types.ObjectId;
  waypoints: WaypointType[];
  createdAt: Date;
  updatedAt: Date;
}

const WaypointMongoSchema = new Schema<WaypointType>(
  {
    day: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    altitude: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const TrailMongoSchema = new Schema<ITrail>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    altitude: { type: String, required: true, trim: true },
    distance: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    detailDuration: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Mod", "Hard"],
      required: true,
    },
    text: { type: String, required: true, trim: true },
    waypoints: { type: [WaypointMongoSchema], default: [] },
  },
  { timestamps: true },
);

export const TrailModel = mongoose.model<ITrail>("Trail", TrailMongoSchema);
