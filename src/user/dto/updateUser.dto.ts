import { IsEmail, IsNotEmpty, MinLength } from "class-validator";


export class UpdateUserDto {
  @IsNotEmpty()
  readonly username: string;
  @IsEmail()
  readonly email :string;
  @IsNotEmpty()
  readonly bio: string;
  @IsNotEmpty()
  readonly image: string;

}