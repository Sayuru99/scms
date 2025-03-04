import express from "express";
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

app.use((req, res, next) => {
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
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/auth/login", loginRateLimiter);

const speedLimiter = slowDown({
  windowMs: 5 * 60 * 1000,
  delayAfter: 5,
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500;
  },
});

app.use("/api/auth/login", speedLimiter);

app.use("/api/auth", authRoutes);

const startServer = async () => {
  await AppDataSource.initialize();
  app.listen(process.env.PORT || 5000, () => {
    console.log("Hello group 8 dev team " + "port: " + process.env.PORT);
  });
};

startServer();
