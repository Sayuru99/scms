import { Router } from "express";
import {
  createResource,
  getResource,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware(["create:resources"]), createResource);
router.get("/:id", authMiddleware(["read:resources"]), getResource);
router.put("/:id", authMiddleware(["update:resources"]), updateResource);
router.delete("/:id", authMiddleware(["delete:resources"]), deleteResource);

export default router;
