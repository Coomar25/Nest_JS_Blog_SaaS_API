import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
