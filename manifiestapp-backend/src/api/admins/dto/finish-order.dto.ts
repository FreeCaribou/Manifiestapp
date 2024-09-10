import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class FinishOrderDto {
  @IsString()
  @IsNotEmpty()
  readonly vwTransactionId: string;
  @IsString()
  readonly clientTransactionId: string;
  @IsArray()
  readonly ticketInfo: { ticketId: string, ticketAmount: number, ticketLabel: string, ticketPrice: number }[];
}