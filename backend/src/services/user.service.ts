import { UserMongoRepository } from "../repositories/user.repository";
import {
  CreateAdminUserDTO,
  CreateUserDTO,
  LoginUserDTO,
  UpdateAdminUserDTO,
  UpdateUserDTO,
} from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CLIENT_URL, SECRET_KEY } from "../configs/constant";
import { sendEmail } from "../configs/email";
 
const userRepository = new UserMongoRepository();
 
export class UserService {
  private toSafeUser(user: IUser) {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage || "",
    };
  }

  private toAdminSafeUser(user: IUser) {
    return {
      ...this.toSafeUser(user),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(userData: CreateUserDTO): Promise<IUser> {
    // Check existing email
    const existingEmail = await userRepository.getUserByEmail(userData.email);
 
    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }
 
    // Hash password
    const hashedPassword = await bcryptjs.hash(userData.password, 10);
 
    const user = await userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
 
    return user;
  }
 
  async loginUser(loginData: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(loginData.email);
 
    if (!user) {
      throw new HttpException(400, "Invalid email");
    }
 
    const isPasswordValid = await bcryptjs.compare(
      loginData.password,
      user.password,
    );
 
    if (!isPasswordValid) {
      throw new HttpException(400, "Invalid password");
    }
 
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: "30d",
      },
    );
 
    return {
      user: this.toSafeUser(user),
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return this.toSafeUser(user);
  }

  async sendResetPasswordEmail(email: string) {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const token = jwt.sign(
      { id: user._id.toString(), purpose: "password-reset" },
      SECRET_KEY,
      { expiresIn: "1h" },
    );
    const resetLink = `${CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033">
        <h2>Reset your Yeti Trek password</h2>
        <p>We received a request to reset your password. This link expires in one hour.</p>
        <p><a href="${resetLink}">Reset password</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>`;

    await sendEmail(user.email, "Yeti Trek password reset", html);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as {
        id?: string;
        purpose?: string;
      };

      if (!decoded.id || decoded.purpose !== "password-reset") {
        throw new Error("Invalid reset token");
      }

      const user = await userRepository.getUserById(decoded.id);
      if (!user) {
        throw new HttpException(404, "User not found");
      }

      const password = await bcryptjs.hash(newPassword, 10);
      const updatedUser = await userRepository.update(decoded.id, { password });

      if (!updatedUser) {
        throw new HttpException(404, "User not found");
      }
    } catch (error) {
      if (error instanceof HttpException && error.status === 404) {
        throw error;
      }
      throw new HttpException(400, "Invalid or expired reset token");
    }
  }

  async updateUser(
    userId: string,
    userData: UpdateUserDTO & { profileImage?: string },
  ) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (userData.email) {
      const existingEmail = await userRepository.getUserByEmail(userData.email);

      if (existingEmail && existingEmail._id.toString() !== userId) {
        throw new HttpException(400, "Email already exists");
      }
    }

    const hasPasswordUpdate =
      userData.currentPassword ||
      userData.newPassword ||
      userData.confirmPassword;

    if (hasPasswordUpdate) {
      if (
        !userData.currentPassword ||
        !userData.newPassword ||
        !userData.confirmPassword
      ) {
        throw new HttpException(400, "All password fields are required");
      }

      if (userData.newPassword !== userData.confirmPassword) {
        throw new HttpException(400, "New password and confirm password do not match");
      }

      const isPasswordValid = await bcryptjs.compare(
        userData.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException(400, "Current password is incorrect");
      }
    }

    const { currentPassword, newPassword, confirmPassword, ...profileData } =
      userData;
    const updateData: Partial<IUser> = { ...profileData };

    if (newPassword) {
      updateData.password = await bcryptjs.hash(newPassword, 10);
    }

    const updatedUser = await userRepository.update(userId, updateData);

    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return this.toSafeUser(updatedUser);
  }

  async getAdminUserById(userId: string) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    return this.toAdminSafeUser(user);
  }

  async getAllAdminUsers(page: number, limit: number, search?: string) {
    const { data, total } = await userRepository.getAllPaginated(
      page,
      limit,
      search,
    );

    return {
      data: data.map((user) => this.toAdminSafeUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async createAdminUser(userData: CreateAdminUserDTO) {
    const existingEmail = await userRepository.getUserByEmail(userData.email);

    if (existingEmail) {
      throw new HttpException(400, "Email already exists");
    }

    const password = await bcryptjs.hash(userData.password, 10);
    const user = await userRepository.createUser({ ...userData, password });

    return this.toAdminSafeUser(user);
  }

  async updateAdminUser(userId: string, userData: UpdateAdminUserDTO) {
    const user = await userRepository.getUserById(userId);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (userData.email) {
      const existingEmail = await userRepository.getUserByEmail(userData.email);
      if (existingEmail && existingEmail._id.toString() !== userId) {
        throw new HttpException(400, "Email already exists");
      }
    }

    const updateData: Partial<IUser> = { ...userData };
    if (userData.password) {
      updateData.password = await bcryptjs.hash(userData.password, 10);
    }

    const updatedUser = await userRepository.update(userId, updateData);
    if (!updatedUser) {
      throw new HttpException(404, "User not found");
    }

    return this.toAdminSafeUser(updatedUser);
  }

  async deleteAdminUser(userId: string) {
    const deleted = await userRepository.delete(userId);
    if (!deleted) {
      throw new HttpException(404, "User not found");
    }
  }
}
 
