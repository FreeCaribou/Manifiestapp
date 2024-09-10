import { IsString } from "class-validator";
import { Department } from "src/api/departments/department.entity";

export class ConnectSellerDto {
  @IsString()
  readonly email: string;
  readonly password: string;
  readonly department: Department;
}