import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Module } from "./Module";
import { User } from "./User";

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Module, { nullable: false })
  module!: Module;

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

  @ManyToOne(() => User, { nullable: true })
  reservedBy?: User;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;
}
