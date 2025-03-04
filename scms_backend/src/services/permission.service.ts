import { AppDataSource } from "../config/db.config";
import { Permission } from "../entities/Permission";

export class PermissionService {
  private permissionRepo = AppDataSource.getRepository(Permission);

  async createPermission(
    name: string,
    category: string,
    description?: string
  ): Promise<Permission> {
    const existingPermission = await this.permissionRepo.findOne({
      where: { name },
    });
    if (existingPermission) throw new Error("Permission already exists");

    const permission = this.permissionRepo.create({
      name,
      category,
      description,
    });
    return await this.permissionRepo.save(permission);
  }

  async getPermission(id: string): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) throw new Error("Permission not found");
    return permission;
  }

  async getPermissionByName(name: string): Promise<Permission | null> {
    return await this.permissionRepo.findOne({ where: { name } });
  }

  async updatePermission(
    id: string,
    name?: string,
    category?: string,
    description?: string
  ): Promise<Permission> {
    const permission = await this.getPermission(id);
    if (name) permission.name = name;
    if (category) permission.category = category;
    if (description) permission.description = description;
    return await this.permissionRepo.save(permission);
  }

  async deletePermission(id: string): Promise<void> {
    const permission = await this.getPermission(id);
    await this.permissionRepo.remove(permission);
  }
}
