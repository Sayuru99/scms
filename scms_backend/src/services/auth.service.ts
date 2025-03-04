import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { AppDataSource } from "../config/db.config";
import { User } from "../entities/User";
import { Student } from "../entities/Student";
import { Lecturer } from "../entities/Lecturer";
import { Staff } from "../entities/Staff";
import { Client } from "../entities/Client";
import { AuthorizationCode } from "../entities/AuthorizationCode";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission"; // Import Permission for typing
import { generateAccessToken } from "../utils/jwtUtils";
import {
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/refreshTokenUtils";

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private studentRepo = AppDataSource.getRepository(Student);
  private lecturerRepo = AppDataSource.getRepository(Lecturer);
  private staffRepo = AppDataSource.getRepository(Staff);
  private clientRepo = AppDataSource.getRepository(Client);
  private authCodeRepo = AppDataSource.getRepository(AuthorizationCode);
  private roleRepo = AppDataSource.getRepository(Role);

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    universityId: string
  ): Promise<User> {
    let roleName: string;

    if (universityId.startsWith("00")) {
      roleName = "student";
      const studentExists = await this.studentRepo.findOne({
        where: { prefixedStudentId: universityId },
      });
      if (!studentExists)
        throw new Error(
          "University ID not recognized as a student. Please contact admin."
        );
    } else if (universityId.startsWith("01")) {
      roleName = "lecturer";
      const lecturerExists = await this.lecturerRepo.findOne({
        where: { prefixedLecturerId: universityId },
      });
      if (!lecturerExists)
        throw new Error(
          "University ID not recognized as a lecturer. Please contact admin."
        );
    } else if (universityId.startsWith("02")) {
      roleName = "staff";
      const staffExists = await this.staffRepo.findOne({
        where: { prefixedStaffId: universityId },
      });
      if (!staffExists)
        throw new Error(
          "University ID not recognized as staff. Please contact admin."
        );
    } else {
      throw new Error("Invalid university ID prefix");
    }

    const existingUser = await this.userRepo.findOne({
      where: { universityId },
    });
    if (existingUser) throw new Error("University ID already registered");

    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) throw new Error(`Role ${roleName} not found`);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      universityId,
      role,
    });
    await this.userRepo.save(user);
    return user;
  }

  async login(
    email: string,
    password: string,
    ip: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: [
        "role",
        "role.rolePermissions",
        "role.rolePermissions.permission",
      ],
      select: ["id", "email", "password", "refreshToken"],
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new Error("Invalid credentials");

    const scopes = user.role.rolePermissions.map((rp) => rp.permission.name);
    const accessToken = generateAccessToken(user, scopes);
    const refreshToken = generateRefreshToken(user, ip, scopes);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.lastLoginIp = ip;
    await this.userRepo.save(user);

    return { accessToken, refreshToken };
  }

  async authorize(
    clientId: string,
    redirectUri: string,
    scope: string,
    state: string,
    email: string,
    password: string,
    ip: string
  ): Promise<{ code: string; state: string }> {
    const client = await this.clientRepo.findOne({ where: { clientId } });
    if (!client || client.redirectUri !== redirectUri)
      throw new Error("Invalid client or redirect URI");

    const user = await this.userRepo.findOne({
      where: { email },
      relations: [
        "role",
        "role.rolePermissions",
        "role.rolePermissions.permission",
      ],
      select: ["id", "email", "password", "role"],
    });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new Error("Invalid credentials");

    const role = await this.roleRepo.findOne({
      where: { name: user.role.name },
      relations: ["rolePermissions", "rolePermissions.permission"],
    });
    const availableScopes =
      role?.rolePermissions.map((rp) => rp.permission.name) || [];
    const requestedScopes = scope
      .split(" ")
      .filter((s) => availableScopes.includes(s));
    if (requestedScopes.length === 0)
      throw new Error("No valid scopes requested");

    const code = randomBytes(16).toString("hex");
    const authCode = this.authCodeRepo.create({
      code,
      user,
      client,
      scopes: requestedScopes,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    await this.authCodeRepo.save(authCode);

    return { code, state };
  }

  async exchangeCode(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    ip: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const authCode = await this.authCodeRepo.findOne({
      where: { code },
      relations: [
        "user",
        "user.role",
        "user.role.rolePermissions",
        "user.role.rolePermissions.permission",
        "client",
      ],
    });
    if (!authCode || authCode.expiresAt < new Date())
      throw new Error("Invalid or expired authorization code");

    const client = authCode.client;
    if (
      client.clientId !== clientId ||
      client.clientSecret !== clientSecret ||
      client.redirectUri !== redirectUri
    ) {
      throw new Error("Client credentials or redirect URI invalid");
    }

    const user = authCode.user;
    const scopes = authCode.scopes;

    const accessToken = generateAccessToken(user, scopes);
    const refreshToken = generateRefreshToken(user, ip, scopes);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.lastLoginIp = ip;
    await this.userRepo.save(user);

    await this.authCodeRepo.delete(authCode.id);
    return { accessToken, refreshToken };
  }

  async refreshToken(
    oldRefreshToken: string,
    ip: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findOne({
      where: { refreshToken: oldRefreshToken },
      relations: [
        "role",
        "role.rolePermissions",
        "role.rolePermissions.permission",
      ],
      select: ["id", "lastLoginIp", "refreshToken"],
    });
    if (!user) throw new Error("Invalid refresh token");
    if (user.lastLoginIp !== ip)
      throw new Error("IP address mismatch with last login IP");

    const decoded = verifyRefreshToken(oldRefreshToken, ip);
    const scopes = user.role.rolePermissions.map((rp) => rp.permission.name);

    const accessToken = generateAccessToken(user, scopes);
    const newRefreshToken = generateRefreshToken(user, ip, scopes);

    user.refreshToken = newRefreshToken;
    await this.userRepo.save(user);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    user.refreshToken = undefined;
    user.lastLoginIp = undefined;
    await this.userRepo.save(user);
  }

  async validateScopes(
    userId: string,
    requiredScopes: string[]
  ): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: [
        "role",
        "role.rolePermissions",
        "role.rolePermissions.permission",
      ],
    });
    if (!user) return false;

    const role = await this.roleRepo.findOne({
      where: { name: user.role.name },
      relations: ["rolePermissions", "rolePermissions.permission"],
    });
    const userScopes =
      role?.rolePermissions.map((rp) => rp.permission.name) || [];
    return requiredScopes.every((scope) => userScopes.includes(scope));
  }
}
