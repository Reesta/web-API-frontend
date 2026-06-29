import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/auth.middleware";

const adminUserRouter = Router();
const adminUserController = new AdminUserController();

adminUserRouter.use(authorizedMiddleware, adminMiddleware);

adminUserRouter.get("/", adminUserController.getAllUsers);
adminUserRouter.get("/:id", adminUserController.getUserById);
adminUserRouter.post("/", adminUserController.createUser);
adminUserRouter.put("/:id", adminUserController.updateUser);
adminUserRouter.patch("/:id", adminUserController.updateUser);
adminUserRouter.delete("/:id", adminUserController.deleteUser);

export default adminUserRouter;
