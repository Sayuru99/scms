import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ResourceType } from "./ResourceType";

@Entity("resources")
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @ManyToOne(() => ResourceType, { nullable: false })
  type!: ResourceType;

  @Column({ name: "is_available", default: true })
  isAvailable!: boolean;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;
}
