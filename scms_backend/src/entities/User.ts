import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  Length,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
}

@Entity("users")
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ unique: true, length: 100 })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @Column({ length: 255, select: false })
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty()
  @Column({ length: 100 })
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty()
  @Column({ length: 20, unique: true })
  @IsNotEmpty()
  @Length(8, 20)
  universityId!: string;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: Gender,
    nullable: true,
  })
  @IsOptional()
  gender?: Gender;

  @ApiProperty()
  @Column({ type: "date", nullable: true })
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty()
  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.ACTIVE;

  @ApiProperty()
  @Column({ nullable: true, length: 20 })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @Column({ default: false })
  isEmailVerified: boolean = false;

  @ApiProperty()
  @Column({ nullable: true })
  lastLogin?: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;
}
