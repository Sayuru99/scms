import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Group } from "./Group";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  sender!: User;

  @ManyToOne(() => Group, { nullable: true })
  group?: Group;

  @ManyToOne(() => User, { nullable: true })
  recipient?: User;

  @Column({ type: "text" })
  content!: string;

  @Column({ name: "is_read", default: false })
  isRead!: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: "sent_at" })
  sentAt!: Date;
}
