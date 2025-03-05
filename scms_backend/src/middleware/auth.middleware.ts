import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../config/database";
import { UnauthorizedError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: User;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await AppDataSource.getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles", "roles")
      .leftJoinAndSelect("roles.permissions", "rolePermissions")
      .leftJoinAndSelect("user.directPermissions", "directPermissions")
      .where("user.id = :id", { id: decoded.userId })
      .getOne();

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const checkPermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError("User not authenticated");
      }

      const hasPermission = user.roles.some(role =>
        role.permissions.some(permission => permission.name === requiredPermission)
      ) || user.directPermissions.some(permission => permission.name === requiredPermission);

      if (!hasPermission) {
        throw new UnauthorizedError("Permission denied");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};