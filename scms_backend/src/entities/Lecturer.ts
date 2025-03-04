import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('lecturers')
export class Lecturer {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Lecturer ID without prefix' })
  @Column({ unique: true, length: 20 })
  @IsNotEmpty()
  @Length(6, 20)
  lecturerId!: string;

  @ApiProperty({ description: 'Lecturer ID with "01" prefix' })
  @Column({ unique: true, length: 22 })
  @IsNotEmpty()
  prefixedLecturerId!: string;

  @ApiProperty({ description: 'Date lecturer was added to the system' })
  @CreateDateColumn()
  createdAt!: Date;
}
