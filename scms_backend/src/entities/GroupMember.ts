import { Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Entity("group_members")
export class GroupMember {
  @PrimaryColumn()
  groupId!: number;

  @PrimaryColumn()
  userId!: string;

  @ManyToOne(() => Group, (group) => group.id)
  group!: Group;

  @ManyToOne(() => User, (user) => user.id)
  user!: User;
}
