import { Router } from "express";
import {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware(["create:users"]), createUser);
router.get("/:id", authMiddleware(["read:users"]), getUser);
router.get("/", authMiddleware(["read:users"]), getAllUsers);
router.put("/:id", authMiddleware(["update:users"]), updateUser);
router.delete("/:id", authMiddleware(["delete:users"]), deleteUser);

export default router;
