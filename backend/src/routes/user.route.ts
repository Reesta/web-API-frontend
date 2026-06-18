import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { profileUpload } from "../middlewares/upload.middleware";
 
const userRouter = Router();
const userController = new UserController();
 
userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/whoami", authMiddleware, userController.getLoggedInUser);
userRouter.patch(
  "/update",
  authMiddleware,
  profileUpload.single("profileImage"),
  userController.updateLoggedInUser,
);
 
export default userRouter;
 
