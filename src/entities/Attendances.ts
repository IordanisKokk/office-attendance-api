import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Office } from "./Office";

export enum AttendanceStatus {
  PRESENT = "present",
  LEAVE = "leave",
  REMOTE = "remote",
}

@Entity()
export class Attendances {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.attendance, { nullable: false })
  user: User;

  @ManyToOne(() => Office, (office) => office.attendance, { nullable: true })
  office: Office | null;

  @Column({
    type: "enum",
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column()
  date: Date;
}
