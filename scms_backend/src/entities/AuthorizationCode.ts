import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";
import { ApiProperty } from "@nestjs/swagger";

@Entity("authorization_codes")
export class AuthorizationCode {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ unique: true, length: 100 })
  code!: string;

  @ApiProperty()
  @ManyToOne(() => User)
  user!: User;

  @ApiProperty()
  @ManyToOne(() => Client)
  client!: Client;

  @ApiProperty()
  @Column("simple-array")
  scopes!: string[];

  @ApiProperty()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @ApiProperty()
  @Column({ type: "timestamp", nullable: true })
  expiresAt!: Date;
}
