import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger";

interface JwtPayload {
  userId: string;
  role: string | null;
  permissions: string[];
}

export const authMiddleware = (requiredPermission?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      logger.warn("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;

      if (
        requiredPermission &&
        (!decoded.permissions || !decoded.permissions.includes(requiredPermission))
      ) {
        logger.warn(`Insufficient permissions for user ${decoded.userId}: ${requiredPermission}`);
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      logger.debug(`Authenticated user: ${decoded.userId}`);
      next();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Invalid token: ${errorMessage}`);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}