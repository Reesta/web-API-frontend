import dotenv from "dotenv";

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 4000;

export const MONGODB_URL: string =
  process.env.MONGODB_URL || "mongodb://localhost:27017/Nepal-Trekking-Companion-db";

export const SECRET_KEY: string =
  process.env.SECRET_KEY || "merosecretkey";

export const EMAIL_USER: string = process.env.EMAIL_USER || "";
export const EMAIL_PASS: string = process.env.EMAIL_PASS || "";
export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";
