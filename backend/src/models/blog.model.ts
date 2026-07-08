import mongoose, { Document, Schema } from "mongoose";
import {
  BlogCategoryType,
  BlogCommentType,
  BlogSourceType,
  BlogStatusType,
  BlogType,
} from "../types/blog.type";

export interface IBlog extends BlogType, Document {
  _id: mongoose.Types.ObjectId;
  category: BlogCategoryType;
  status: BlogStatusType;
  source: BlogSourceType;
  comments: BlogCommentType[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogCommentMongoSchema = new Schema<BlogCommentType>(
  {
    authorName: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const BlogMongoSchema = new Schema<IBlog>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Trek Guides", "Safety", "Weather", "Culture", "Gear", "News", "User Stories"],
      required: true,
    },
    authorName: { type: String, required: true, trim: true },
    publishDate: { type: Date },
    readingTime: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "pending", "published"],
      default: "draft",
    },
    source: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    featured: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    relatedTrailSlugs: { type: [String], default: [] },
    comments: { type: [BlogCommentMongoSchema], default: [] },
  },
  { timestamps: true },
);

export const BlogModel = mongoose.model<IBlog>("Blog", BlogMongoSchema);
