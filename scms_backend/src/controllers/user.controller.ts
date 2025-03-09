import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDto } from "../dtos/user.dto";
import { validateOrReject } from "class-validator";

export class UserController {
  private userService = new UserService();

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, req.body);
      await validateOrReject(createUserDto);

      const userId = await this.userService.createUser(
        createUserDto.email,
        createUserDto.password,
        createUserDto.firstName,
        createUserDto.lastName,
        createUserDto.phoneNumber,
        createUserDto.roleName,
        createUserDto.directPermissionNames
      );

      res.status(201).json({ message: "User created", userId });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async updateSelf(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updates = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
      };

      if (!updates.email || !updates.firstName || !updates.lastName) {
        return res
          .status(400)
          .json({ message: "Email, first name, and last name are required" });
      }

      const updatedUserId = await this.userService.updateSelf(userId, updates);
      res.json({
        message: "Profile updated successfully",
        userId: updatedUserId,
      });
    } catch (error) {
      next(error);
    }
  }
}
