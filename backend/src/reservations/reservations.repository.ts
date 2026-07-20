import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

const reservationWithRelations = {
  include: {
    concert: {
      select: {
        id: true,
        name: true,
        description: true,
        totalSeats: true,
        _count: {
          select: { reservations: true },
        },
      },
    },
    user: {
      select: {
        id: true,
        email: true,
      },
    },
  },
} as const satisfies {
  include: Prisma.ReservationInclude;
};

export type ReservationWithRelations = Prisma.ReservationGetPayload<{
  include: typeof reservationWithRelations.include;
}>;

@Injectable()
export class ReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number): Promise<ReservationWithRelations | null> {
    return this.prisma.client.reservation.findUnique({
      where: { id },
      ...reservationWithRelations,
    });
  }

  findByUserAndConcert(
    userId: number,
    concertId: number,
  ): Promise<{ id: number } | null> {
    return this.prisma.client.reservation.findUnique({
      where: {
        userId_concertId: { userId, concertId },
      },
      select: { id: true },
    });
  }

  findAllPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ items: ReservationWithRelations[]; total: number }> {
    const skip = (page - 1) * pageSize;

    return Promise.all([
      this.prisma.client.reservation.findMany({
        ...reservationWithRelations,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.client.reservation.count(),
    ]).then(([items, total]) => ({ items, total }));
  }

  findByUserPaginated(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<{ items: ReservationWithRelations[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const where = { userId };

    return Promise.all([
      this.prisma.client.reservation.findMany({
        where,
        ...reservationWithRelations,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.client.reservation.count({ where }),
    ]).then(([items, total]) => ({ items, total }));
  }

  createInTransaction(
    userId: number,
    concertId: number,
  ): Promise<ReservationWithRelations | null> {
    return this.prisma.client.$transaction(async (tx) => {
      const lockedConcert = await tx.$queryRaw<
        Array<{ id: number; total_seats: number }>
      >`
        SELECT id, total_seats
        FROM concerts
        WHERE id = ${concertId}
        FOR UPDATE
      `;

      if (lockedConcert.length === 0) {
        return null;
      }

      const reservedCount = await tx.reservation.count({
        where: { concertId },
      });

      if (reservedCount >= lockedConcert[0].total_seats) {
        throw new Error('CONCERT_FULL');
      }

      return tx.reservation.create({
        data: { userId, concertId },
        ...reservationWithRelations,
      });
    });
  }

  delete(id: number): Promise<{ id: number }> {
    return this.prisma.client.reservation.delete({
      where: { id },
      select: { id: true },
    });
  }
}
