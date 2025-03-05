import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { RolePermission } from "./RolePermission"; // Import RolePermission
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

  @ApiProperty()
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {
    cascade: true,
  })
  rolePermissions!: RolePermission[];
}
