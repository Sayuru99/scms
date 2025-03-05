import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("resource_types")
export class ResourceType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  type!: string;
}
