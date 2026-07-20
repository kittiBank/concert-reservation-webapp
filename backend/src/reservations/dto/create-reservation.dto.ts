import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { VALIDATE_MESSAGE } from '../constants/validate-message';

export class CreateReservationDto {
  @Type(() => Number)
  @IsInt({ message: VALIDATE_MESSAGE.concertId.integer })
  @Min(1, { message: VALIDATE_MESSAGE.concertId.min })
  concertId!: number;
}
