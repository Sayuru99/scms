import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";

export class CourseController {
  private courseService = new CourseService();

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await this.courseService.createCourse({
        ...req.body,
        createdById: req.user!.userId,
      });
      res.status(201).json({ message: "Course created", course });
    } catch (error) {
      next(error);
    }
  }

  async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, code, name } = req.query;
      const courses = await this.courseService.getCourses({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        code: code as string,
        name: name as string,
      });
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await this.courseService.updateCourse(
        parseInt(req.params.courseId),
        req.body
      );
      res.json({ message: "Course updated", course });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = await this.courseService.deleteCourse(parseInt(req.params.courseId));
      res.json({ message: "Course deleted", courseId });
    } catch (error) {
      next(error);
    }
  }
}