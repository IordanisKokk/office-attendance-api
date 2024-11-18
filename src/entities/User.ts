import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Role } from "../Interfaces/Role";
import { Attendances } from "./Attendances";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password_hash: string;

  @Column()
  email: string;

  @Column({ type: "varchar", default: "User" })
  role: "Admin" | "User";

  @OneToMany(() => Attendances, (attendance) => attendance.user)
  attendance: Attendances[];

  @Column()
  created_at: Date;
}
