import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Student } from "../entities/Student";
import { Lecturer } from "../entities/Lecturer";
import { Staff } from "../entities/Staff";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";
import { Client } from "../entities/Client";
import { AuthorizationCode } from "../entities/AuthorizationCode";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    User,
    Student,
    Lecturer,
    Staff,
    Role,
    Permission,
    Client,
    AuthorizationCode,
  ],
  synchronize: true,
  logging: false,
});
