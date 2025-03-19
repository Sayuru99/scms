import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const courseController = new CourseController();

// Create a new course
router.post(
  "/create",
  authMiddleware("create:courses"),
  courseController.createCourse.bind(courseController)
);

// Update an existing course
router.put(
  "/update/:courseId",
  authMiddleware("update:courses"),
  courseController.updateCourse.bind(courseController)
);
 // get enrolled courses
router.get(
  "/enrolled",
  authMiddleware("read:enrolled_courses"),
  courseController.getEnrolledCourses.bind(courseController)
);

// get available courses
router.get(
  "/available",
  authMiddleware("read:courses"),
  courseController.getAvailableCourses.bind(courseController)
);

// get course by id
router.get(
  "/:courseId",
  authMiddleware("read:courses"),
  courseController.getCourseById.bind(courseController)
);

// get all courses
router.get(
  "/",
  authMiddleware("read:courses"),
  courseController.getCourses.bind(courseController)
);

// delete course
router.delete(
  "/:courseId",
  authMiddleware("delete:courses"),
  courseController.deleteCourse.bind(courseController)
);

// enroll student
router.post(
  "/:courseId/enroll",
  authMiddleware("create:enrollments"),
  courseController.enrollStudent.bind(courseController)
);

// get module schedule
router.get(
  "/:moduleId/schedule",
  authMiddleware("read:class"),
  courseController.getModuleSchedule.bind(courseController)
);

// create module schedule
router.post(
  "/:moduleId/schedule",
  authMiddleware("schedule:class"),
  courseController.createModuleSchedule.bind(courseController)
);

// update module schedule
router.put(
  "/:moduleId/schedule/:scheduleId",
  authMiddleware("schedule:class"),
  courseController.updateModuleSchedule.bind(courseController)
);

// get all class schedules
router.get(
  "/schedules",
  authMiddleware("read:class"),
  courseController.getAllClassSchedules.bind(courseController)
);

export default router;
