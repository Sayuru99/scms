import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Resource } from "./Resource";

@Entity("reservations")
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @ManyToOne(() => Resource, { nullable: false })
  resource!: Resource;

  @Column({ type: "datetime" })
  startTime!: Date;

  @Column({ type: "datetime" })
  endTime!: Date;

  @Column({
    type: "enum",
    enum: ["Pending", "Approved", "Rejected", "Cancelled"],
    default: "Pending",
  })
  status!: string;

  @Column({ type: "text", nullable: true })
  purpose?: string;

  @ManyToOne(() => User, { nullable: true })
  approvedBy?: User;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
