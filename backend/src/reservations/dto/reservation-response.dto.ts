export class ReservationConcertDto {
  id!: number;
  name!: string;
  description!: string;
  totalSeats!: number;
  reservedCount!: number;
  availableSeats!: number;
  isSoldOut!: boolean;
}

export class ReservationUserDto {
  id!: number;
  email!: string;
  fullName!: string;
}

export class ReservationResponseDto {
  id!: number;
  userId!: number;
  concertId!: number;
  createdAt!: Date;
  concert!: ReservationConcertDto;
  user?: ReservationUserDto;
}
