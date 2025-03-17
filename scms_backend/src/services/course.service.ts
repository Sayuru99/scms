import { AppDataSource } from "../config/database";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { Enrollment } from "../entities/Enrollment";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";
import { FindManyOptions, In, Like, Not } from "typeorm";
import { Module } from "../entities/Module";

interface CourseCreateParams {
  code: string;
  name: string;
  description?: string;
  credits: number;
  createdById: string;
  modules?: {
    name: string;
    semester: string;
    credits?: number;
    isMandatory: boolean;
    lecturerId: string;
  }[];
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
  private enrollmentRepo = AppDataSource.getRepository(Enrollment);
  private moduleRepo = AppDataSource.getRepository(Module);

  async createCourse(params: CourseCreateParams) {
    const createdBy = await this.userRepo.findOneBy({
      id: params.createdById,
      isDeleted: false,
    });
    if (!createdBy) {
      logger.warn(`Invalid user ID: ${params.createdById}`);
      throw new BadRequestError("Invalid user");
    }

    // Start a transaction to ensure data consistency
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the course
      const course = this.courseRepo.create({
        code: params.code,
        name: params.name,
        description: params.description,
        credits: params.credits,
        createdBy,
        isDeleted: false,
      });

      await queryRunner.manager.save(course);

      // Create modules if provided
      if (params.modules && params.modules.length > 0) {
        for (const moduleData of params.modules) {
          const lecturer = await this.userRepo.findOneBy({
            id: moduleData.lecturerId,
            isDeleted: false,
          });
          
          if (!lecturer) {
            throw new BadRequestError(`Invalid lecturer ID: ${moduleData.lecturerId}`);
          }

          const moduleEntity = this.moduleRepo.create({
            name: moduleData.name,
            semester: moduleData.semester,
            credits: moduleData.credits,
            isMandatory: moduleData.isMandatory,
            lecturer,
            course,
            isDeleted: false,
          });

          await queryRunner.manager.save(moduleEntity);
        }
      }

      await queryRunner.commitTransaction();
      logger.info(`Course created with ID: ${course.id}`);
      return course;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Error creating course:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getCourses(filters: CourseFilterParams = {}) {
    const { page = 1, limit = 10, code, name } = filters;
    const query: FindManyOptions<Course> = {
      where: { isDeleted: false },
      skip: (page - 1) * limit,
      take: limit,
      relations: ["createdBy"],
    };

    if (code) query.where = { ...query.where, code };
    if (name) query.where = { ...query.where, name: Like(`%${name}%`) };

    const [courses, total] = await this.courseRepo.findAndCount(query);
    logger.info(
      `Fetched ${courses.length} courses (page ${page}, limit ${limit})`
    );
    return { courses, total, page, limit };
  }

  async updateCourse(courseId: number, updates: Partial<CourseCreateParams>) {
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

  async getEnrolledCourses(
    studentId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const [enrollments, total] = await this.enrollmentRepo.findAndCount({
      where: { student: { id: studentId }, isDeleted: false },
      relations: ["course"],
      skip: (page - 1) * limit,
      take: limit,
    });

    const courses = enrollments.map((enrollment) => enrollment.course);
    logger.info(
      `Fetched ${courses.length} enrolled courses for student ${studentId}`
    );
    return { courses, total, page, limit };
  }

  async getAvailableCourses(
    studentId: string,
    page: number = 1,
    limit: number = 3
  ) {
    const enrolledCourseIds = (
      await this.enrollmentRepo.find({
        where: { student: { id: studentId }, isDeleted: false },
        select: ["course"],
      })
    ).map((enrollment) => enrollment.course.id);

    const [courses, total] = await this.courseRepo.findAndCount({
      where: { isDeleted: false, id: Not(In(enrolledCourseIds)) },
      skip: (page - 1) * limit,
      take: limit,
      relations: ["createdBy"],
    });

    logger.info(
      `Fetched ${courses.length} available courses for student ${studentId}`
    );
    return { courses, total, page, limit };
  }

  async enrollStudent(studentId: string, courseId: number) {
    const student = await this.userRepo.findOneBy({
      id: studentId,
      isDeleted: false,
    });
    if (!student) throw new NotFoundError("Student not found");

    const course = await this.courseRepo.findOneBy({
      id: courseId,
      isDeleted: false,
    });
    if (!course) throw new NotFoundError("Course not found");

    const existingEnrollment = await this.enrollmentRepo.findOne({
      where: {
        student: { id: studentId },
        course: { id: courseId },
        isDeleted: false,
      },
    });
    if (existingEnrollment)
      throw new BadRequestError("Already enrolled in this course");

    const enrollment = this.enrollmentRepo.create({
      student,
      course,
      status: "Enrolled",
      isDeleted: false,
    });

    await this.enrollmentRepo.save(enrollment);
    logger.info(`Student ${studentId} enrolled in course ${courseId}`);
    return enrollment;
  }
}
