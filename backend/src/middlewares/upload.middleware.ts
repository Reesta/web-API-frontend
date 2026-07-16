import path from "path";
import fs from "fs";
import multer from "multer";

type ImageFolder = "profile" | "trails" | "stays" | "blogs" | "reviews" | "moments";

const imageStorage = (folder: ImageFolder) => multer.diskStorage({
  destination: (_req, _file, callback) => {
    const destination = `uploads/${folder}`;
    fs.mkdirSync(destination, { recursive: true });
    callback(null, destination);
  },
  filename: (_req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1_000_000_000,
    )}${path.extname(file.originalname)}`;

    callback(null, uniqueName);
  },
});

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (!file.mimetype.startsWith("image/")) {
    return callback(new Error("Only image files are allowed"));
  }

  return callback(null, true);
};

const imageUpload = (folder: ImageFolder) => multer({
  storage: imageStorage(folder),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
});

export const profileUpload = imageUpload("profile");
export const trailUpload = imageUpload("trails");
export const stayUpload = imageUpload("stays");
export const blogUpload = imageUpload("blogs");
export const reviewUpload = imageUpload("reviews");
export const momentUpload = imageUpload("moments");
