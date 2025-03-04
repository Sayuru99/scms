import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("resources")
export class Resource {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  type!: string;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  url!: string;

  @ManyToOne(() => User, { eager: true })
  uploadedBy!: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;
}
