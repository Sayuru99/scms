import { User } from "../entities/User";
import { AppDataSource } from "../config/database";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ["roles", "roles.permissions", "directPermissions"],
    });

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    user.refreshTokens = [...(user.refreshTokens || []), refreshToken];
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      isFirstLogin: user.isFirstLogin,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!
      ) as any;
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
        relations: ["roles", "roles.permissions", "directPermissions"],
      });

      if (!user || !(user.refreshTokens ?? []).includes(token)) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      const accessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      user.refreshTokens = (user.refreshTokens ?? []).filter(
        (t) => t !== token
      );
      user.refreshTokens.push(newRefreshToken);
      await this.userRepository.save(user);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }

  private generateAccessToken(user: User) {
    return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
  }

  private generateRefreshToken(user: User) {
    return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });
  }
}
