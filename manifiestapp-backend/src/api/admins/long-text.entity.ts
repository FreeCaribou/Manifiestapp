import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LongText {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  label: string;

  @Column()
  lang: string;

  @Column({type: 'longtext'})
  text: string;
}
