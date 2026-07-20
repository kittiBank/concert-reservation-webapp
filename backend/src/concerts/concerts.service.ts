import { Injectable, NotFoundException } from '@nestjs/common';
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
import {
  ConcertWithReservationCount,
  ConcertsRepository,
} from './concerts.repository';
import { ConcertResponseDto } from './dto/concert-response.dto';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ListConcertsQueryDto } from './dto/list-concerts-query.dto';

@Injectable()
export class ConcertsService {
  constructor(private readonly concertsRepository: ConcertsRepository) {}

  async findAll(
    query: ListConcertsQueryDto,
  ): Promise<ApiListResponseDto<ConcertResponseDto>> {
    const { page, pageSize } = query;
    const { items, total } = await this.concertsRepository.findAllPaginated(
      page,
      pageSize,
    );

    return buildListResponse(
      items.map((concert) => this.toResponse(concert)),
      page,
      pageSize,
      total,
    );
  }

  async create(
    dto: CreateConcertDto,
  ): Promise<ApiItemResponseDto<ConcertResponseDto>> {
    const concert = await this.concertsRepository.create(dto);
    return buildItemResponse(this.toResponse(concert));
  }

  async remove(id: number): Promise<ApiSuccessResponseDto> {
    const existing = await this.concertsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Concert with id ${id} not found`);
    }

    await this.concertsRepository.delete(id);
    return buildSuccessResponse();
  }

  private toResponse(concert: ConcertWithReservationCount): ConcertResponseDto {
    const reservedCount = concert._count.reservations;
    const availableSeats = Math.max(concert.totalSeats - reservedCount, 0);

    return {
      id: concert.id,
      name: concert.name,
      description: concert.description,
      totalSeats: concert.totalSeats,
      reservedCount,
      availableSeats,
      isSoldOut: availableSeats <= 0,
      createdAt: concert.createdAt,
    };
  }
}
