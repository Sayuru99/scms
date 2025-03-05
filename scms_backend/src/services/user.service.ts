import { AppDataSource } from "../config/db.config";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import * as bcrypt from "bcrypt";

export class UserService {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    universityId: string,
    roleId: string
  ): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { universityId },
    });
    if (existingUser) throw new Error("University ID already registered");

    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new Error("Role not found");

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      universityId,
      role,
    });
    return await this.userRepo.save(user);
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["role", "role.permissions"],
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.find({
      relations: ["role", "role.permissions"],
    });
  }

  async updateUser(
    id: string,
    email?: string,
    firstName?: string,
    lastName?: string,
    roleId?: string,
    password?: string
  ): Promise<User> {
    const user = await this.getUser(id);
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (roleId) {
      const role = await this.roleRepo.findOne({ where: { id: roleId } });
      if (!role) throw new Error("Role not found");
      user.role = role;
    }
    if (password) user.password = await bcrypt.hash(password, 12);
    return await this.userRepo.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.getUser(id);
    await this.userRepo.remove(user);
  }
}
