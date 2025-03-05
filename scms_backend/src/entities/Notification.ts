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

  @CreateDateColumn({ name: "sent_at" })
  sentAt!: Date;

  @Column({ name: "is_read", default: false })
  isRead!: boolean;
}
