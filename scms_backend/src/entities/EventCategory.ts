import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { Event } from "./Event";
import { ApiProperty } from "@nestjs/swagger";

@Entity("event_categories")
export class EventCategory {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ unique: true, length: 100 })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false })
  @Column({ length: 255, nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean = true;

  @OneToMany(() => Event, (event) => event.category)
  events!: Event[];
}
