import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: jest.Mocked<
    Pick<UsersRepository, 'findByEmail' | 'create'>
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    passwordHash: 'hashed-password',
    role: Role.USER,
    createdAt: new Date('2026-01-01'),
  };

  beforeEach(async () => {
    usersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: usersRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('POST /auth/register', () => {
    //CASE: user registers successfully
    it('registers a new user and returns access token', async () => {
      usersRepository.findByEmail.mockResolvedValue(null);
      usersRepository.create.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

      const result = await service.register({
        email: 'User@Example.com',
        password: 'password123',
      });

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'user@example.com',
      );
      expect(usersRepository.create).toHaveBeenCalledWith({
        email: 'user@example.com',
        passwordHash: 'hashed-password',
        role: Role.USER,
      });
      expect(result.success).toBe(true);
      expect(result.data.accessToken).toBe('mock-jwt-token');
      expect(result.data.user).toEqual({
        id: 1,
        email: 'user@example.com',
        role: Role.USER,
      });
    });
  });

  describe('POST /auth/login', () => {
    //CASE: user logs in successfully
    it('logs in with valid credentials and returns access token', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        'user@example.com',
      );
      expect(result.success).toBe(true);
      expect(result.data.accessToken).toBe('mock-jwt-token');
      expect(result.data.user.email).toBe('user@example.com');
    });
  });
});
