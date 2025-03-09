import { Router } from "express";
import { PermissionController } from "../controllers/permission.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const permissionController = new PermissionController();

router.post(
  "/",
  authMiddleware("create:permissions"),
  permissionController.createPermission.bind(permissionController)
);
router.get(
  "/",
  authMiddleware("read:permissions"),
  permissionController.getPermissions.bind(permissionController)
);
router.put(
  "/:permissionId",
  authMiddleware("update:permissions"),
  permissionController.updatePermission.bind(permissionController)
);
router.delete(
  "/:permissionId",
  authMiddleware("delete:permissions"),
  permissionController.deletePermission.bind(permissionController)
);

export default router;
