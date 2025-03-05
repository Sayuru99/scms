import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ length: 10, nullable: true })
  grade?: string;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: "enrolled_at" })
  enrolledAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
