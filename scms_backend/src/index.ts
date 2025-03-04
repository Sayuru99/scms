import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import sanitizeHtml from "sanitize-html";
import { AppDataSource } from "./config/db.config";
import authRoutes from "./routes/auth.routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key]);
      }
    });
  }
  next();
});

app.use(helmet());
app.use(express.json());
app.use(cors());

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});

const speedLimiter = slowDown({
  windowMs: 5 * 60 * 1000,
  delayAfter: 5,
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500;
  },
});

app.use("/api/auth/login", speedLimiter, loginRateLimiter);
app.use("/api/auth", authRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    const port = parseInt(process.env.PORT || "5000", 10);
    app.listen(port, () => {
      console.log("Hello group 8 dev team " + "port: " + process.env.PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
