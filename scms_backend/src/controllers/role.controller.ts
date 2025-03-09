import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { RoleService } from "../services/role.service";
import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.dto";
import logger from "../config/logger";

export class RoleController {
  private roleService = new RoleService();

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreateRoleDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        logger.warn(
          `Validation failed for role creation: ${JSON.stringify(errors)}`
        );
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const roleId = await this.roleService.createRole(
        dto.name,
        dto.description,
        dto.permissionNames
      );
      res.status(201).json({ message: "Role created successfully", roleId });
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await this.roleService.getRoles();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new UpdateRoleDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        logger.warn(
          `Validation failed for role update ${
            req.params.roleId
          }: ${JSON.stringify(errors)}`
        );
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const roleId = await this.roleService.updateRole(
        req.params.roleId,
        dto.name,
        dto.description,
        dto.permissionNames
      );
      res.json({ message: "Role updated successfully", roleId });
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = await this.roleService.deleteRole(req.params.roleId);
      res.json({ message: "Role deleted successfully", roleId });
    } catch (error) {
      next(error);
    }
  }
}
