import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import userRoutes from "../src/routes/user.route";
import adminUserRoutes from "../src/routes/admin/user.route";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Nepal Trekking Companion app Web API is running",
  });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError || err.message === "Only image files are allowed") {
    const message =
      err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE"
        ? "Profile image must be 5 MB or smaller"
        : err.message;

    return res.status(400).json({
      success: false,
      message,
      data: null,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;
