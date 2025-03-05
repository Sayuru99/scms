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

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn({ name: "sent_at" })
  sentAt!: Date;
}
