import { IsEmail, IsNotEmpty, MinLength } from "class-validator";


export class LoginUserDto {
@IsEmail()
  readonly email:string;
  @IsNotEmpty()
  @MinLength(6,{message:"password must be 6 characters"})
  readonly password :string
}