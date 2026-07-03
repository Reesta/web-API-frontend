import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const bookingRouter = Router();
const bookingController = new BookingController();

bookingRouter.use(authMiddleware);

bookingRouter.get("/", bookingController.getMyBookings);
bookingRouter.get("/:id", bookingController.getMyBookingById);
bookingRouter.post("/", bookingController.createBooking);

export default bookingRouter;
