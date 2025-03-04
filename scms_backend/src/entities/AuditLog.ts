import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("audit_logs")
export class AuditLog {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { eager: true })
  performedBy!: User;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  action!: string;

  @ApiProperty()
  @Column({ type: "text", nullable: true })
  details?: string;

  @ApiProperty()
  @CreateDateColumn()
  performedAt!: Date;
}
