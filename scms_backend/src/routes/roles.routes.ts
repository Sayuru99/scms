import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const roleController = new RoleController();

router.post(
  "/",
  authMiddleware("create:roles"),
  roleController.createRole.bind(roleController)
);
router.get(
  "/",
  authMiddleware("read:roles"),
  roleController.getRoles.bind(roleController)
);
router.put(
  "/:roleId",
  authMiddleware("update:roles"),
  roleController.updateRole.bind(roleController)
);
router.delete(
  "/:roleId",
  authMiddleware("delete:roles"),
  roleController.deleteRole.bind(roleController)
);

export default router;