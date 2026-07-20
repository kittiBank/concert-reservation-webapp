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
import {
  ApiItemResponseDto,
  ApiListResponseDto,
  ApiSuccessResponseDto,
} from '../common/dto/api-response.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ConcertsService } from './concerts.service';
import { ConcertResponseDto } from './dto/concert-response.dto';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ListConcertsQueryDto } from './dto/list-concerts-query.dto';

@Controller('concerts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  findAll(
    @Query() query: ListConcertsQueryDto,
  ): Promise<ApiListResponseDto<ConcertResponseDto>> {
    return this.concertsService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiItemResponseDto<ConcertResponseDto>> {
    return this.concertsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(
    @Body() dto: CreateConcertDto,
  ): Promise<ApiItemResponseDto<ConcertResponseDto>> {
    return this.concertsService.create(dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiSuccessResponseDto> {
    return this.concertsService.remove(id);
  }
}
