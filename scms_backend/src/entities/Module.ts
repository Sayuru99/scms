import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

@Entity("modules")
export class Module {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @ManyToOne(() => Course, { nullable: false })
  course!: Course;

  @Column({ length: 20 })
  semester!: string;

  @Column({ type: "int", nullable: true })
  credits?: number;

  @ManyToOne(() => User, { nullable: true })
  lecturer!: User;

  @Column({ name: "is_mandatory", default: false })
  isMandatory!: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;
}
