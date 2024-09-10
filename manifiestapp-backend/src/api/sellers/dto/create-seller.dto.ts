import { IsString } from "class-validator";

export class CreateSellerDto {
  @IsString()
  readonly firstName: string;
  @IsString()
  readonly lastName: string;
  @IsString()
  readonly email: string;
}