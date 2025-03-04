import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { Permission } from "./Permission";
import { ApiProperty } from "@nestjs/swagger";

@Entity("roles")
export class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ unique: true, length: 50 })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false })
  @Column({ length: 255, nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ default: false })
  isSystemRole: boolean = false;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean = true;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  permissions!: Permission[];
}
