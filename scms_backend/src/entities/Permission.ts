import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Permission {
  @PrimaryColumn()
  id!: string; 

  @Column()
  name!: string; 

  @Column()
  category!: string; 

  @Column()
  description!: string; 

  @CreateDateColumn()
  createdAt!: Date; 

  @UpdateDateColumn()
  updatedAt!: Date; 
}