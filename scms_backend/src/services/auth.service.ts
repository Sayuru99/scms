import { User } from "../entities/User";
import { AppDataSource } from "../config/database";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import logger from "../config/logger";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private readonly MAX_REFRESH_TOKENS = 5;

  constructor() {
    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      logger.error("JWT_SECRET or REFRESH_TOKEN_SECRET not set");
      throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET not set");
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email, isDeleted: false },
      relations: ["role"],
    });

    if (!user || !(await compare(password, user.password))) {
      logger.warn(`Login failed for email: ${email}`);
      throw new UnauthorizedError("Invalid credentials");
    }

    const permissions = await this.getUserPermissions(user);
    logger.info(
      `Permissions for user ${user.id}: ${JSON.stringify(permissions)}`
    );

    const accessToken = this.generateAccessToken(user, permissions);
    const refreshToken = this.generateRefreshToken(user);

    this.updateRefreshTokens(user, refreshToken);
    user.lastActivity = new Date();
    await this.userRepository.save(user);

    logger.info(`User logged in: ${user.id}`);
    return {
      accessToken,
      refreshToken,
      isFirstLogin: user.isFirstLogin,
    };
  }

  async refreshToken(token: string) {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
      userId: string;
    };
    const user = await this.userRepository.findOne({
      where: { id: decoded.userId, isDeleted: false },
      relations: ["role"],
    });

    if (!user || !user.refreshTokens?.includes(token)) {
      logger.warn(`Invalid refresh token attempt for user: ${decoded.userId}`);
      throw new UnauthorizedError("Invalid refresh token");
    }

    const permissions = await this.getUserPermissions(user);
    const accessToken = this.generateAccessToken(user, permissions);
    const newRefreshToken = this.generateRefreshToken(user);

    this.updateRefreshTokens(user, newRefreshToken, token);
    await this.userRepository.save(user);

    logger.info(`Token refreshed for user: ${user.id}`);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string, token?: string) {
    const user = await this.userRepository.findOneBy({
      id: userId,
      isDeleted: false,
    });
    if (!user) {
      logger.warn(`Logout failed, user not found: ${userId}`);
      throw new UnauthorizedError("User not found");
    }

    if (token && user.refreshTokens?.includes(token)) {
      user.refreshTokens = user.refreshTokens
        .split(",")
        .filter((t) => t !== token)
        .join(",");
    } else {
      user.refreshTokens = "";
    }
    user.lastActivity = new Date();
    await this.userRepository.save(user);
    logger.info(`User logged out: ${userId}`);
  }

  private async getUserPermissions(user: User): Promise<string[]> {
    const rolePermissionsResult = user.role
      ? await AppDataSource.query(
          `SELECT p.name FROM roles_permissions rp
           JOIN permissions p ON p.id = rp.permissionsId
           WHERE rp.rolesId = ?`,
          [user.role.id]
        )
      : [];
    const rolePermissions = rolePermissionsResult.map((row: any) => row.name);

    const directPermissions = user.directPermissions
      ? user.directPermissions.split(",")
      : [];

    return [...new Set([...rolePermissions, ...directPermissions])];
  }

  private generateAccessToken(user: User, permissions: string[]) {
    return jwt.sign(
      { userId: user.id, role: user.role?.name || null, permissions },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
  }

  private generateRefreshToken(user: User) {
    return jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });
  }

  private updateRefreshTokens(user: User, newToken: string, oldToken?: string) {
    let tokens = user.refreshTokens ? user.refreshTokens.split(",") : [];
    if (oldToken) {
      tokens = tokens.filter((t) => t !== oldToken);
    }
    tokens.push(newToken);
    if (tokens.length > this.MAX_REFRESH_TOKENS) {
      tokens = tokens.slice(-this.MAX_REFRESH_TOKENS);
    }
    user.refreshTokens = tokens.join(",");
  }
}
