import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { ApiListResponseDto } from '../common/dto/api-response.dto';
import { ConcertResponseDto } from './dto/concert-response.dto';

const CACHE_TTL_MS = 60_000; // 1 minute

@Injectable()
export class ConcertsListCacheService {
  private generation = 0;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  buildKey(page: number, pageSize: number): string {
    return `concerts:list:g${this.generation}:${page}:${pageSize}`;
  }

  //get concerts list from cache
  get(
    page: number,
    pageSize: number,
  ): Promise<ApiListResponseDto<ConcertResponseDto> | undefined> {
    return this.cache.get(this.buildKey(page, pageSize));
  }

  //set concerts list in cache
  async set(
    page: number,
    pageSize: number,
    value: ApiListResponseDto<ConcertResponseDto>,
  ): Promise<void> {
    await this.cache.set(this.buildKey(page, pageSize), value, CACHE_TTL_MS);
  }

  invalidate(): void {
    this.generation += 1;
  }
}
