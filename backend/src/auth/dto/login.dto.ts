import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { VALIDATE_MESSAGE } from '../constants/validate-message';

export class LoginDto {
  @IsEmail({}, { message: VALIDATE_MESSAGE.email.invalid })
  @IsNotEmpty({ message: VALIDATE_MESSAGE.email.required })
  email!: string;

  @IsString({ message: VALIDATE_MESSAGE.password.string })
  @IsNotEmpty({ message: VALIDATE_MESSAGE.password.required })
  @MinLength(8, { message: VALIDATE_MESSAGE.password.minLength })
  password!: string;
}
