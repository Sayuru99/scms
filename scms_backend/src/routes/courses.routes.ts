import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const courseController = new CourseController();

router.post(
  "/",
  authMiddleware("create:courses"),
  courseController.createCourse.bind(courseController)
);
router.get(
  "/",
  authMiddleware("read:courses"),
  courseController.getCourses.bind(courseController)
);
router.put(
  "/:courseId",
  authMiddleware("update:courses"),
  courseController.updateCourse.bind(courseController)
);
router.delete(
  "/:courseId",
  authMiddleware("delete:courses"),
  courseController.deleteCourse.bind(courseController)
);

export default router;
