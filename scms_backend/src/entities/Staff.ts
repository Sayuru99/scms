import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("staff")
export class Staff {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty({ description: "Staff (employee) ID without prefix" })
  @Column({ unique: true, length: 20 })
  @IsNotEmpty()
  @Length(6, 20)
  staffId!: string;

  @ApiProperty({ description: 'Staff ID with "02" prefix' })
  @Column({ unique: true, length: 22 })
  @IsNotEmpty()
  prefixedStaffId!: string;

  @ApiProperty({ description: "Date staff was added to the system" })
  @CreateDateColumn()
  createdAt!: Date;
}
