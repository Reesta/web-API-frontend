import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
import userRoutes from "../src/routes/user.route";
import adminUserRoutes from "../src/routes/admin/user.route";
import trailRoutes from "../src/routes/trail.route";
import adminTrailRoutes from "../src/routes/admin/trail.route";
import stayRoutes from "../src/routes/stay.route";
import adminStayRoutes from "../src/routes/admin/stay.route";
import bookingRoutes from "../src/routes/booking.route";
import adminBookingRoutes from "../src/routes/admin/booking.route";
import blogRoutes from "../src/routes/blog.route";
import adminBlogRoutes from "../src/routes/admin/blog.route";
import reviewRoutes from "../src/routes/review.route";
import adminReviewRoutes from "../src/routes/admin/review.route";
import aiRoutes from "../src/routes/ai.route";
import momentRoutes from "../src/routes/moment.route";
import adminMomentRoutes from "../src/routes/admin/moment.route";

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
app.use("/api/v1/trails", trailRoutes);
app.use("/api/v1/stays", stayRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/moments", momentRoutes);
app.use("/api/v1/admin/users", adminUserRoutes);
app.use("/api/v1/admin/trails", adminTrailRoutes);
app.use("/api/v1/admin/stays", adminStayRoutes);
app.use("/api/v1/admin/bookings", adminBookingRoutes);
app.use("/api/v1/admin/blogs", adminBlogRoutes);
app.use("/api/v1/admin/reviews", adminReviewRoutes);
app.use("/api/v1/admin/moments", adminMomentRoutes);

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
        ? "Image must be 5 MB or smaller"
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
