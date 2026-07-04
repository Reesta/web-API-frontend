import { CreateTrailDTO, UpdateTrailDTO } from "../dtos/trail.dto";
import { HttpException } from "../exceptions/http-exception";
import { ITrail } from "../models/trail.model";
import { TrailMongoRepository } from "../repositories/trail.repository";

const trailRepository = new TrailMongoRepository();

export class TrailService {
  private toSafeTrail(trail: ITrail) {
    return {
      id: trail._id,
      slug: trail.slug,
      title: trail.title,
      altitude: trail.altitude,
      distance: trail.distance,
      duration: trail.duration,
      detailDuration: trail.detailDuration,
      image: trail.image,
      difficulty: trail.difficulty,
      text: trail.text,
      waypoints: trail.waypoints,
      createdAt: trail.createdAt,
      updatedAt: trail.updatedAt,
    };
  }

  async getAllTrails() {
    const trails = await trailRepository.getAll();
    return trails.map((trail) => this.toSafeTrail(trail));
  }

  async getTrailBySlug(slug: string) {
    const trail = await trailRepository.getBySlug(slug);
    if (!trail) {
      throw new HttpException(404, "Trail not found");
    }
    return this.toSafeTrail(trail);
  }

  async getAdminTrails(page: number, limit: number, search?: string) {
    const { data, total } = await trailRepository.getAllPaginated(page, limit, search);

    return {
      data: data.map((trail) => this.toSafeTrail(trail)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getAdminTrailById(id: string) {
    const trail = await trailRepository.getById(id);
    if (!trail) {
      throw new HttpException(404, "Trail not found");
    }
    return this.toSafeTrail(trail);
  }

  async createTrail(trailData: CreateTrailDTO) {
    const existingTrail = await trailRepository.getBySlug(trailData.slug);
    if (existingTrail) {
      throw new HttpException(400, "Trail slug already exists");
    }

    const trail = await trailRepository.create(trailData);
    return this.toSafeTrail(trail);
  }

  async updateTrail(id: string, trailData: UpdateTrailDTO) {
    const trail = await trailRepository.getById(id);
    if (!trail) {
      throw new HttpException(404, "Trail not found");
    }

    if (trailData.slug) {
      const existingTrail = await trailRepository.getBySlug(trailData.slug);
      if (existingTrail && existingTrail._id.toString() !== id) {
        throw new HttpException(400, "Trail slug already exists");
      }
    }

    const updatedTrail = await trailRepository.update(id, trailData);
    if (!updatedTrail) {
      throw new HttpException(404, "Trail not found");
    }

    return this.toSafeTrail(updatedTrail);
  }

  async deleteTrail(id: string) {
    const deleted = await trailRepository.delete(id);
    if (!deleted) {
      throw new HttpException(404, "Trail not found");
    }
  }
}
