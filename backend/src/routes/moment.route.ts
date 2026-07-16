import { Router } from "express";
import { MomentController } from "../controllers/moment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { momentUpload } from "../middlewares/upload.middleware";

const momentRouter = Router();
const momentController = new MomentController();

momentRouter.get("/", momentController.getAllMoments);
momentRouter.get("/mine", authMiddleware, momentController.getMyMoments);
momentRouter.get("/:id", momentController.getMomentById);
momentRouter.post(
  "/",
  authMiddleware,
  momentUpload.single("image"),
  momentController.createMoment,
);
momentRouter.patch(
  "/:id",
  authMiddleware,
  momentUpload.single("image"),
  momentController.updateMoment,
);
momentRouter.delete("/:id", authMiddleware, momentController.deleteMoment);

export default momentRouter;
