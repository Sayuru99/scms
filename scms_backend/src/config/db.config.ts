import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Student } from "../entities/Student";
import { Lecturer } from "../entities/Lecturer";
import { Staff } from "../entities/Staff";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Student, Lecturer, Staff],
  synchronize: true,
  logging: false,
});
