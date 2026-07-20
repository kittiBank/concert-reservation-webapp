export class ConcertResponseDto {
  id!: number;
  name!: string;
  description!: string;
  totalSeats!: number;
  reservedCount!: number;
  availableSeats!: number;
  isSoldOut!: boolean;
  createdAt!: Date;
}
