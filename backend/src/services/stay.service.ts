import { CreateStayDTO, UpdateStayDTO } from "../dtos/stay.dto";
import { HttpException } from "../exceptions/http-exception";
import { IStay } from "../models/stay.model";
import { StayMongoRepository } from "../repositories/stay.repository";

const stayRepository = new StayMongoRepository();

export class StayService {
  private toSafeStay(stay: IStay) {
    return {
      id: stay._id,
      slug: stay.slug,
      name: stay.name,
      price: stay.price,
      image: stay.image,
      galleryImages: stay.galleryImages || [],
      distance: stay.distance,
      description: stay.description,
      experience: stay.experience,
      amenities: stay.amenities,
      createdAt: stay.createdAt,
      updatedAt: stay.updatedAt,
    };
  }

  async getAllStays() {
    const stays = await stayRepository.getAll();
    return stays.map((stay) => this.toSafeStay(stay));
  }

  async getStayBySlug(slug: string) {
    const stay = await stayRepository.getBySlug(slug);
    if (!stay) throw new HttpException(404, "Stay not found");
    return this.toSafeStay(stay);
  }

  async getAdminStays(page: number, limit: number, search?: string) {
    const { data, total } = await stayRepository.getAllPaginated(page, limit, search);
    return {
      data: data.map((stay) => this.toSafeStay(stay)),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async getAdminStayById(id: string) {
    const stay = await stayRepository.getById(id);
    if (!stay) throw new HttpException(404, "Stay not found");
    return this.toSafeStay(stay);
  }

  async createStay(stayData: CreateStayDTO) {
    const existingStay = await stayRepository.getBySlug(stayData.slug);
    if (existingStay) throw new HttpException(400, "Stay slug already exists");
    const stay = await stayRepository.create(stayData);
    return this.toSafeStay(stay);
  }

  async updateStay(id: string, stayData: UpdateStayDTO) {
    const stay = await stayRepository.getById(id);
    if (!stay) throw new HttpException(404, "Stay not found");

    if (stayData.slug) {
      const existingStay = await stayRepository.getBySlug(stayData.slug);
      if (existingStay && existingStay._id.toString() !== id) {
        throw new HttpException(400, "Stay slug already exists");
      }
    }

    const updatedStay = await stayRepository.update(id, stayData);
    if (!updatedStay) throw new HttpException(404, "Stay not found");
    return this.toSafeStay(updatedStay);
  }

  async deleteStay(id: string) {
    const deleted = await stayRepository.delete(id);
    if (!deleted) throw new HttpException(404, "Stay not found");
  }
}
