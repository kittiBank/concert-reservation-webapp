import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsListCacheService } from './concerts-list-cache.service';
import { ConcertsRepository } from './concerts.repository';
import { ConcertsService } from './concerts.service';

@Module({
  controllers: [ConcertsController],
  providers: [ConcertsService, ConcertsRepository, ConcertsListCacheService],
  exports: [ConcertsListCacheService],
})
export class ConcertsModule {}
