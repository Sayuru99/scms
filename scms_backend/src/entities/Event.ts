import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { EventCategory } from "./EventCategory";
import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("events")
export class Event {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsNotEmpty()
  @Length(1, 100)
  title!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  @IsNotEmpty()
  startTime?: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  @IsNotEmpty()
  endTime?: Date;

  @ApiProperty()
  @Column({ length: 100, nullable: true })
  location?: string;

  @ApiProperty()
  @ManyToOne(() => User, { nullable: false })
  createdBy!: User;

  @ApiProperty()
  @ManyToOne(() => EventCategory, (category) => category.events)
  category!: EventCategory;

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
