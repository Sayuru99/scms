import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsNotEmpty, IsDate, Length } from "class-validator";
import { EventCategory } from "./EventCategory";
import { User } from "./User";
import { ApiProperty } from "@nestjs/swagger";

@Entity("events")
export class Event {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsNotEmpty()
  @Length(3, 100)
  title!: string;

  @ApiProperty()
  @Column({ type: "text" })
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  @Column()
  @IsDate()
  startTime!: Date;

  @ApiProperty()
  @Column()
  @IsDate()
  endTime!: Date;

  @ManyToOne(() => EventCategory, (category) => category.events, {
    eager: true,
  })
  category!: EventCategory;

  @ManyToOne(() => User, { eager: true })
  createdBy!: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: "event_managers",
    joinColumn: { name: "event_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
  })
  managers!: User[];

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean = true;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;
}
