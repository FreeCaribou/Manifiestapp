import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SellingInformation {
  @PrimaryGeneratedColumn()
  id: number;

  // On the first call it will be null
  // We fill in after the completation of the selling
  @Column({ nullable: true })
  eventsquareReference: string;

  @Column({nullable: true, default: null})
  clientTransactionId: string;

  // we use the email of the seller for that
  @Column()
  sellerId: string;

  @Column()
  sellerDepartmentId: string;

  @Column()
  sellerPostalCode: string;

  @Column()
  fromWorkGroup?: boolean;

  @Column({nullable: true, default: null})
  vwTransactionId: string;

  @Column({nullable: true, default: null})
  clientName: string;

  @Column({nullable: true, default: null})
  clientLastName: string;

  @Column({nullable: true, default: null})
  clientEmail: string;

  @Column()
  orderDate: Date;

  @Column({nullable: true, default: null})
  finishDate: Date;

  @Column()
  quantity: number;

  @Column({nullable: true, default: null})
  edition: string;

  // Must seen how to stock that
  // A json string ?
  @Column("simple-json", {nullable: true, default: null})
  ticketInfo: {
    ticketLabel: any; ticketId: string, ticketAmount: number, ticketName: string, ticketPrice: number 
}[];
}
