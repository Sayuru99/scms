import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));
