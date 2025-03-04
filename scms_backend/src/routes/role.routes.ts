// import { Router } from "express";
// import {
//   createRole,
//   getRole,
//   updateRole,
//   deleteRole,
//   assignPermissions,
// } from "../controllers/role.controller";
// import { authMiddleware } from "../middlewares/authMiddleware";

// const router = Router();

// router.post("/", authMiddleware(["create:roles"]), createRole);
// router.get("/:id", authMiddleware(["read:roles"]), getRole);
// router.put("/:id", authMiddleware(["update:roles"]), updateRole);
// router.delete("/:id", authMiddleware(["delete:roles"]), deleteRole);
// router.post(
//   "/:id/permissions",
//   authMiddleware(["update:roles"]),
//   assignPermissions
// );

// export default router;
