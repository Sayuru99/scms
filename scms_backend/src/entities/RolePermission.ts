import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("role_permissions")
export class RolePermission {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column("uuid")
  roleId!: string;

  @ApiProperty()
  @Column("uuid")
  permissionId!: string;

  @ApiProperty()
  @CreateDateColumn()
  assignedAt!: Date;
}
