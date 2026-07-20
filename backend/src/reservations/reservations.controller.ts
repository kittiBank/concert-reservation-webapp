import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiItemResponseDto,
  ApiListResponseDto,
  ApiSuccessResponseDto,
} from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthUser } from '../common/types/auth-user.type';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ListReservationsQueryDto } from './dto/list-reservations-query.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('me')
  @Roles(Role.USER)
  findMine(
    @CurrentUser() user: AuthUser,
    @Query() query: ListReservationsQueryDto,
  ): Promise<ApiListResponseDto<ReservationResponseDto>> {
    return this.reservationsService.findMine(user, query);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query() query: ListReservationsQueryDto,
  ): Promise<ApiListResponseDto<ReservationResponseDto>> {
    return this.reservationsService.findAll(query);
  }

  @Post()
  @Roles(Role.USER)
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateReservationDto,
  ): Promise<ApiItemResponseDto<ReservationResponseDto>> {
    return this.reservationsService.create(user, dto);
  }

  @Delete(':id')
  @Roles(Role.USER)
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiSuccessResponseDto> {
    return this.reservationsService.remove(user, id);
  }
}
