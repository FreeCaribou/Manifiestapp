import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventsquareReference: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  postCode: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  sendDone: boolean;

  @Column()
  sellingInformationId: string;
}
