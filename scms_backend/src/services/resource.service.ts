import { AppDataSource } from "../config/db.config";
import { Resource } from "../entities/Resource";
import { User } from "../entities/User";

export class ResourceService {
  private resourceRepo = AppDataSource.getRepository(Resource);
  private userRepo = AppDataSource.getRepository(User);

  async createResource(
    name: string,
    description: string,
    type: string,
    createdById: string
  ): Promise<Resource> {
    const createdBy = await this.userRepo.findOne({
      where: { id: createdById },
    });
    if (!createdBy) throw new Error("User not found");

    const resource = this.resourceRepo.create({
      name,
      description,
      type,
      createdBy,
    });
    return await this.resourceRepo.save(resource);
  }

  async getResource(id: string): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
      relations: ["createdBy"],
    });
    if (!resource) throw new Error("Resource not found");
    return resource;
  }

  async updateResource(
    id: string,
    name?: string,
    description?: string,
    type?: string,
    isAvailable?: boolean
  ): Promise<Resource> {
    const resource = await this.getResource(id);
    if (name) resource.name = name;
    if (description) resource.description = description;
    if (type) resource.type = type;
    if (isAvailable !== undefined) resource.isAvailable = isAvailable;
    return await this.resourceRepo.save(resource);
  }

  async deleteResource(id: string): Promise<void> {
    const resource = await this.getResource(id);
    await this.resourceRepo.remove(resource);
  }
}
