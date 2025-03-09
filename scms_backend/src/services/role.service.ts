import { AppDataSource } from "../config/database";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";
import { In } from "typeorm";

export class RoleService {
  private roleRepo = AppDataSource.getRepository(Role);
  private permRepo = AppDataSource.getRepository(Permission);

  async createRole(name: string, description: string | undefined, permissionNames: string[]) {
    const existingRole = await this.roleRepo.findOneBy({ name });
    if (existingRole) {
      logger.warn(`Role creation failed: ${name} already exists`);
      throw new BadRequestError("Role already exists");
    }

    const permissions = await this.permRepo.find({ where: { name: In(permissionNames) } });
    if (permissions.length !== permissionNames.length) {
      logger.warn(`Invalid permissions: ${permissionNames}`);
      throw new BadRequestError("Invalid permission names");
    }

    const newRole = this.roleRepo.create({
      id: require("uuid").v4(),
      name,
      description,
      isDeleted: false,
      permissions, 
    });

    await this.roleRepo.save(newRole);
    logger.info(`Role created: ${newRole.id}`);
    return newRole.id;
  }

  async getRoles() {
    const roles = await this.roleRepo.find({
      where: { isDeleted: false },
      relations: ["permissions"],
    });
    logger.info(`Fetched ${roles.length} roles`);
    return roles;
  }

  async updateRole(roleId: string, name: string, description: string | undefined, permissionNames: string[]) {
    const role = await this.roleRepo.findOne({
      where: { id: roleId, isDeleted: false },
      relations: ["permissions"],
    });
    if (!role) {
      logger.warn(`Role update failed, not found: ${roleId}`);
      throw new NotFoundError("Role not found");
    }

    if (name && name !== role.name) {
      const existingRole = await this.roleRepo.findOneBy({ name });
      if (existingRole && existingRole.id !== roleId) {
        logger.warn(`Role name already in use: ${name}`);
        throw new BadRequestError("Role name already in use");
      }
      role.name = name;
    }
    if (description !== undefined) role.description = description;

    const permissions = await this.permRepo.find({ where: { name: In(permissionNames) } });
    if (permissions.length !== permissionNames.length) {
      logger.warn(`Invalid permissions: ${permissionNames}`);
      throw new BadRequestError("Invalid permission names");
    }
    role.permissions = permissions;

    await this.roleRepo.save(role);
    logger.info(`Role updated: ${roleId}`);
    return role.id;
  }

  async deleteRole(roleId: string) {
    const role = await this.roleRepo.findOneBy({ id: roleId, isDeleted: false });
    if (!role) {
      logger.warn(`Role delete failed, not found: ${roleId}`);
      throw new NotFoundError("Role not found");
    }

    role.isDeleted = true;
    await this.roleRepo.save(role);
    logger.info(`Role soft-deleted: ${roleId}`);
    return roleId;
  }
}