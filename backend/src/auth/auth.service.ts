import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { ApiItemResponseDto } from '../common/dto/api-response.dto';
import { buildItemResponse } from '../common/helpers/api-response.helper';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { UsersRepository } from '../users/users.repository';
import { AUTH_ERROR_MESSAGE } from './constants/auth-error.message';
import { AuthResponseDto, AuthUserResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  //register a new user
  async register(
    dto: RegisterDto,
  ): Promise<ApiItemResponseDto<AuthResponseDto>> {
    const existing = await this.usersRepository.findByEmail(
      dto.email.toLowerCase(),
    );

    //check if user already exists
    if (existing) {
      throw new ConflictException(AUTH_ERROR_MESSAGE.emailAlreadyExists);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersRepository.create({
      email: dto.email.toLowerCase(),
      fullName: dto.fullName.trim(),
      passwordHash,
      role: Role.USER,
    });

    return buildItemResponse(this.buildAuthResponse(user));
  }

  //login a user
  async login(dto: LoginDto): Promise<ApiItemResponseDto<AuthResponseDto>> {
    const user = await this.usersRepository.findByEmail(
      dto.email.toLowerCase(),
    );

    if (!user) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.invalidCredentials);
    }

    //encrypt password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGE.invalidCredentials);
    }

    return buildItemResponse(this.buildAuthResponse(user));
  }

  //build auth response
  private buildAuthResponse(user: {
    id: number;
    email: string;
    fullName: string;
    role: Role;
  }): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const authUser: AuthUserResponseDto = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    return {
      accessToken,
      user: authUser,
    };
  }
}
