import { Request, Response } from "express";
import { AiService } from "../services/ai.service";
import { ApiResponseHelper } from "../uttils/apihelper.util";

const aiService = new AiService();

export class AiController {
  async askTrekAssistant(req: Request, res: Response) {
    try {
      const question = typeof req.body.question === "string" ? req.body.question : "";
      const result = await aiService.askTrekAssistant(question);
      return ApiResponseHelper.success(res, result, "AI response generated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to generate AI response",
        error.status || 500,
      );
    }
  }
}
