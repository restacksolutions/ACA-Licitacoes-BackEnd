import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CurrentUser } from '../../core/security/current-user.decorator';
import { Public } from '../../core/security/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Registrar novo usuário e empresa' })
  @ApiResponse({ status: 201, description: 'Usuário e empresa criados com sucesso', type: RegisterResponseDto })
  @ApiResponse({ status: 409, description: 'Email ou CNPJ já está em uso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return this.svc.register(registerDto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login com email e senha' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.svc.login(loginDto);
  }

  @Get('me')
  @ApiBearerAuth('bearer')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async me(@CurrentUser() user: { authUserId: string }) {
    return this.svc.me(user.authUserId);
  }
}
