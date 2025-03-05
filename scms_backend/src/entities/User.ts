import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Role } from "./Role";
import { Permission } from "./Permission";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isFirstLogin!: boolean;

  @Column({ type: "simple-array", nullable: true })
  refreshTokens?: string[];

  @ManyToMany(() => Role)
  @JoinTable()
  roles!: Role[];

  @ManyToMany(() => Permission)
  @JoinTable()
  directPermissions!: Permission[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
