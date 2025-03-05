import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwtUtils";
import { AuthService } from "../services/auth.service";
import { RequestHandler } from "express"; // Import for explicit typing

const authService = new AuthService();

export const authMiddleware = (
  requiredScopes: string[] = []
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return; // Explicitly end the cycle, no return value
    }

    try {
      const decoded = verifyAccessToken(token) as {
        id: string;
        scopes: string[];
      };
      (req as any).user = decoded;

      if (requiredScopes.length > 0) {
        const hasScopes = await authService.validateScopes(
          decoded.id,
          requiredScopes
        );
        if (!hasScopes) {
          res.status(403).json({ message: "Insufficient scopes" });
          return; // End cycle
        }
      }

      next(); // Proceed to next middleware/handler
    } catch (error) {
      res.status(403).json({ message: "Invalid or expired token" });
      return; // End cycle
    }
  };
};
