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

  @ManyToOne(() => User, { nullable: false })
  lecturer!: User;
}
