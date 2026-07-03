import { Router } from "express";
import { StayController } from "../controllers/stay.controller";

const stayRouter = Router();
const stayController = new StayController();

stayRouter.get("/", stayController.getAllStays);
stayRouter.get("/:slug", stayController.getStayBySlug);

export default stayRouter;
