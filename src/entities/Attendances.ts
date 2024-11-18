import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Office } from "./Office";

@Entity()
export class Attendances {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.attendance, { nullable: false })
  user: User;

  @ManyToOne(() => Office, (office) => office.attendance, { nullable: true })
  office: Office | null;

  @Column()
  date: Date;
}
