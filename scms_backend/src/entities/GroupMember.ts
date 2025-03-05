import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity("group_members")
export class GroupMember {
  @PrimaryColumn()
  groupId!: number;

  @PrimaryColumn()
  userId!: string;

  @Column({ length: 20, default: "Member" })
  role!: string;

  @Column({ name: "is_deleted", default: false })
  isDeleted!: boolean;

  @ManyToOne(() => Group)
  group!: Group;

  @ManyToOne(() => User)
  user!: User;
}
