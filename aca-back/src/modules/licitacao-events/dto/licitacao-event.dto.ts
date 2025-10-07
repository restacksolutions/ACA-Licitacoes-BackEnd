import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { LicitacaoStatus } from '../../bids/dto/licitacao.dto';

export class ChangeStatusDto {
  @ApiProperty({ 
    enum: LicitacaoStatus, 
    example: LicitacaoStatus.OPEN,
    description: 'Novo status da licitação' 
  })
  @IsEnum(LicitacaoStatus)
  newStatus!: LicitacaoStatus;

  @ApiPropertyOptional({ 
    example: 'Licitação publicada no portal oficial',
    description: 'Descrição da mudança de status' 
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class LicitacaoEventResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: '2025-10-06T12:00:00Z' })
  eventAt!: string;

  @ApiPropertyOptional({ enum: LicitacaoStatus, example: LicitacaoStatus.DRAFT })
  oldStatus?: LicitacaoStatus;

  @ApiPropertyOptional({ enum: LicitacaoStatus, example: LicitacaoStatus.OPEN })
  newStatus?: LicitacaoStatus;

  @ApiPropertyOptional({ example: 'Licitação publicada no portal' })
  description?: string;

  @ApiProperty({ example: 'uuid' })
  createdById!: string;
}
