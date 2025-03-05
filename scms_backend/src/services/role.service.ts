import { AppDataSource } from "../config/db.config";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";
import { RolePermission } from "../entities/RolePermission";
import { In } from "typeorm";

export class RoleService {
  private roleRepo = AppDataSource.getRepository(Role);
  private permissionRepo = AppDataSource.getRepository(Permission);
  private rolePermissionRepo = AppDataSource.getRepository(RolePermission);

  async createRole(
    name: string,
    description?: string,
    permissionIds: string[] = []
  ): Promise<Role> {
    const existingRole = await this.roleRepo.findOne({ where: { name } });
    if (existingRole) throw new Error("Role already exists");

    const role = this.roleRepo.create({ name, description });
    await this.roleRepo.save(role);

    if (permissionIds.length > 0) {
      const permissions = await this.permissionRepo.find({
        where: { id: In(permissionIds) },
      });
      const rolePermissions = permissions.map((permission) =>
        this.rolePermissionRepo.create({ role, permission })
      );
      await this.rolePermissionRepo.save(rolePermissions);
    }

    return this.getRole(role.id);
  }

  async getRole(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ["rolePermissions", "rolePermissions.permission"],
    });
    if (!role) throw new Error("Role not found");
    return role;
  }

  async getRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { name },
      relations: ["rolePermissions", "rolePermissions.permission"],
    });
    if (!role) throw new Error("Role not found");
    return role;
  }

  async updateRole(
    id: string,
    name?: string,
    description?: string,
    permissionIds?: string[]
  ): Promise<Role> {
    const role = await this.getRole(id);
    if (name) role.name = name;
    if (description) role.description = description;
    if (permissionIds !== undefined) {
      await this.rolePermissionRepo.delete({ role: { id } });

      const permissions = await this.permissionRepo.find({
        where: { id: In(permissionIds) },
      });
      const rolePermissions = permissions.map((permission) =>
        this.rolePermissionRepo.create({ role, permission })
      );
      await this.rolePermissionRepo.save(rolePermissions);
    }
    return await this.roleRepo.save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.getRole(id);
    await this.rolePermissionRepo.delete({ role: { id } });
    await this.roleRepo.remove(role);
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    const role = await this.getRole(roleId);
    const permissions = await this.permissionRepo.find({
      where: { id: In(permissionIds) },
    });
    const rolePermissions = permissions.map((permission) =>
      this.rolePermissionRepo.create({ role, permission })
    );
    await this.rolePermissionRepo.save(rolePermissions);
    return this.getRole(roleId);
  }
}
