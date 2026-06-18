import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { ApiResponseHelper } from "../uttils/apihelper.util";
import { HttpException } from "../exceptions/http-exception";
import { IUser } from "../models/user.model";
import { UserMongoRepository } from "../repositories/user.repository";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any> | IUser;
    }
  }
}

const userRepository = new UserMongoRepository();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpException(401, "Unauthorized JWT invalid");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new HttpException(401, "Unauthorized JWT missing");
    }

    const decodedToken = jwt.verify(token, SECRET_KEY) as Record<string, any>;

    if (!decodedToken || !decodedToken.id) {
      throw new HttpException(401, "Unauthorized JWT unverified");
    }

    const user = await userRepository.getUserById(decodedToken.id);

    if (!user) {
      throw new HttpException(401, "Unauthorized user not found");
    }

    req.user = user;
    return next();
  } catch (error: Error | any) {
    return ApiResponseHelper.error(
      res,
      error.message || "Internal Server Error",
      error.status || 500,
    );
  }
};

export const authorizedMiddleware = authMiddleware;

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new HttpException(401, "Unauthorized no user info");
    }

    if (req.user.role !== "admin") {
      throw new HttpException(403, "Forbidden not admin");
    }

    return next();
  } catch (error: Error | any) {
    return ApiResponseHelper.error(
      res,
      error.message || "Internal Server Error",
      error.status || 500,
    );
  }
};
