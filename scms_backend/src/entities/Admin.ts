import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("admins")
export class Admin {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ unique: true, length: 50 })
  @IsNotEmpty()
  @Length(3, 50)
  adminId!: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @Column({ length: 255, select: false })
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean = true;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;
}
