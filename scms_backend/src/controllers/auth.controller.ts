import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { validateOrReject } from "class-validator";
import { LoginDto } from "../dtos/auth.dto";

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginDto = new LoginDto();
      Object.assign(loginDto, req.body);
      await validateOrReject(loginDto);

      const result = await this.authService.login(
        loginDto.email,
        loginDto.password
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}