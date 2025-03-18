import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Module } from "../entities/Module";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";

export class LecturerController {
  private moduleRepo = AppDataSource.getRepository(Module);

  async getAssignedModules(req: Request, res: Response) {
    try {
      const lecturerId = req.params.id;

      if (!lecturerId) {
        throw new BadRequestError("Lecturer ID is required");
      }

      const modules = await this.moduleRepo.find({
        where: {
          lecturer: { id: lecturerId },
          isDeleted: false,
        },
        relations: ["course"],
        select: {
          id: true,
          name: true,
          code: true,
          semester: true,
          credits: true,
          isMandatory: true,
          course: {
            id: true,
            code: true,
            name: true,
          },
        },
      });

      logger.info(`Fetched ${modules.length} modules for lecturer ${lecturerId}`);
      res.json({ modules });
    } catch (error) {
      logger.error("Error fetching assigned modules:", error);
      if (error instanceof BadRequestError) {
        res.status(400).json({ message: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
} 