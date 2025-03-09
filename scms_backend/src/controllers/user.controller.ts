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
}
