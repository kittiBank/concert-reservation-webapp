import { Module } from '@nestjs/common';
import { ConcertsController } from './concerts.controller';
import { ConcertsRepository } from './concerts.repository';
import { ConcertsService } from './concerts.service';

@Module({
  controllers: [ConcertsController],
  providers: [ConcertsService, ConcertsRepository],
  exports: [ConcertsService],
})
export class ConcertsModule {}
