import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  label: string;

  @Column({ unique: true, nullable: false })
  code: string;
}
