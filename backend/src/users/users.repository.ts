import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export type UserRecord = {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: number): Promise<UserRecord | null> {
    return this.prisma.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        createdAt: true,
      },
    });
  }

  findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.client.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        createdAt: true,
      },
    });
  }

  create(data: {
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<UserRecord> {
    return this.prisma.client.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? Role.USER,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
