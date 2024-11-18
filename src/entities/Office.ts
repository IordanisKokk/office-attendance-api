import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Attendances } from "./Attendances";

@Entity()
export class Office {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    officeName: string;
    
    @Column()
    location: string;
    
    @Column()
    address: string;
    
    @OneToMany(() => Attendances, (attendance) => attendance.office)
    attendance: Attendances[];

    @Column()
    created_at: Date;
}