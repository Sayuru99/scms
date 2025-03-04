import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, Length } from "class-validator";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 20 })
  @IsNotEmpty()
  @Length(6, 20)
  studentId!: string;

  @Column({ unique: true, length: 22 })
  @IsNotEmpty()
  prefixedStudentId!: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  fullName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
