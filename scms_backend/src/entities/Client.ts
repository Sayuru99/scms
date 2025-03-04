import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("clients")
export class Client {
  @ApiProperty()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ApiProperty()
  @Column({ unique: true, length: 100 })
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @Column({ unique: true, length: 100 })
  @IsNotEmpty()
  clientId!: string;

  @ApiProperty()
  @Column({ length: 255, select: false })
  @IsNotEmpty()
  clientSecret!: string;

  @ApiProperty()
  @Column({ length: 255 })
  @IsNotEmpty()
  redirectUri!: string;
}
