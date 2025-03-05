import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";
import { Resource } from "../entities/Resource";
import { ResourceType } from "../entities/ResourceType";
import { Reservation } from "../entities/Reservation";
import { Event } from "../entities/Event";
import { EventAttendee } from "../entities/EventAttendee";
import { Course } from "../entities/Course";
import { Module } from "../entities/Module";
import { Class } from "../entities/Class";
import { Enrollment } from "../entities/Enrollment";
import { Notification } from "../entities/Notification";
import { Group } from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { Message } from "../entities/Message";

config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "scms_group_eight",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [
    User,
    Role,
    Permission,
    Resource,
    ResourceType,
    Reservation,
    Event,
    EventAttendee,
    Course,
    Module,
    Class,
    Enrollment,
    Notification,
    Group,
    GroupMember,
    Message,
  ],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});
