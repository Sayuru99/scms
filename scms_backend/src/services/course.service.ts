import { AppDataSource } from "../config/database";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";
import { FindManyOptions, Like } from "typeorm";

interface CourseCreateParams {
  code: string;
  name: string;
  description?: string;
  credits: number;
  createdById: string;
}

interface CourseFilterParams {
  page?: number;
  limit?: number;
  code?: string;
  name?: string;
}

export class CourseService {
  private courseRepo = AppDataSource.getRepository(Course);
  private userRepo = AppDataSource.getRepository(User);

  async createCourse(params: CourseCreateParams) {
    const createdBy = await this.userRepo.findOneBy({
      id: params.createdById,
      isDeleted: false,
    });
    if (!createdBy) {
      logger.warn(`Invalid user ID: ${params.createdById}`);
      throw new BadRequestError("Invalid user");
    }

    const course = this.courseRepo.create({
      code: params.code,
      name: params.name,
      description: params.description,
      credits: params.credits,
      createdBy,
      isDeleted: false,
    });

    await this.courseRepo.save(course);
    logger.info(`Course created: ${course.id}`);
    return course;
  }

  async getCourses(filters: CourseFilterParams = {}) {
    const { page = 1, limit = 10, code, name } = filters;
    const query: FindManyOptions<Course> = {
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
    };

    if (code) {
      query.where = { ...query.where, code };
    }
    if (name) {
      query.where = { ...query.where, name: Like(`%${name}%`) };
    }

    const [courses, total] = await this.courseRepo.findAndCount(query);
    logger.info(
      `Fetched ${courses.length} courses (page ${page}, limit ${limit})`
    );
    return { courses, total, page, limit };
  }

  async updateCourse(
    courseId: number,
    updates: Partial<CourseCreateParams>
  ) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId, isDeleted: false },
    });
    if (!course) {
      logger.warn(`Course not found: ${courseId}`);
      throw new NotFoundError("Course not found");
    }

    if (updates.createdById) {
      const createdBy = await this.userRepo.findOneBy({
        id: updates.createdById,
        isDeleted: false,
      });
      if (!createdBy) throw new BadRequestError("Invalid user");
      course.createdBy = createdBy;
    }

    Object.assign(course, {
      code: updates.code || course.code,
      name: updates.name || course.name,
      description:
        updates.description !== undefined
          ? updates.description
          : course.description,
      credits: updates.credits || course.credits,
    });

    await this.courseRepo.save(course);
    logger.info(`Course updated: ${courseId}`);
    return course;
  }

  async deleteCourse(courseId: number) {
    const course = await this.courseRepo.findOneBy({
      id: courseId,
      isDeleted: false,
    });
    if (!course) {
      logger.warn(`Course not found: ${courseId}`);
      throw new NotFoundError("Course not found");
    }

    course.isDeleted = true;
    await this.courseRepo.save(course);
    logger.info(`Course soft-deleted: ${courseId}`);
    return courseId;
  }
}
