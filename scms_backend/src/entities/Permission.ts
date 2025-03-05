import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { RolePermission } from "./RolePermission"; // Import RolePermission
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

  @ApiProperty()
  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission
  )
  rolePermissions!: RolePermission[];
}
