import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ApiItemResponseDto,
  ApiListResponseDto,
  ApiSuccessResponseDto,
} from '../common/dto/api-response.dto';
import {
  buildItemResponse,
  buildListResponse,
  buildSuccessResponse,
} from '../common/helpers/api-response.helper';
import { AuthUser } from '../common/types/auth-user.type';
import { ConcertsListCacheService } from '../concerts/concerts-list-cache.service';
import { RESERVATION_ERROR_MESSAGE } from './constants/reservation-error.message';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ListReservationsQueryDto } from './dto/list-reservations-query.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import {
  ReservationWithRelations,
  ReservationsRepository,
} from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly concertsListCache: ConcertsListCacheService,
  ) {}

  async create(
    user: AuthUser,
    dto: CreateReservationDto,
  ): Promise<ApiItemResponseDto<ReservationResponseDto>> {
    const existing = await this.reservationsRepository.findByUserAndConcert(
      user.id,
      dto.concertId,
    );

    if (existing) {
      throw new ConflictException(RESERVATION_ERROR_MESSAGE.alreadyReserved);
    }

    const reservation = await this.createReservation(user.id, dto.concertId);
    this.concertsListCache.invalidate();
    return buildItemResponse(this.toResponse(reservation));
  }

  async findMine(
    user: AuthUser,
    query: ListReservationsQueryDto,
  ): Promise<ApiListResponseDto<ReservationResponseDto>> {
    const { page, pageSize } = query;
    const { items, total } =
      await this.reservationsRepository.findByUserPaginated(
        user.id,
        page,
        pageSize,
      );

    return buildListResponse(
      items.map((item) => this.toResponse(item)),
      page,
      pageSize,
      total,
    );
  }

  async findAll(
    query: ListReservationsQueryDto,
  ): Promise<ApiListResponseDto<ReservationResponseDto>> {
    const { page, pageSize } = query;
    const { items, total } = await this.reservationsRepository.findAllPaginated(
      page,
      pageSize,
    );

    return buildListResponse(
      items.map((item) => this.toResponse(item, true)),
      page,
      pageSize,
      total,
    );
  }

  async remove(user: AuthUser, id: number): Promise<ApiSuccessResponseDto> {
    const existing = await this.reservationsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(RESERVATION_ERROR_MESSAGE.notFound);
    }

    if (existing.userId !== user.id) {
      throw new ForbiddenException(RESERVATION_ERROR_MESSAGE.forbidden);
    }

    await this.reservationsRepository.delete(id);
    this.concertsListCache.invalidate();
    return buildSuccessResponse();
  }

  private async createReservation(
    userId: number,
    concertId: number,
  ): Promise<ReservationWithRelations> {
    try {
      const reservation = await this.reservationsRepository.createInTransaction(
        userId,
        concertId,
      );

      if (!reservation) {
        throw new NotFoundException(RESERVATION_ERROR_MESSAGE.concertNotFound);
      }

      return reservation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof Error && error.message === 'CONCERT_FULL') {
        throw new ConflictException(RESERVATION_ERROR_MESSAGE.concertFull);
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(RESERVATION_ERROR_MESSAGE.alreadyReserved);
      }

      throw error;
    }
  }

  private toResponse(
    reservation: ReservationWithRelations,
    includeUser = false,
  ): ReservationResponseDto {
    const reservedCount = reservation.concert._count.reservations;
    const availableSeats = Math.max(
      reservation.concert.totalSeats - reservedCount,
      0,
    );

    return {
      id: reservation.id,
      userId: reservation.userId,
      concertId: reservation.concertId,
      createdAt: reservation.createdAt,
      concert: {
        id: reservation.concert.id,
        name: reservation.concert.name,
        description: reservation.concert.description,
        totalSeats: reservation.concert.totalSeats,
        reservedCount,
        availableSeats,
        isSoldOut: availableSeats <= 0,
      },
      ...(includeUser
        ? {
            user: {
              id: reservation.user.id,
              email: reservation.user.email,
              fullName: reservation.user.fullName,
            },
          }
        : {}),
    };
  }
}
