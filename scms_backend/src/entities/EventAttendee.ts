import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

@Entity("event_attendees")
export class EventAttendee {
  @PrimaryColumn()
  eventId!: number;

  @PrimaryColumn()
  userId!: string;

  @Column({ default: false })
  attended!: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @ManyToOne(() => Event)
  event!: Event;

  @ManyToOne(() => User)
  user!: User;

  @CreateDateColumn({ name: "registered_at" })
  registeredAt!: Date;
}
