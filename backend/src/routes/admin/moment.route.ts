import { Router } from "express";
import { AdminMomentController } from "../../controllers/admin/moment.controller";
import { adminMiddleware, authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const controller = new AdminMomentController();
router.use(authMiddleware, adminMiddleware);
router.get("/", controller.getAll);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);
export default router;
