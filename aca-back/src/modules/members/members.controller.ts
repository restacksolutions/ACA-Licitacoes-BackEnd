import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { MembersService } from './members.service';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { AddMemberDto, UpdateMemberRoleDto } from './dto';
import {
  requireOwner,
  requireAdminOrOwner,
} from '../../common/utils/roles.util';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { sub: string; email: string };
  companyId?: string;
  membership?: { role: string; [key: string]: any };
}

@ApiTags('members')
@Controller('companies/:companyId/members')
@UseGuards(JwtAccessGuard, CompanyGuard)
@ApiBearerAuth('access')
export class MembersController {
  constructor(private service: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar membros da empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiResponse({
    status: 200,
    description: 'Lista de membros retornada com sucesso',
  })
  list(@Param('companyId') companyId: string) {
    return this.service.list(companyId);
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar membro à empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiResponse({
    status: 201,
    description: 'Membro adicionado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou usuário já é membro',
  })
  @ApiResponse({
    status: 403,
    description: 'Apenas admin/owner pode adicionar membros',
  })
  add(
    @Param('companyId') companyId: string,
    @Req() req: RequestWithUser,
    @Body() dto: AddMemberDto,
  ) {
    requireAdminOrOwner(req);
    return this.service.add(companyId, dto);
  }

  @Patch(':memberId/role')
  @ApiOperation({ summary: 'Atualizar papel do membro' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiParam({ name: 'memberId', description: 'ID do membro' })
  @ApiResponse({ status: 200, description: 'Papel atualizado com sucesso' })
  @ApiResponse({ status: 403, description: 'Apenas owner pode alterar papéis' })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  updateRole(
    @Req() req: RequestWithUser,
    @Param('memberId') memberId: string,
    @Body() body: UpdateMemberRoleDto,
  ) {
    requireOwner(req); // apenas owner altera papéis
    return this.service.updateRole(req.companyId!, memberId, body);
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remover membro da empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiParam({ name: 'memberId', description: 'ID do membro' })
  @ApiResponse({ status: 200, description: 'Membro removido com sucesso' })
  @ApiResponse({
    status: 403,
    description: 'Apenas admin/owner pode remover membros',
  })
  @ApiResponse({ status: 404, description: 'Membro não encontrado' })
  remove(
    @Param('companyId') companyId: string,
    @Req() req: RequestWithUser,
    @Param('memberId') memberId: string,
  ) {
    requireAdminOrOwner(req);
    return this.service.remove(companyId, memberId);
  }
}
