import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CurrentUser } from '../../core/security/current-user.decorator';
import { UsersService } from './users.service';
import { UserMeResponseDto } from './dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get('me')
  @ApiOperation({ 
    summary: 'Obter perfil completo do usuário',
    description: 'Retorna todos os dados do usuário incluindo empresas, membros e atividades recentes'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil do usuário retornado com sucesso',
    type: UserMeResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido ou expirado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuário não encontrado' 
  })
  async me(@CurrentUser() user: { authUserId: string }): Promise<UserMeResponseDto> {
    return this.svc.me(user.authUserId);
  }
}
