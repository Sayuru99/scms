import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { AppDataSource } from "./config/db.config";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const startServer = async () => {
  await AppDataSource.initialize();
  app.listen(process.env.PORT || 5000, () => {
    console.log("Hello dev");
  });
};

startServer();
