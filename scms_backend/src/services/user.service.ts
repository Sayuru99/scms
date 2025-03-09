import { User } from "../entities/User";
import { AppDataSource } from "../config/database";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission"; 
import { In } from "typeorm"; 

interface UserUpdateParams {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roleName?: string;
  directPermissionNames?: string[];
}

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);
  private permRepo = AppDataSource.getRepository(Permission); 

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string | undefined,
    roleName: string,
    directPermissionNames: string[] | undefined
  ) {
    const existingUser = await this.userRepo.findOneBy({ email });
    if (existingUser) {
      logger.warn(`User creation failed: ${email} already exists`);
      throw new BadRequestError("User already exists");
    }

    const role = await this.roleRepo.findOneBy({ name: roleName });
    if (!role) {
      logger.warn(`Invalid role name: ${roleName}`);
      throw new BadRequestError("Invalid role name");
    }

    let directPermissions: Permission[] = [];
    if (directPermissionNames && directPermissionNames.length > 0) {
      directPermissions = await this.permRepo.find({
        where: { name: In(directPermissionNames) }, 
      });
      if (directPermissions.length !== directPermissionNames.length) {
        logger.warn(`Invalid permissions: ${directPermissionNames}`);
        throw new BadRequestError("Invalid permission names");
      }
    }

    const passwordHash = await hash(password, 10);
    const newUser = this.userRepo.create({
      id: uuidv4(),
      email,
      password: passwordHash,
      firstName,
      lastName,
      phoneNumber,
      isActive: true,
      isFirstLogin: true,
      isDeleted: false,
      role,
      directPermissions:
        directPermissions.map((p) => p.name).join(",") || undefined,
    });

    await this.userRepo.save(newUser);
    logger.info(`User created: ${newUser.id}`);
    return newUser.id;
  }

  async getUsers() {
    const users = await this.userRepo.find({
      where: { isDeleted: false },
      relations: ["role"],
    });
    logger.info(`Fetched ${users.length} users`);
    return users;
  }

  async updateUser(userId: string, updates: UserUpdateParams) {
    const user = await this.userRepo.findOne({
      where: { id: userId, isDeleted: false },
      relations: ["role"],
    });
    if (!user) {
      logger.warn(`User update failed, not found: ${userId}`);
      throw new NotFoundError("User not found");
    }

    if (updates.email) {
      const existingUser = await this.userRepo.findOneBy({
        email: updates.email,
      });
      if (existingUser && existingUser.id !== userId) {
        logger.warn(`Email already in use: ${updates.email}`);
        throw new BadRequestError("Email already in use");
      }
      user.email = updates.email;
    }

    if (updates.firstName) user.firstName = updates.firstName;
    if (updates.lastName) user.lastName = updates.lastName;
    if (updates.phoneNumber !== undefined)
      user.phoneNumber = updates.phoneNumber;

    if (updates.roleName) {
      const role = await this.roleRepo.findOneBy({ name: updates.roleName });
      if (!role) {
        logger.warn(`Invalid role name: ${updates.roleName}`);
        throw new BadRequestError("Invalid role name");
      }
      user.role = role;
    }

    if (
      updates.directPermissionNames &&
      updates.directPermissionNames.length > 0
    ) {
      const directPermissions = await this.permRepo.find({
        where: { name: In(updates.directPermissionNames) }, 
      });
      if (directPermissions.length !== updates.directPermissionNames.length) {
        logger.warn(`Invalid permissions: ${updates.directPermissionNames}`);
        throw new BadRequestError("Invalid permission names");
      }
      user.directPermissions = directPermissions.map((p) => p.name).join(",");
    }

    await this.userRepo.save(user);
    logger.info(`User updated: ${userId}`);
    return user.id;
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOneBy({
      id: userId,
      isDeleted: false,
    });
    if (!user) {
      logger.warn(`User delete failed, not found: ${userId}`);
      throw new NotFoundError("User not found");
    }

    user.isDeleted = true;
    await this.userRepo.save(user);
    logger.info(`User soft-deleted: ${userId}`);
    return userId;
  }
}
