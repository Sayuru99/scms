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
    code: string;
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
          let lecturer = undefined;
          if (moduleData.lecturerId) {
            lecturer = await this.userRepo.findOneBy({
              id: moduleData.lecturerId,
              isDeleted: false,
            });
            
            if (!lecturer) {
              throw new BadRequestError(`Invalid lecturer ID: ${moduleData.lecturerId}`);
            }
          }

          const moduleEntity = this.moduleRepo.create({
            name: moduleData.name,
            code: moduleData.code,
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
    try {
      logger.info(`Starting course update for ID: ${courseId}`);
      logger.debug('Update data:', updates);

      // Find the course with all necessary relations
      const course = await this.courseRepo.findOne({
        where: { id: courseId, isDeleted: false },
        relations: ["modules", "modules.lecturer"],
      });
      
      if (!course) {
        logger.warn(`Course not found: ${courseId}`);
        throw new NotFoundError("Course not found");
      }

      // Start a transaction
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Update course basic information
        if (updates.code) course.code = updates.code;
        if (updates.name) course.name = updates.name;
        if (updates.description !== undefined) course.description = updates.description;
        if (updates.credits !== undefined) course.credits = updates.credits;

        // Save course first
        const savedCourse = await queryRunner.manager.save(Course, course);

        // Handle module updates if provided
        if (updates.modules) {
          logger.debug('Processing module updates');
          
          // Get all existing modules for this course
          const existingModules = await queryRunner.manager.find(Module, {
            where: { course: { id: courseId } },
            relations: ["lecturer"]
          });

          // First, soft delete all existing modules
          for (const module of existingModules) {
            module.isDeleted = true;
            await queryRunner.manager.save(Module, module);
          }

          // Track module codes to prevent duplicates
          const moduleCodes = new Set<string>();

          // Create new modules
          for (const moduleData of updates.modules) {
            try {
              // Validate required fields
              if (!moduleData.code || !moduleData.name || !moduleData.semester) {
                throw new BadRequestError('Module must have code, name, and semester');
              }

              // Check for duplicate module codes
              if (moduleCodes.has(moduleData.code)) {
                throw new BadRequestError(`Duplicate module code: ${moduleData.code}`);
              }
              moduleCodes.add(moduleData.code);

              // Handle lecturer if provided
              let lecturer = undefined;
              if (moduleData.lecturerId) {
                lecturer = await queryRunner.manager.findOne(User, {
                  where: { id: moduleData.lecturerId, isDeleted: false }
                });
                if (!lecturer) {
                  throw new BadRequestError(`Invalid lecturer ID: ${moduleData.lecturerId}`);
                }
              }

              // Create new module
              const newModule = queryRunner.manager.create(Module, {
                name: moduleData.name,
                code: moduleData.code,
                semester: moduleData.semester,
                credits: moduleData.credits ?? 0,
                isMandatory: moduleData.isMandatory ?? false,
                lecturer: lecturer,
                course: savedCourse,
                isDeleted: false,
              });

              await queryRunner.manager.save(Module, newModule);
              logger.debug(`Created new module: ${moduleData.code}`);
            } catch (error) {
              logger.error('Error processing module:', error);
              throw error;
            }
          }
        }

        // Fetch the final updated course with all relations
        const result = await queryRunner.manager.findOne(Course, {
          where: { id: courseId },
          relations: ["createdBy", "modules", "modules.lecturer"],
        });

        if (!result) {
          throw new NotFoundError("Course not found after update");
        }

        await queryRunner.commitTransaction();
        logger.info(`Course updated successfully: ${courseId}`);
        return result;

      } catch (error) {
        await queryRunner.rollbackTransaction();
        logger.error('Transaction error updating course:', error);
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      logger.error('Error in updateCourse:', error);
      throw error;
    }
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
    limit: number = 10
  ) {
    const enrolledCourseIds = (
      await this.enrollmentRepo.find({
        where: { student: { id: studentId }, isDeleted: false },
        relations: ["course"],
        select: ["course"],
      })
    ).map((enrollment) => enrollment.course.id);

    const [courses, total] = await this.courseRepo.findAndCount({
      where: { isDeleted: false, id: Not(In(enrolledCourseIds)) },
      skip: (page - 1) * limit,
      take: limit,
      relations: ["createdBy"],
    });

    return {
      courses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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

  async getCourseById(courseId: number) {
    const course = await this.courseRepo.findOne({
      where: { id: courseId, isDeleted: false },
      relations: ["createdBy", "modules", "modules.lecturer"],
    });

    if (!course) {
      logger.warn(`Course not found: ${courseId}`);
      throw new NotFoundError("Course not found");
    }

    logger.info(`Fetched course with ID: ${courseId}`);
    return course;
  }
}
