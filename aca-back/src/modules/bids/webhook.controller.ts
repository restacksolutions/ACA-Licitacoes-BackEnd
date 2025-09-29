import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LicitacoesService } from './licitacoes.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly licitacoesService: LicitacoesService) {}

  @Post('n8n/analisar-edital')
  @ApiOperation({ summary: 'Webhook para receber resultado da análise do edital do n8n' })
  @ApiResponse({ status: 200, description: 'Análise processada com sucesso' })
  async processarAnaliseEdital(@Body() payload: any) {
    return this.licitacoesService.processarAnaliseEdital(payload);
  }
}
