import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Permission } from "./Permission";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id!: string; 

  @Column({ unique: true })
  name!: string; 

  @Column({ nullable: true })
  description?: string; 

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions!: Permission[]; 

  @CreateDateColumn()
  createdAt!: Date; 

  @UpdateDateColumn()
  updatedAt!: Date; 
}
