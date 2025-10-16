import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";


export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  readonly username: string;
   @IsOptional()
  @IsEmail()
  readonly email :string;
   @IsOptional()
  @IsNotEmpty()
  readonly bio: string;
   @IsOptional()
  @IsNotEmpty()
  readonly image: string;

}