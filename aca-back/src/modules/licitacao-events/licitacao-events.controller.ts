import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { ActiveCompanyGuard } from '../../core/tenancy/active-company.guard';
import { ActiveCompany } from '../../core/tenancy/active-company.decorator';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { LicitacaoEventsService } from './licitacao-events.service';
import { ChangeStatusDto, LicitacaoEventResponseDto } from './dto/licitacao-event.dto';

@ApiTags('Licitação Events')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, ActiveCompanyGuard)
@Controller('licitacoes/:licitacaoId')
export class LicitacaoEventsController {
  constructor(private readonly svc: LicitacaoEventsService) {}

  @Get('events')
  @ApiOperation({ summary: 'Listar eventos da licitação' })
  @ApiResponse({ status: 200, description: 'Lista de eventos da licitação' })
  async getEvents(
    @ActiveCompany() company: any,
    @Param('licitacaoId') licitacaoId: string,
  ) {
    return this.svc.getEvents(company.id, licitacaoId);
  }

  @UseGuards(RolesGuard)
  @Roles('owner', 'admin')
  @Patch('status')
  @ApiOperation({ summary: 'Alterar status da licitação e criar evento' })
  @ApiResponse({ status: 200, description: 'Status alterado com sucesso' })
  async changeStatus(
    @ActiveCompany() company: any,
    @Param('licitacaoId') licitacaoId: string,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.svc.changeStatus(company.id, licitacaoId, dto);
  }
}
