import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import logger from "../config/logger";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    logger.warn(`${error.name}: ${error.message}`);
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  logger.error(`Unexpected error: ${error.message}`, { stack: error.stack });
  console.error("Internal Server Error:", error);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
