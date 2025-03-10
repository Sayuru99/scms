import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";

import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./routes/user.routes";
import permissionRoutes from "./routes/permissions.routes";
import roleRoutes from "./routes/roles.routes";
import resourceRoutes from "./routes/resource.routes";

config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.options("*", cors());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/resources", resourceRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error));
