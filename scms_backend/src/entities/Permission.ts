import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { Role } from "./Role";
import { ApiProperty } from "@nestjs/swagger";

@Entity("permissions")
export class Permission {
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
  @Column({ length: 50 })
  @IsNotEmpty()
  category!: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean = true;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];
}
