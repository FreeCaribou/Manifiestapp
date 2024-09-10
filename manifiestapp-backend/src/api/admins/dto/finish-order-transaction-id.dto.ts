import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class FinishOrderTransactionIdDto {
  @IsString()
  @IsNotEmpty()
  readonly vwTransactionId: string;
  @IsString()
  @IsNotEmpty()
  readonly clientTransactionId: string;
}