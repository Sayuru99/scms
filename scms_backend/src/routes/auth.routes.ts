import { Router } from "express";
import { validate } from "class-validator";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/auth.dto";
import { authMiddleware } from "../middleware/auth.middleware";
import logger from "../config/logger";

const router = Router();
const authService = new AuthService();

router.post("/login", async (req, res, next) => {
  try {
    logger.info("Raw request body:", req.body);

    if (!req.body.email || !req.body.password) {
      logger.warn("Missing email or password in request body");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const dto = new LoginDto();
    dto.email = req.body.email as string;
    dto.password = req.body.password as string;

    logger.info("DTO before validation:", dto);

    const errors = await validate(dto);
    if (errors.length > 0) {
      logger.warn("Validation failed:", errors);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const result = await authService.login(dto.email, dto.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }
    const result = await authService.refreshToken(refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authMiddleware(), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const { refreshToken } = req.body;
    await authService.logout(userId, refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
