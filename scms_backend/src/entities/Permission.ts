import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { Role } from "./Role";

@Entity("permissions")
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 50, unique: true })
  name!: string;

  @Column({ length: 50 })
  category!: string;

  @Column({ length: 50, nullable: true })
  scope?: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}