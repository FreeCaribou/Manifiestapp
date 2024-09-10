import { IsOptional } from "class-validator";

export class EditSellingsInformationDTO {
  @IsOptional()
  readonly sellerDepartmentId?: string;
  
  @IsOptional()
  readonly sellerPostalCode?: string;
  
  @IsOptional()
  readonly fromWorkGroup?: boolean;
}