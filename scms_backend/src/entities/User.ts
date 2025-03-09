import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Role } from "./Role";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ name: "first_name", length: 50 })
  firstName!: string;

  @Column({ name: "last_name", length: 50 })
  lastName!: string;

  @Column({ name: "phone_number", length: 15, nullable: true })
  phoneNumber?: string;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Column({ name: "is_first_login", default: true })
  isFirstLogin!: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @Column({ type: "text", nullable: true })
  refreshTokens?: string;

  @Column({ name: "last_activity", type: "timestamp", nullable: true })
  lastActivity?: Date;

  @ManyToOne(() => Role, (role) => role.id, { nullable: true })
  role!: Role;

  @Column({ type: "text", nullable: true })
  directPermissions?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}