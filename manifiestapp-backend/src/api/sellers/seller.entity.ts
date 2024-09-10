import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // First and lastname in one
  @Column()
  name: string;

  @Column()
  workGroup: boolean;
}
