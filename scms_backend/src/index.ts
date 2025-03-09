import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./routes/user.routes";
import rateLimit from "express-rate-limit";

config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
