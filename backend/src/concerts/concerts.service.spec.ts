import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsListCacheService } from './concerts-list-cache.service';
import { ConcertsRepository } from './concerts.repository';
import { ConcertsService } from './concerts.service';

describe('ConcertsService', () => {
  let service: ConcertsService;
  let concertsRepository: jest.Mocked<
    Pick<
      ConcertsRepository,
      'findAllPaginated' | 'create' | 'findById' | 'delete'
    >
  >;
  let concertsListCache: jest.Mocked<
    Pick<ConcertsListCacheService, 'get' | 'set' | 'invalidate'>
  >;

  const mockConcert = {
    id: 1,
    name: 'Rock Night',
    description: 'Live rock concert',
    totalSeats: 100,
    createdAt: new Date('2026-01-01'),
    _count: { reservations: 10 },
  };

  beforeEach(async () => {
    concertsRepository = {
      findAllPaginated: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    concertsListCache = {
      get: jest.fn(),
      set: jest.fn(),
      invalidate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        { provide: ConcertsRepository, useValue: concertsRepository },
        { provide: ConcertsListCacheService, useValue: concertsListCache },
      ],
    }).compile();

    service = module.get(ConcertsService);
  });

  describe('GET /concerts', () => {
    //CASE: cache misses, query the database and cache the result
    it('returns paginated concerts from database when cache misses', async () => {
      concertsListCache.get.mockResolvedValue(undefined);
      concertsRepository.findAllPaginated.mockResolvedValue({
        items: [mockConcert],
        total: 1,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(concertsRepository.findAllPaginated).toHaveBeenCalledWith(1, 10);
      expect(concertsListCache.set).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 1,
        name: 'Rock Night',
        reservedCount: 10,
        availableSeats: 90,
        isSoldOut: false,
      });
      expect(result.meta.total).toBe(1);
    });

    //CASE: cache hit, return cached response
    it('returns cached concerts when available', async () => {
      const cached = {
        success: true as const,
        data: [{ id: 1, name: 'Cached Concert' }],
        meta: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
      };
      concertsListCache.get.mockResolvedValue(cached as never);

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(concertsRepository.findAllPaginated).not.toHaveBeenCalled();
      expect(result).toBe(cached);
    });
  });

  describe('POST /concerts', () => {
    //CASE: admin creates a concert
    it('creates a concert and invalidates cache', async () => {
      concertsRepository.create.mockResolvedValue(mockConcert);

      const result = await service.create({
        name: 'Rock Night',
        description: 'Live rock concert',
        totalSeats: 100,
      });

      expect(concertsListCache.invalidate).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data.name).toBe('Rock Night');
      expect(result.data.availableSeats).toBe(90);
    });
  });

  describe('DELETE /concerts/:id', () => {
    //CASE: admin deletes a concert
    it('deletes a concert and invalidates cache', async () => {
      concertsRepository.findById.mockResolvedValue(mockConcert);
      concertsRepository.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(1);

      expect(concertsRepository.delete).toHaveBeenCalledWith(1);
      expect(concertsListCache.invalidate).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });
});
