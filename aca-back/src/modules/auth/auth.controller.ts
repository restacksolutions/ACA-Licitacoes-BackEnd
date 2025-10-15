// src/modules/auth/auth.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

// Tipos de resposta só pro Swagger
class TokenPairResponseDto {
  accessToken!: string;
  refreshToken!: string;
}
class MeResponseDto {
  userId!: string;
  email!: string;
}

// Tipagem do Request (Express)
import type { Request } from 'express';
interface RequestWithUser extends Request {
  user: { sub: string; email: string };
}
interface RequestWithRefresh extends Request {
  refresh: { sub: string; email: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiOperation({ summary: 'Registrar usuário + empresa + membership (owner)' })
  @ApiCreatedResponse({
    description: 'Par de tokens',
    type: TokenPairResponseDto,
  })
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @ApiOperation({ summary: 'Login com e-mail e senha' })
  @ApiOkResponse({ description: 'Par de tokens', type: TokenPairResponseDto })
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  // Usa o refresh token no header Authorization: Bearer <refreshToken>
  @ApiOperation({ summary: 'Obter novo par de tokens usando refresh token' })
  @ApiOkResponse({
    description: 'Novo par de tokens',
    type: TokenPairResponseDto,
  })
  @ApiBearerAuth('refresh') // usa o esquema "refresh" definido no Swagger
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: RequestWithRefresh) {
    return this.service.refresh(req.refresh.sub, req.refresh.email);
  }

  // Endpoint protegido para testar o access token
  @ApiOperation({
    summary: 'Retorna dados do usuário autenticado (teste do access token)',
  })
  @ApiOkResponse({ type: MeResponseDto })
  @ApiBearerAuth('access') // usa o esquema "access" definido no Swagger
  @UseGuards(JwtAccessGuard)
  @Post('me')
  me(@Req() req: RequestWithUser) {
    return { userId: req.user.sub, email: req.user.email };
  }
}
