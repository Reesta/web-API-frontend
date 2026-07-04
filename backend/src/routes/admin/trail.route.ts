import { Router } from "express";
import { AdminTrailController } from "../../controllers/admin/trail.controller";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/auth.middleware";
import { trailUpload } from "../../middlewares/upload.middleware";

const adminTrailRouter = Router();
const adminTrailController = new AdminTrailController();

adminTrailRouter.use(authorizedMiddleware, adminMiddleware);

adminTrailRouter.get("/", adminTrailController.getAllTrails);
adminTrailRouter.get("/:id", adminTrailController.getTrailById);
adminTrailRouter.post("/", trailUpload.single("image"), adminTrailController.createTrail);
adminTrailRouter.put("/:id", trailUpload.single("image"), adminTrailController.updateTrail);
adminTrailRouter.patch("/:id", trailUpload.single("image"), adminTrailController.updateTrail);
adminTrailRouter.delete("/:id", adminTrailController.deleteTrail);

export default adminTrailRouter;
