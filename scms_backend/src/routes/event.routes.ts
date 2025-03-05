import { Router } from "express";
import {
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware(["create:events"]), createEvent);
router.get("/:id", authMiddleware(["read:events"]), getEvent);
router.put("/:id", authMiddleware(["update:events"]), updateEvent);
router.delete("/:id", authMiddleware(["delete:events"]), deleteEvent);

export default router;
