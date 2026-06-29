import { Request, Response } from "express";
import { z } from "zod";
import {
  CreateAdminUserDTO,
  UpdateAdminUserDTO,
} from "../../dtos/user.dto";
import { UserService } from "../../services/user.service";
import { ApiResponseHelper } from "../../uttils/apihelper.util";

const userService = new UserService();

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
});

export class AdminUserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const query = paginationSchema.safeParse(req.query);
      if (!query.success) {
        return ApiResponseHelper.error(res, z.prettifyError(query.error), 400);
      }

      const { data, meta } = await userService.getAllAdminUsers(
        query.data.page,
        query.data.limit,
        query.data.search,
      );

      return ApiResponseHelper.success(
        res,
        data,
        "Admin users fetched successfully",
        200,
        meta,
      );
    } catch (error: Error | any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch users",
        error.status || 500,
      );
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getAdminUserById(req.params.id as string);
      return ApiResponseHelper.success(res, user, "User fetched successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to fetch user", error.status || 500);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const userData = CreateAdminUserDTO.safeParse(req.body);
      if (!userData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(userData.error), 400);
      }
      const user = await userService.createAdminUser(userData.data);
      return ApiResponseHelper.success(res, user, "User created successfully", 201);
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to create user", error.status || 500);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userData = UpdateAdminUserDTO.safeParse(req.body);
      if (!userData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(userData.error), 400);
      }
      const user = await userService.updateAdminUser(req.params.id as string, userData.data);
      return ApiResponseHelper.success(res, user, "User updated successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to update user", error.status || 500);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      await userService.deleteAdminUser(req.params.id as string);
      return ApiResponseHelper.success(res, null, "User deleted successfully");
    } catch (error: Error | any) {
      return ApiResponseHelper.error(res, error.message || "Failed to delete user", error.status || 500);
    }
  }
}
