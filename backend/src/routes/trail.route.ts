import { Router } from "express";
import { TrailController } from "../controllers/trail.controller";

const trailRouter = Router();
const trailController = new TrailController();

trailRouter.get("/", trailController.getAllTrails);
trailRouter.get("/:slug", trailController.getTrailBySlug);

export default trailRouter;
