import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../dtos/course.dto";
import { validate } from "class-validator";
import logger from "../config/logger";

export class CourseController {
  private courseService = new CourseService();

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreateCourseDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        logger.warn(`Validation failed for course creation: ${JSON.stringify(errors)}`);
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const course = await this.courseService.createCourse({
        ...dto,
        createdById: req.user!.userId,
      });
      res.status(201).json({ message: "Course created successfully", course });
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
      const dto = Object.assign(new UpdateCourseDto(), req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        logger.warn(`Validation failed for course update: ${JSON.stringify(errors)}`);
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const course = await this.courseService.updateCourse(
        parseInt(req.params.courseId),
        {
          ...dto,
          createdById: req.user!.userId,
        }
      );
      res.json({ message: "Course updated successfully", course });
    } catch (error) {
      next(error);
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = await this.courseService.deleteCourse(
        parseInt(req.params.courseId)
      );
      res.json({ message: "Course deleted", courseId });
    } catch (error) {
      next(error);
    }
  }

  async getEnrolledCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const studentId = req.user!.userId;
      const courses = await this.courseService.getEnrolledCourses(
        studentId,
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async getAvailableCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const studentId = req.user!.userId;
      const courses = await this.courseService.getAvailableCourses(
        studentId,
        page ? parseInt(page as string) : undefined,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(courses);
    } catch (error) {
      next(error);
    }
  }

  async enrollStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.userId;
      const courseId = parseInt(req.params.courseId);
      const enrollment = await this.courseService.enrollStudent(
        studentId,
        courseId
      );
      res.status(201).json({ message: "Enrolled successfully", enrollment });
    } catch (error) {
      next(error);
    }
  }

  async getCourseById(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = parseInt(req.params.courseId);
      const course = await this.courseService.getCourseById(courseId);
      res.json(course);
    } catch (error) {
      next(error);
    }
  }
}
