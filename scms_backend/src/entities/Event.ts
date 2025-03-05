import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "datetime" })
  startTime!: Date;

  @Column({ type: "datetime" })
  endTime!: Date;

  @Column({ length: 100, nullable: true })
  location?: string;

  @Column({ type: "int", nullable: true })
  capacity?: number;

  @Column({
    type: "enum",
    enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
    default: "Scheduled",
  })
  status!: string;

  @Column({ name: "attendees_count", type: "int", default: 0 })
  attendeesCount!: number;

  @ManyToOne(() => User, { nullable: false })
  organizer!: User;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
