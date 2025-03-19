import { AppDataSource } from "../config/database";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import { Enrollment } from "../entities/Enrollment";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";
import { FindManyOptions, In, Like, Not } from "typeorm";
import { Module } from "../entities/Module";
import { Class } from "../entities/Class";

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

  async getModuleSchedule(moduleId: number) {
    try {
      logger.info(`Fetching schedule for module ${moduleId}`);
      
      // First verify that the module exists and is not deleted
      const module = await this.moduleRepo.findOne({
        where: { id: moduleId, isDeleted: false },
        relations: ["lecturer"]
      });

      if (!module) {
        logger.warn(`Module not found: ${moduleId}`);
        throw new NotFoundError("Module not found");
      }

      logger.info(`Found module: ${module.name} (${module.code})`);

      // Get all scheduled classes for this module
      const classRepo = AppDataSource.getRepository(Class);
      const queryBuilder = classRepo
        .createQueryBuilder("class")
        .leftJoinAndSelect("class.module", "module")
        .leftJoinAndSelect("class.reservedBy", "reservedBy")
        .where("module.id = :moduleId", { moduleId })
        .andWhere("class.isDeleted = :isDeleted", { isDeleted: false })
        .orderBy("class.startTime", "ASC");

      logger.debug('Executing query:', queryBuilder.getSql());
      
      const classes = await queryBuilder.getMany();
      logger.info(`Found ${classes.length} classes for module ${moduleId}`);

      // Transform the data to match the frontend's expected format
      const schedule = classes.map(cls => {
        try {
          return {
            id: cls.id.toString(),
            week: this.getWeekNumber(cls.startTime),
            startTime: this.formatTime(cls.startTime),
            endTime: this.formatTime(cls.endTime),
            date: cls.startTime.toISOString().split('T')[0],
            location: cls.location || "Not specified",
            capacity: cls.capacity,
            reservedBy: cls.reservedBy ? {
              id: cls.reservedBy.id,
              firstName: cls.reservedBy.firstName,
              lastName: cls.reservedBy.lastName
            } : null
          };
        } catch (error) {
          logger.error('Error transforming class data:', error);
          logger.error('Problematic class data:', JSON.stringify(cls, null, 2));
          throw error;
        }
      });

      logger.info(`Successfully transformed ${schedule.length} schedules`);
      return schedule;

    } catch (error) {
      logger.error('Error in getModuleSchedule:', error);
      logger.error('Module ID:', moduleId);
      throw error;
    }
  }

  private getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  async createModuleSchedule(moduleId: number, data: {
    week: number;
    startTime: string;
    endTime: string;
    location?: string;
    capacity: number;
  }) {
    // First verify that the module exists and is not deleted
    const module = await this.moduleRepo.findOne({
      where: { id: moduleId, isDeleted: false },
      relations: ["lecturer"]
    });

    if (!module) {
      logger.warn(`Module not found: ${moduleId}`);
      throw new NotFoundError("Module not found");
    }

    // Create a new class schedule
    const classRepo = AppDataSource.getRepository(Class);
    const newClass = classRepo.create({
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      location: data.location,
      capacity: data.capacity,
      isDeleted: false
    });

    // Set the module relationship
    newClass.module = module;

    await classRepo.save(newClass);

    // Return the created schedule in the same format as getModuleSchedule
    return {
      id: newClass.id.toString(),
      week: this.getWeekNumber(newClass.startTime),
      startTime: this.formatTime(newClass.startTime),
      endTime: this.formatTime(newClass.endTime),
      location: newClass.location || "Not specified",
      capacity: newClass.capacity,
      reservedBy: null
    };
  }

  async updateModuleSchedule(moduleId: number, scheduleId: number, data: {
    startTime?: string;
    endTime?: string;
    location?: string;
    capacity?: number;
    isDeleted?: boolean;
  }) {
    // First verify that the module exists and is not deleted
    const module = await this.moduleRepo.findOne({
      where: { id: moduleId, isDeleted: false },
      relations: ["lecturer"]
    });

    if (!module) {
      logger.warn(`Module not found: ${moduleId}`);
      throw new NotFoundError("Module not found");
    }

    // Find the class schedule
    const classRepo = AppDataSource.getRepository(Class);
    const existingClass = await classRepo.findOne({
      where: { id: scheduleId, module: { id: moduleId }, isDeleted: false }
    });

    if (!existingClass) {
      logger.warn(`Schedule not found: ${scheduleId}`);
      throw new NotFoundError("Schedule not found");
    }

    // Update the class schedule
    if (data.startTime) existingClass.startTime = new Date(data.startTime);
    if (data.endTime) existingClass.endTime = new Date(data.endTime);
    if (data.location !== undefined) existingClass.location = data.location;
    if (data.capacity !== undefined) existingClass.capacity = data.capacity;
    if (data.isDeleted !== undefined) existingClass.isDeleted = data.isDeleted;

    await classRepo.save(existingClass);

    if (data.isDeleted) {
      logger.info(`Schedule ${scheduleId} marked as deleted`);
      return { message: "Schedule deleted successfully" };
    }

    // Return the updated schedule in the same format as getModuleSchedule
    return {
      id: existingClass.id.toString(),
      week: this.getWeekNumber(existingClass.startTime),
      startTime: this.formatTime(existingClass.startTime),
      endTime: this.formatTime(existingClass.endTime),
      date: existingClass.startTime.toISOString().split('T')[0],
      location: existingClass.location || "Not specified",
      capacity: existingClass.capacity,
      reservedBy: null
    };
  }
}
