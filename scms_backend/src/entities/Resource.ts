import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import {
  IsNotEmpty,
  Length,
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("resources")
export class Resource {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsNotEmpty()
  @Length(1, 100)
  @IsString()
  name!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @Column({ length: 50 })
  @IsNotEmpty()
  @Length(1, 50)
  @IsString()
  type!: string;

  @ApiProperty()
  @ManyToOne(() => User, { nullable: false })
  @IsNotEmpty()
  createdBy!: User;

  @ApiProperty()
  @Column({ default: true })
  @IsBoolean()
  isAvailable: boolean = true;

  @ApiProperty()
  @CreateDateColumn()
  @IsDate()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  @IsDate()
  updatedAt!: Date;
}
