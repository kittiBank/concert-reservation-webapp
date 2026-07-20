import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VALIDATE_MESSAGE } from '../constants/validate-message';

export class RegisterDto {
  @IsString({ message: VALIDATE_MESSAGE.fullName.string })
  @IsNotEmpty({ message: VALIDATE_MESSAGE.fullName.required })
  @MaxLength(200, { message: VALIDATE_MESSAGE.fullName.tooLong })
  fullName!: string;

  @IsEmail({}, { message: VALIDATE_MESSAGE.email.invalid })
  @IsNotEmpty({ message: VALIDATE_MESSAGE.email.required })
  email!: string;

  @IsString({ message: VALIDATE_MESSAGE.password.string })
  @IsNotEmpty({ message: VALIDATE_MESSAGE.password.required })
  @MinLength(8, { message: VALIDATE_MESSAGE.password.minLength })
  password!: string;
}
