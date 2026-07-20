import { Role } from '@prisma/client';

export class AuthUserResponseDto {
  id!: number;
  email!: string;
  role!: Role;
}

export class AuthResponseDto {
  accessToken!: string;
  user!: AuthUserResponseDto;
}
