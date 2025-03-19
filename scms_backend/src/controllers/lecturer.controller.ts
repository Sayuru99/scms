import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Module } from "../entities/Module";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";

export class LecturerController {
  async getAssignedModules(req: Request, res: Response) {
    try {
      const lecturerId = req.user?.userId;
      console.log("Lecturer ID:", lecturerId);

      if (!lecturerId) {
        throw new BadRequestError("User not authenticated");
      }

      const moduleRepository = AppDataSource.getRepository(Module);

      // Using a more explicit query with proper joins
      const modules = await moduleRepository
        .createQueryBuilder("module")
        .innerJoinAndSelect("module.course", "course")
        .innerJoinAndSelect("module.lecturer", "lecturer")
        .where("lecturer.id = :lecturerId", { lecturerId })
        .andWhere("module.isDeleted = :isDeleted", { isDeleted: false })
        .select([
          "module.id",
          "module.name",
          "module.code",
          "module.semester",
          "module.credits",
          "module.isMandatory",
          "course.id",
          "course.code",
          "course.name"
        ])
        .getMany();

      logger.info(`Fetched ${modules.length} modules for lecturer ${lecturerId}`);
      res.json({ modules });
    } catch (error) {
      logger.error("Error fetching assigned modules:", error);
      if (error instanceof BadRequestError) {
        res.status(400).json({ message: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        console.error("Detailed error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
} 