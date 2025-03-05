import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @Column({ length: 20 })
  type!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "enum", enum: ["Low", "Medium", "High"], default: "Medium" })
  priority!: string;

  @Column({ length: 50, nullable: true })
  relatedEntity?: string;

  @Column({ name: "is_read", default: false })
  isRead!: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: "sent_at" })
  sentAt!: Date;
}
