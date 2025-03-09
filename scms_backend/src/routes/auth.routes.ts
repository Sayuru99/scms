import { Router } from "express";
import { validate } from "class-validator";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/auth.dto";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const authService = new AuthService();

router.post("/login", async (req, res, next) => {
  try {
    const dto = Object.assign(new LoginDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
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
