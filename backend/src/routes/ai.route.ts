import { Router } from "express";
import { AiController } from "../controllers/ai.controller";

const aiRouter = Router();
const aiController = new AiController();

aiRouter.post("/trek-assistant", aiController.askTrekAssistant);

export default aiRouter;
