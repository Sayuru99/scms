import { Router } from "express";
import { LecturerController } from "../controllers/lecturer.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const lecturerController = new LecturerController();

router.get("/:id/modules", authMiddleware("read:modules"), lecturerController.getAssignedModules);

export default router; 