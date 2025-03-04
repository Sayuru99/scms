import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const authMiddleware = (requiredScopes: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = verifyAccessToken(token) as {
        id: string;
        role: string;
        scopes: string[];
      };
      (req as any).user = decoded;

      if (requiredScopes.length > 0) {
        const hasScopes = await authService.validateScopes(
          decoded.id,
          requiredScopes
        );
        if (!hasScopes)
          return res.status(403).json({ message: "Insufficient scopes" });
      }

      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
