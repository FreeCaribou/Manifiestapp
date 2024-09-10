import { IsString } from "class-validator";

export class EditLongtextDto {
  @IsString()
  readonly label: string;

  @IsString()
  readonly lang: string;

  @IsString()
  readonly text: string;
}