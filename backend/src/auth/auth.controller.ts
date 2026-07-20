import { Body, Controller, Post } from '@nestjs/common';
import { ApiItemResponseDto } from '../common/dto/api-response.dto';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body() dto: RegisterDto,
  ): Promise<ApiItemResponseDto<AuthResponseDto>> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(
    @Body() dto: LoginDto,
  ): Promise<ApiItemResponseDto<AuthResponseDto>> {
    return this.authService.login(dto);
  }
}
