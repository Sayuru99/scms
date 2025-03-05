import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Course } from "./Course";

@Entity("enrollments")
export class Enrollment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  student!: User;

  @ManyToOne(() => Course, { nullable: false })
  course!: Course;

  @Column({ length: 20 })
  status!: string;

  @CreateDateColumn({ name: "enrolled_at" })
  enrolledAt!: Date;
}
