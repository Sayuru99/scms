import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Module } from "./Module";

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Module, { nullable: false })
  module!: Module;

  @Column({ type: "datetime" })
  startTime!: Date;

  @Column({ type: "datetime" })
  endTime!: Date;

  @Column({ length: 100, nullable: true })
  location?: string;

  @Column({ length: 20 })
  status!: string;
}
