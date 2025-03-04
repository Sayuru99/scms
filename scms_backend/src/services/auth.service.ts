import * as bcrypt from "bcrypt";
import { AppDataSource } from "../config/db.config";
import { User, UserRole } from "../entities/User";
import { Student } from "../entities/Student";
import { Lecturer } from "../entities/Lecturer";
import { Staff } from "../entities/Staff";
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

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    universityId: string
  ): Promise<User> {
    let role: UserRole;

    if (universityId.startsWith("00")) {
      role = UserRole.STUDENT;

      const studentExists = await this.studentRepo.findOne({
        where: { prefixedStudentId: universityId },
      });
      if (!studentExists) {
        throw new Error(
          "University ID not recognized as a student. Please contact admin."
        );
      }
    } else if (universityId.startsWith("01")) {
      role = UserRole.LECTURER;

      const lecturerExists = await this.lecturerRepo.findOne({
        where: { prefixedLecturerId: universityId },
      });
      if (!lecturerExists) {
        throw new Error(
          "University ID not recognized as a lecturer. Please contact admin."
        );
      }
    } else if (universityId.startsWith("02")) {
      role = UserRole.STAFF;

      const staffExists = await this.staffRepo.findOne({
        where: { prefixedStaffId: universityId },
      });
      if (!staffExists) {
        throw new Error(
          "University ID not recognized as staff. Please contact admin."
        );
      }
    } else {
      throw new Error("Invalid university ID prefix");
    }

    const existingUser = await this.userRepo.findOne({
      where: { universityId },
    });
    if (existingUser) {
      throw new Error("University ID already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      select: ["id", "email", "password", "role", "refreshToken"],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, ip);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    user.lastLoginIp = ip;
    await this.userRepo.save(user);

    return { accessToken, refreshToken };
  }

  async refreshToken(
    refreshToken: string,
    ip: string
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({
      where: { refreshToken },
      select: ["id", "role", "lastLoginIp", "refreshToken"],
    });

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    if (user.lastLoginIp !== ip) {
      throw new Error("IP address mismatch with last login IP");
    }

    verifyRefreshToken(refreshToken, ip);

    const accessToken = generateAccessToken(user);
    return { accessToken };
  }
}
