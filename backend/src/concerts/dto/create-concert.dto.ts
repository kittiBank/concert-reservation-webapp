import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { VALIDATE_MESSAGE } from '../constants/validate-message';

export class CreateConcertDto {
  @IsString({ message: VALIDATE_MESSAGE.name.string })
  @IsNotEmpty({ message: VALIDATE_MESSAGE.name.required })
  @MaxLength(200, { message: VALIDATE_MESSAGE.name.tooLong })
  name!: string;

  @IsString({ message: VALIDATE_MESSAGE.description.string })
  @IsNotEmpty({ message: VALIDATE_MESSAGE.description.required })
  @MaxLength(2000, { message: VALIDATE_MESSAGE.description.tooLong })
  description!: string;

  @Type(() => Number)
  @IsInt({ message: VALIDATE_MESSAGE.totalSeats.integer })
  @Min(1, { message: VALIDATE_MESSAGE.totalSeats.min })
  totalSeats!: number;
}
