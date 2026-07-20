import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

const concertWithReservationCount = {
  include: {
    _count: {
      select: { reservations: true },
    },
  },
} as const;

export type ConcertWithReservationCount = {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  createdAt: Date;
  _count: {
    reservations: number;
  };
};

@Injectable()
export class ConcertsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ items: ConcertWithReservationCount[]; total: number }> {
    const skip = (page - 1) * pageSize;

    return Promise.all([
      this.prisma.client.concert.findMany({
        ...concertWithReservationCount,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.client.concert.count(),
    ]).then(([items, total]) => ({ items, total }));
  }

  findById(id: number): Promise<ConcertWithReservationCount | null> {
    return this.prisma.client.concert.findUnique({
      where: { id },
      ...concertWithReservationCount,
    });
  }

  create(data: CreateConcertDto): Promise<ConcertWithReservationCount> {
    return this.prisma.client.concert.create({
      data: {
        name: data.name,
        description: data.description,
        totalSeats: data.totalSeats,
      },
      ...concertWithReservationCount,
    });
  }

  delete(id: number): Promise<{ id: number }> {
    return this.prisma.client.concert.delete({
      where: { id },
      select: { id: true },
    });
  }

  getStats(): Promise<{
    totalSeats: number;
    reserved: number;
    cancelled: number;
  }> {
    return Promise.all([
      this.prisma.client.concert.aggregate({ _sum: { totalSeats: true } }),
      this.prisma.client.reservation.count(),
    ]).then(([seats, reserved]) => ({
      totalSeats: seats._sum.totalSeats ?? 0,
      reserved,
      cancelled: 0,
    }));
  }
}
