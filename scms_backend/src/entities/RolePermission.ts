import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Role } from "./Role";
import { Permission } from "./Permission";
import { ApiProperty } from "@nestjs/swagger";

@Entity("role_permissions")
export class RolePermission {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @ManyToOne(() => Role, (role) => role.rolePermissions, { nullable: false })
  role!: Role;

  @ApiProperty()
  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    nullable: false,
  })
  permission!: Permission;

  @ApiProperty()
  @CreateDateColumn()
  assignedAt!: Date;
}
