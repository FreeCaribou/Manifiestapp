import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column("simple-json")
  extra: {roles: any[]};
}
