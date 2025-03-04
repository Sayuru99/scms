import { Router } from "express";
import {
  register,
  login,
  authorize,
  token,
  refresh,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/authorize", authorize);
router.post("/token", token);
router.post("/refresh", refresh);

export default router;
