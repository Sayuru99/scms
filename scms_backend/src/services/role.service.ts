import { AppDataSource } from "../config/db.config";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";

export class RoleService {
  private roleRepo = AppDataSource.getRepository(Role);
  private permissionRepo = AppDataSource.getRepository(Permission);

  async createRole(
    name: string,
    description?: string,
    permissionIds: string[] = []
  ): Promise<Role> {
    const existingRole = await this.roleRepo.findOne({ where: { name } });
    if (existingRole) throw new Error("Role already exists");

    const permissions = await this.permissionRepo.findByIds(permissionIds);
    const role = this.roleRepo.create({ name, description, permissions });
    return await this.roleRepo.save(role);
  }

  async getRole(id: string): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ["permissions"],
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
    if (permissionIds) {
      role.permissions = await this.permissionRepo.findByIds(permissionIds);
    }
    return await this.roleRepo.save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.getRole(id);
    await this.roleRepo.remove(role);
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<Role> {
    const role = await this.getRole(roleId);
    const permissions = await this.permissionRepo.findByIds(permissionIds);
    role.permissions = [...role.permissions, ...permissions];
    return await this.roleRepo.save(role);
  }
}
