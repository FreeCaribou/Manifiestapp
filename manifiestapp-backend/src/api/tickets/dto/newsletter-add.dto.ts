import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class NewsletterAddDto {
  @IsString()
  @IsNotEmpty()
  readonly firstname: string;
  @IsString()
  @IsNotEmpty()
  readonly lastname: string;
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly MMERGE6: string;
}