import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 50, unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
