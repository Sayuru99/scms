import { AppDataSource } from "../config/database";
import { Permission } from "../entities/Permission";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";

export class PermissionService {
  private permRepo = AppDataSource.getRepository(Permission);

  async createPermission(name: string, category: string, scope: string | undefined, description: string) {
    const existingPermission = await this.permRepo.findOneBy({ name });
    if (existingPermission) {
      logger.warn(`Permission creation failed: ${name} already exists`);
      throw new BadRequestError("Permission already exists");
    }

    const newPermission = this.permRepo.create({
      id: require("uuid").v4(),
      name,
      category,
      scope,
      description,
      isActive: true,
      isDeleted: false,
    });

    await this.permRepo.save(newPermission);
    logger.info(`Permission created: ${newPermission.id}`);
    return newPermission.id;
  }

  async getPermissions() {
    const permissions = await this.permRepo.find({ where: { isDeleted: false } });
    logger.info(`Fetched ${permissions.length} permissions`);
    return permissions;
  }

  async updatePermission(permissionId: string, name: string, category: string, scope: string | undefined, description: string) {
    const permission = await this.permRepo.findOneBy({ id: permissionId, isDeleted: false });
    if (!permission) {
      logger.warn(`Permission update failed, not found: ${permissionId}`);
      throw new NotFoundError("Permission not found");
    }

    if (name && name !== permission.name) {
      const existingPermission = await this.permRepo.findOneBy({ name });
      if (existingPermission && existingPermission.id !== permissionId) {
        logger.warn(`Permission name already in use: ${name}`);
        throw new BadRequestError("Permission name already in use");
      }
      permission.name = name;
    }
    permission.category = category;
    permission.scope = scope;
    permission.description = description;

    await this.permRepo.save(permission);
    logger.info(`Permission updated: ${permissionId}`);
    return permission.id;
  }

  async deletePermission(permissionId: string) {
    const permission = await this.permRepo.findOneBy({ id: permissionId, isDeleted: false });
    if (!permission) {
      logger.warn(`Permission delete failed, not found: ${permissionId}`);
      throw new NotFoundError("Permission not found");
    }

    permission.isDeleted = true;
    await this.permRepo.save(permission);
    logger.info(`Permission soft-deleted: ${permissionId}`);
    return permissionId;
  }
}