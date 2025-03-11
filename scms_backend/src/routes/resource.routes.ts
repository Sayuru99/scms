import { Router } from "express";
import { ResourceController } from "../controllers/resource.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const resourceController = new ResourceController();

router.post(
  "/",
  authMiddleware("create:resources"),
  resourceController.createResource.bind(resourceController)
);
router.get(
  "/",
  authMiddleware("read:resources"),
  resourceController.getResources.bind(resourceController)
);
router.put(
  "/:resourceId",
  authMiddleware("update:resources"),
  resourceController.updateResource.bind(resourceController)
);
router.delete(
  "/:resourceId",
  authMiddleware("delete:resources"),
  resourceController.deleteResource.bind(resourceController)
);

router.post(
  "/types",
  authMiddleware("create:resource_types"),
  resourceController.createResourceType.bind(resourceController)
);
router.get(
  "/types",
  authMiddleware("read:resource_types"),
  resourceController.getResourceTypes.bind(resourceController)
);
router.put(
  "/types/:typeId",
  authMiddleware("update:resource_types"),
  resourceController.updateResourceType.bind(resourceController)
);
router.delete(
  "/types/:typeId",
  authMiddleware("delete:resource_types"),
  resourceController.deleteResourceType.bind(resourceController)
);

router.post(
  "/reservations",
  authMiddleware("create:reservations"),
  resourceController.createReservation.bind(resourceController)
);
router.get(
  "/reservations",
  authMiddleware("read:reservations"),
  resourceController.getReservations.bind(resourceController)
);
router.put(
  "/reservations/:reservationId",
  authMiddleware("update:reservations"),
  resourceController.updateReservation.bind(resourceController)
);

router.post(
  "/:resourceId/request",
  authMiddleware("create:reservations"),
  resourceController.requestResource.bind(resourceController)
);

router.post(
  "/:resourceId/return",
  authMiddleware("update:reservations"),
  resourceController.returnResource.bind(resourceController)
);

export default router;
