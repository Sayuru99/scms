import { Router } from "express";
import { validate } from "class-validator";
import { UserService } from "../services/user.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import logger from "../config/logger";

const router = Router();
const userService = new UserService();

router.post("/", authMiddleware("create:users"), async (req, res, next) => {
  try {
    const dto = Object.assign(new CreateUserDto(), req.body);
    const errors = await validate(dto);
    if (errors.length > 0) {
      logger.warn(
        `Validation failed for user creation: ${JSON.stringify(errors)}`
      );
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const userId = await userService.createUser(
      dto.email,
      dto.password,
      dto.firstName,
      dto.lastName,
      dto.phoneNumber,
      dto.roleName,
      dto.directPermissionNames
    );
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    next(error);
  }
});

router.get("/", authMiddleware("read:users"), async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:userId",
  authMiddleware("update:users"),
  async (req, res, next) => {
    try {
      const dto = Object.assign(new UpdateUserDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        logger.warn(
          `Validation failed for user update ${
            req.params.userId
          }: ${JSON.stringify(errors)}`
        );
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const userId = await userService.updateUser(req.params.userId, {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber,
        roleName: dto.roleName,
        directPermissionNames: dto.directPermissionNames,
      });
      res.json({ message: "User updated successfully", userId });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:userId",
  authMiddleware("delete:users"),
  async (req, res, next) => {
    try {
      const userId = await userService.deleteUser(req.params.userId);
      res.json({ message: "User deleted successfully", userId });
    } catch (error) {
      next(error);
    }
  }
);

router.put("/me", authMiddleware(), async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const updates = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
    };

    const updatedUserId = await userService.updateSelf(userId, updates);
    res.json({
      message: "Profile updated successfully",
      userId: updatedUserId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
