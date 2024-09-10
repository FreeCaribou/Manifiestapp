import { IsString } from "class-validator";
import { Department } from "src/api/departments/department.entity";

export class TicketSaleDto {
  @IsString()
  readonly userId: string;

  // TODO lot of variable for the tickets
  // Type of ticket
  // Viva Waller ref
  // Number of ticket
}