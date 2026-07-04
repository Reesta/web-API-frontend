import { Router } from "express";
import { AdminStayController } from "../../controllers/admin/stay.controller";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/auth.middleware";
import { stayUpload } from "../../middlewares/upload.middleware";

const adminStayRouter = Router();
const adminStayController = new AdminStayController();

adminStayRouter.use(authorizedMiddleware, adminMiddleware);

adminStayRouter.get("/", adminStayController.getAllStays);
adminStayRouter.get("/:id", adminStayController.getStayById);
adminStayRouter.post(
  "/",
  stayUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 8 },
  ]),
  adminStayController.createStay,
);
adminStayRouter.put(
  "/:id",
  stayUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 8 },
  ]),
  adminStayController.updateStay,
);
adminStayRouter.patch(
  "/:id",
  stayUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 8 },
  ]),
  adminStayController.updateStay,
);
adminStayRouter.delete("/:id", adminStayController.deleteStay);

export default adminStayRouter;
