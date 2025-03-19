import { AppDataSource } from "../config/database";
import { Resource } from "../entities/Resource";
import { ResourceType } from "../entities/ResourceType";
import { Reservation } from "../entities/Reservation";
import { User } from "../entities/User";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";
import { FindManyOptions, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

interface ResourceCreateParams {
  name: string;
  description?: string;
  typeId: number;
  status?: "Available" | "Requested" | "Reserved" | "Maintenance"; 
}

interface ReservationCreateParams {
  userId: string;
  resourceId: number;
  startTime: Date | string; 
  endTime: Date | string;
  purpose?: string;
  status?: "Requested" | "Approved" | "Rejected" | "Returned"; 
}

interface ResourceFilterParams {
  page?: number;
  limit?: number;
  status?: "Available" | "Requested" | "Reserved" | "Maintenance";
  typeId?: number;
}

interface ReservationFilterParams {
  page?: number;
  limit?: number;
  status?: "Requested" | "Approved" | "Rejected" | "Returned";
  userId?: string;
}

export class ResourceService {
  private resourceRepo = AppDataSource.getRepository(Resource);
  private resourceTypeRepo = AppDataSource.getRepository(ResourceType);
  private reservationRepo = AppDataSource.getRepository(Reservation);
  private userRepo = AppDataSource.getRepository(User);

  
  async createResource(params: ResourceCreateParams) {
    const type = await this.resourceTypeRepo.findOneBy({
      id: params.typeId,
      isDeleted: false,
    });
    if (!type) {
      logger.warn(`Invalid resource type ID: ${params.typeId}`);
      throw new BadRequestError("Invalid resource type");
    }

    const resource = this.resourceRepo.create({
      name: params.name,
      description: params.description,
      type,
      status: params.status || "Available",
      isDeleted: false,
    });

    await this.resourceRepo.save(resource);
    logger.info(`Resource created: ${resource.id}`);
    return resource;
  }

  async getResources(filters: ResourceFilterParams = {}) {
    const { page = 1, limit = 10, status, typeId } = filters;
    const query: FindManyOptions<Resource> = {
      where: { isDeleted: false },
      relations: ["type"],
      skip: (page - 1) * limit,
      take: limit,
    };

    if (status) query.where = { ...query.where, status };
    if (typeId) query.where = { ...query.where, type: { id: typeId } };

    const [resources, total] = await this.resourceRepo.findAndCount(query);
    logger.info(`Fetched ${resources.length} resources (page ${page}, limit ${limit})`);
    return { resources, total, page, limit };
  }

  async updateResource(resourceId: number, updates: Partial<ResourceCreateParams>) {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId, isDeleted: false },
      relations: ["type"],
    });
    if (!resource) {
      logger.warn(`Resource not found: ${resourceId}`);
      throw new NotFoundError("Resource not found");
    }

    if (updates.typeId) {
      const type = await this.resourceTypeRepo.findOneBy({
        id: updates.typeId,
        isDeleted: false,
      });
      if (!type) throw new BadRequestError("Invalid resource type");
      resource.type = type;
    }

    Object.assign(resource, {
      name: updates.name || resource.name,
      description: updates.description !== undefined ? updates.description : resource.description,
      status: updates.status || resource.status,
    });

    await this.resourceRepo.save(resource);
    logger.info(`Resource updated: ${resourceId}`);
    return resource;
  }

  async deleteResource(resourceId: number) {
    const resource = await this.resourceRepo.findOneBy({
      id: resourceId,
      isDeleted: false,
    });
    if (!resource) {
      logger.warn(`Resource not found: ${resourceId}`);
      throw new NotFoundError("Resource not found");
    }

    resource.isDeleted = true;
    await this.resourceRepo.save(resource);
    logger.info(`Resource soft-deleted: ${resourceId}`);
    return resourceId;
  }

  async createResourceType(type: string) {
    const existingType = await this.resourceTypeRepo.findOneBy({
      type,
      isDeleted: false,
    });
    if (existingType) {
      logger.warn(`Resource type already exists: ${type}`);
      throw new BadRequestError("Resource type already exists");
    }

    const resourceType = this.resourceTypeRepo.create({
      type,
      isDeleted: false,
    });
    await this.resourceTypeRepo.save(resourceType);
    logger.info(`Resource type created: ${resourceType.id}`);
    return resourceType;
  }

  async getResourceTypes() {
    const types = await this.resourceTypeRepo.find({
      where: { isDeleted: false },
    });
    logger.info(`Fetched ${types.length} resource types`);
    return types;
  }

  async getReservations(filters: ReservationFilterParams = {}) {
    const { page = 1, limit = 10, status, userId } = filters;
    const query: FindManyOptions<Reservation> = {
      where: { isDeleted: false },
      relations: ["user", "resource", "approvedBy"],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    };

    if (userId) query.where = { ...query.where, user: { id: userId } };

    const [reservations, total] = await this.reservationRepo.findAndCount(query);
    logger.info(`Fetched ${reservations.length} reservations (page ${page}, limit ${limit})`);
    return { reservations, total, page, limit };
  }

  async updateResourceType(typeId: number, type: string) {
    const resourceType = await this.resourceTypeRepo.findOneBy({
      id: typeId,
      isDeleted: false,
    });
    if (!resourceType) {
      logger.warn(`Resource type not found: ${typeId}`);
      throw new NotFoundError("Resource type not found");
    }

    resourceType.type = type;
    await this.resourceTypeRepo.save(resourceType);
    logger.info(`Resource type updated: ${typeId}`);
    return resourceType;
  }

  async deleteResourceType(typeId: number) {
    const resourceType = await this.resourceTypeRepo.findOneBy({
      id: typeId,
      isDeleted: false,
    });
    if (!resourceType) {
      logger.warn(`Resource type not found: ${typeId}`);
      throw new NotFoundError("Resource type not found");
    }

    const resourcesUsingType = await this.resourceRepo.count({
      where: { type: { id: typeId }, isDeleted: false },
    });
    if (resourcesUsingType > 0) {
      logger.warn(`Cannot delete resource type ${typeId} - in use by ${resourcesUsingType} resources`);
      throw new BadRequestError("Cannot delete resource type in use by resources");
    }

    resourceType.isDeleted = true;
    await this.resourceTypeRepo.save(resourceType);
    logger.info(`Resource type soft-deleted: ${typeId}`);
    return typeId;
  }

  async createReservation(params: ReservationCreateParams) {
    const user = await this.userRepo.findOneBy({
      id: params.userId,
      isDeleted: false,
    });
    if (!user) throw new NotFoundError("User not found");

    const resource = await this.resourceRepo.findOneBy({
      id: params.resourceId,
      isDeleted: false,
    });
    if (!resource) throw new NotFoundError("Resource not found");

    const startTime = new Date(params.startTime);
    const endTime = new Date(params.endTime);
    if (startTime >= endTime) throw new BadRequestError("End time must be after start time");

    const overlappingReservations = await this.reservationRepo.find({
      where: {
        resource: { id: params.resourceId },
        isDeleted: false,
        startTime: LessThanOrEqual(endTime),
        endTime: MoreThanOrEqual(startTime),
      },
    });
    if (overlappingReservations.length > 0) {
      logger.warn(`Reservation conflict for resource ${params.resourceId}`);
      throw new BadRequestError("Resource is already reserved for this time slot");
    }

    const reservation = this.reservationRepo.create({
      user,
      resource,
      startTime,
      endTime,
      purpose: params.purpose,
      isDeleted: false,
    });

    await this.reservationRepo.save(reservation);
    logger.info(`Reservation created: ${reservation.id}`);
    return reservation;
  }

  async updateReservation(reservationId: number, updates: { status: "Approved" | "Rejected" | "Returned" | "Cancelled" }, approvedById?: string) {
    const reservation = await this.reservationRepo.findOne({
      where: { id: reservationId, isDeleted: false },
      relations: ["resource"],
    });
    if (!reservation) {
      logger.warn(`Reservation not found: ${reservationId}`);
      throw new NotFoundError("Reservation not found");
    }

    if (approvedById) {
      const approvedBy = await this.userRepo.findOneBy({
        id: approvedById,
        isDeleted: false,
      });
      if (!approvedBy) throw new NotFoundError("Approver not found");
      reservation.approvedBy = approvedBy;
    }

    if (updates.status === "Approved") {
      reservation.resource.status = "Reserved";
    } else if (updates.status === "Rejected" || updates.status === "Returned" || updates.status === "Cancelled") {
      reservation.resource.status = "Available";
      if (updates.status === "Cancelled") {
        reservation.isDeleted = true;
      }
    }

    await this.resourceRepo.save(reservation.resource);
    await this.reservationRepo.save(reservation);
    logger.info(`Reservation updated: ${reservationId} - Status: ${updates.status}`);
    return reservation;
  }

  async getResourceById(resourceId: number) {
    const resource = await this.resourceRepo.findOne({
      where: { id: resourceId, isDeleted: false },
      relations: ["type"],
    });
    if (!resource) {
      logger.warn(`Resource not found: ${resourceId}`);
      throw new NotFoundError("Resource not found");
    }
    return resource;
  }

  async getReservationById(reservationId: number) {
    const reservation = await this.reservationRepo.findOne({
      where: { id: reservationId, isDeleted: false },
      relations: ["resource", "user"],
    });
    if (!reservation) {
      logger.warn(`Reservation not found: ${reservationId}`);
      throw new NotFoundError("Reservation not found");
    }
    return reservation;
  }

  async getActiveReservation(resourceId: number, userId: string) {
    const reservation = await this.reservationRepo.findOne({
      where: {
        resource: { id: resourceId },
        user: { id: userId },
        isDeleted: false,
      },
      relations: ["resource", "user"],
    });
    return reservation;
  }

  async requestResource(resourceId: number, params: Omit<ReservationCreateParams, "resourceId" | "status">) {
    const resource = await this.getResourceById(resourceId);
    if (resource.status !== "Available") {
      logger.warn(`Resource not available for request: ${resourceId}`);
      throw new BadRequestError("Resource not available");
    }

    const reservation = await this.createReservation({
      ...params,
      resourceId,
      status: "Requested",
    });

    resource.status = "Requested";
    await this.resourceRepo.save(resource);
    logger.info(`Resource requested: ${resourceId} - Reservation: ${reservation.id}`);
    return reservation;
  }

  async returnResource(resourceId: number, userId: string) {
    const reservation = await this.getActiveReservation(resourceId, userId);
    return reservation;
  }
}