import mongoose from "mongoose";
import { AdminUpdateMomentDTO, CreateMomentDTO, UpdateMomentDTO } from "../dtos/moment.dto";
import { HttpException } from "../exceptions/http-exception";
import { IMoment } from "../models/moment.model";
import { MomentMongoRepository } from "../repositories/moment.repository";

const momentRepository = new MomentMongoRepository();

type PopulatedUser = {
  _id?: unknown;
  fullName?: string;
  profileImage?: string;
};

export class MomentService {
  private userId(moment: IMoment) {
    const user = moment.userId as unknown as PopulatedUser;
    return user?._id?.toString?.() || moment.userId.toString();
  }

  private toSafeMoment(moment: IMoment) {
    const user = moment.userId as unknown as PopulatedUser;
    return {
      id: moment._id,
      title: moment.title,
      caption: moment.caption,
      location: moment.location,
      trailSlug: moment.trailSlug,
      image: moment.image,
      status: moment.status,
      uploadedBy: {
        id: this.userId(moment),
        fullName: user?.fullName || "Yeti Trek traveler",
        profileImage: user?.profileImage || "",
      },
      createdAt: moment.createdAt,
      updatedAt: moment.updatedAt,
    };
  }

  private ensureValidId(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new HttpException(400, "Invalid moment ID");
    }
  }

  private canManage(moment: IMoment, userId: string, role?: string) {
    return role === "admin" || this.userId(moment) === userId;
  }

  async getAllMoments() {
    const moments = await momentRepository.getAll();
    return moments.map((moment) => this.toSafeMoment(moment));
  }

  async getMomentById(id: string) {
    this.ensureValidId(id);
    const moment = await momentRepository.getById(id);
    if (!moment) throw new HttpException(404, "Moment not found");
    return this.toSafeMoment(moment);
  }

  async getMyMoments(userId: string) {
    const moments = await momentRepository.getByUser(userId);
    return moments.map((moment) => this.toSafeMoment(moment));
  }

  async createMoment(userId: string, payload: CreateMomentDTO, image: string) {
    if (!image) throw new HttpException(400, "Moment image is required");
    const moment = await momentRepository.create({
      ...payload,
      image,
      userId: new mongoose.Types.ObjectId(userId),
    });
    const created = await momentRepository.getById(moment._id.toString());
    return this.toSafeMoment(created || moment);
  }

  async updateMoment(
    userId: string,
    role: string | undefined,
    id: string,
    payload: UpdateMomentDTO,
    image?: string,
  ) {
    this.ensureValidId(id);
    const moment = await momentRepository.getById(id);
    if (!moment) throw new HttpException(404, "Moment not found");
    if (!this.canManage(moment, userId, role)) {
      throw new HttpException(403, "You can edit only your own moment");
    }

    const updated = await momentRepository.update(id, {
      ...payload,
      ...(image ? { image } : {}),
      ...(role !== "admin" ? { status: "pending" as const } : {}),
    });
    if (!updated) throw new HttpException(404, "Moment not found");
    return this.toSafeMoment(updated);
  }

  async deleteMoment(userId: string, role: string | undefined, id: string) {
    this.ensureValidId(id);
    const moment = await momentRepository.getById(id);
    if (!moment) throw new HttpException(404, "Moment not found");
    if (!this.canManage(moment, userId, role)) {
      throw new HttpException(403, "You can delete only your own moment");
    }
    if (!(await momentRepository.delete(id))) {
      throw new HttpException(404, "Moment not found");
    }
  }

  async getAdminMoments(page: number, limit: number, search?: string) {
    const { data, total } = await momentRepository.getAllPaginated(page, limit, search);
    return {
      data: data.map((moment) => this.toSafeMoment(moment)),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async updateAdminMoment(id: string, payload: AdminUpdateMomentDTO) {
    this.ensureValidId(id);
    const updated = await momentRepository.update(id, payload);
    if (!updated) throw new HttpException(404, "Moment not found");
    return this.toSafeMoment(updated);
  }

  async deleteAdminMoment(id: string) {
    this.ensureValidId(id);
    if (!(await momentRepository.delete(id))) throw new HttpException(404, "Moment not found");
  }
}
