import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { ConcertsListCacheService } from '../concerts/concerts-list-cache.service';
import { AuthUser } from '../common/types/auth-user.type';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationsRepository: jest.Mocked<
    Pick<
      ReservationsRepository,
      | 'findByUserAndConcert'
      | 'createInTransaction'
      | 'findByUserPaginated'
      | 'findAllPaginated'
      | 'findById'
      | 'delete'
    >
  >;
  let concertsListCache: jest.Mocked<
    Pick<ConcertsListCacheService, 'invalidate'>
  >;

  const authUser: AuthUser = {
    id: 1,
    email: 'user@example.com',
    role: Role.USER,
  };

  const mockReservation = {
    id: 1,
    userId: 1,
    concertId: 1,
    createdAt: new Date('2026-01-01'),
    concert: {
      id: 1,
      name: 'Rock Night',
      description: 'Live rock concert',
      totalSeats: 100,
      _count: { reservations: 1 },
    },
    user: {
      id: 1,
      email: 'user@example.com',
      fullName: 'Sara John',
    },
  };

  beforeEach(async () => {
    reservationsRepository = {
      findByUserAndConcert: jest.fn(),
      createInTransaction: jest.fn(),
      findByUserPaginated: jest.fn(),
      findAllPaginated: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };
    concertsListCache = { invalidate: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: ReservationsRepository, useValue: reservationsRepository },
        { provide: ConcertsListCacheService, useValue: concertsListCache },
      ],
    }).compile();

    service = module.get(ReservationsService);
  });

  describe('POST /reservations', () => {
    //CASE: user creates a reservation
    it('creates a reservation and invalidates cache', async () => {
      reservationsRepository.findByUserAndConcert.mockResolvedValue(null);
      reservationsRepository.createInTransaction.mockResolvedValue(
        mockReservation,
      );

      const result = await service.create(authUser, { concertId: 1 });

      expect(reservationsRepository.createInTransaction).toHaveBeenCalledWith(
        1,
        1,
      );
      expect(concertsListCache.invalidate).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data.concertId).toBe(1);
      expect(result.data.concert.availableSeats).toBe(99);
    });
  });

  describe('GET /reservations/me', () => {
    //CASE: user views own reservations
    it('returns paginated reservations for the current user', async () => {
      reservationsRepository.findByUserPaginated.mockResolvedValue({
        items: [mockReservation],
        total: 1,
      });

      const result = await service.findMine(authUser, {
        page: 1,
        pageSize: 10,
      });

      expect(reservationsRepository.findByUserPaginated).toHaveBeenCalledWith(
        1,
        1,
        10,
      );
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].userId).toBe(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('GET /reservations', () => {
    //CASE: admin views all reservations
    it('returns paginated audit trail for admin', async () => {
      reservationsRepository.findAllPaginated.mockResolvedValue({
        items: [mockReservation],
        total: 1,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(reservationsRepository.findAllPaginated).toHaveBeenCalledWith(
        1,
        10,
      );
      expect(result.success).toBe(true);
      expect(result.data[0].user).toEqual({
        id: 1,
        email: 'user@example.com',
        fullName: 'Sara John',
      });
    });
  });

  describe('DELETE /reservations/:id', () => {
    //CASE: user cancels own reservation
    it('cancels own reservation and invalidates cache', async () => {
      reservationsRepository.findById.mockResolvedValue(mockReservation);
      reservationsRepository.delete.mockResolvedValue({ id: 1 });

      const result = await service.remove(authUser, 1);

      expect(reservationsRepository.delete).toHaveBeenCalledWith(1);
      expect(concertsListCache.invalidate).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });
});
