import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import { HttpException } from "../exceptions/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
 
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
}
 
