import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Index,
  ManyToOne,
} from "typeorm";
import { Role } from "./Role";
import { Permission } from "./Permission";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
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

  @ManyToMany(() => Role)
  @JoinTable({ name: "users_roles" })
  roles!: Role[];

  @ManyToMany(() => Permission)
  @JoinTable({ name: "users_permissions" })
  directPermissions!: Permission[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User;
}
