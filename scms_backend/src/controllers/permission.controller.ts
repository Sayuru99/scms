import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { PermissionService } from "../services/permission.service";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../dtos/permission.dto";
import logger from "../config/logger";

export class PermissionController {
  private permissionService = new PermissionService();

  async createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreatePermissionDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        logger.warn(
          `Validation failed for permission creation: ${JSON.stringify(errors)}`
        );
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const permissionId = await this.permissionService.createPermission(
        dto.name,
        dto.category,
        dto.scope,
        dto.description
      );
      res
        .status(201)
        .json({ message: "Permission created successfully", permissionId });
    } catch (error) {
      next(error);
    }
  }

  async getPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await this.permissionService.getPermissions();
      res.json(permissions);
    } catch (error) {
      next(error);
    }
  }

  async updatePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new UpdatePermissionDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        logger.warn(
          `Validation failed for permission update ${
            req.params.permissionId
          }: ${JSON.stringify(errors)}`
        );
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const permissionId = await this.permissionService.updatePermission(
        req.params.permissionId,
        dto.name,
        dto.category,
        dto.scope,
        dto.description
      );
      res.json({ message: "Permission updated successfully", permissionId });
    } catch (error) {
      next(error);
    }
  }

  async deletePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const permissionId = await this.permissionService.deletePermission(
        req.params.permissionId
      );
      res.json({ message: "Permission deleted successfully", permissionId });
    } catch (error) {
      next(error);
    }
  }
}
