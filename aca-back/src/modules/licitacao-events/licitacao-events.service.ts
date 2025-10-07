import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ChangeStatusDto, LicitacaoEventResponseDto } from './dto/licitacao-event.dto';
import { LicitacaoStatus } from '../bids/dto/licitacao.dto';

@Injectable()
export class LicitacaoEventsService {
  constructor(private prisma: PrismaService) {}

  async getEvents(companyId: string, licitacaoId: string): Promise<LicitacaoEventResponseDto[]> {
    // Verificar se a licitação pertence à empresa
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id: licitacaoId, companyId },
    });

    if (!licitacao) {
      throw new NotFoundException('Licitação não encontrada');
    }

    const events = await this.prisma.licitacaoEvent.findMany({
      where: { licitacaoId },
      orderBy: { eventDate: 'desc' },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return events.map(event => ({
      id: event.id,
      eventAt: event.eventDate.toISOString(),
      oldStatus: event.oldStatus as any || undefined,
      newStatus: event.newStatus as any || undefined,
      description: event.description || undefined,
      createdById: event.createdById || '',
    }));
  }

  async changeStatus(
    companyId: string, 
    licitacaoId: string, 
    dto: ChangeStatusDto,
    userId?: string
  ) {
    // Verificar se a licitação pertence à empresa
    const licitacao = await this.prisma.licitacao.findFirst({
      where: { id: licitacaoId, companyId },
    });

    if (!licitacao) {
      throw new NotFoundException('Licitação não encontrada');
    }

    const oldStatus = licitacao.status as LicitacaoStatus;
    const newStatus = dto.newStatus;

    // Validar transição de status
    if (!this.isValidStatusTransition(oldStatus, newStatus)) {
      throw new ForbiddenException(`Transição de status de ${oldStatus} para ${newStatus} não é permitida`);
    }

    // Atualizar status da licitação e criar evento em uma transação
    const result = await this.prisma.$transaction(async (tx) => {
      // Atualizar licitação
      const updatedLicitacao = await tx.licitacao.update({
        where: { id: licitacaoId },
        data: { status: newStatus as any },
      });

      // Criar evento
      const event = await tx.licitacaoEvent.create({
        data: {
          licitacaoId,
          title: `Status alterado de ${oldStatus} para ${newStatus}`,
          eventDate: new Date(),
          oldStatus: oldStatus as any,
          newStatus: newStatus as any,
          description: dto.description || `Status alterado de ${oldStatus} para ${newStatus}`,
          createdById: userId,
        },
      });

      return { licitacao: updatedLicitacao, event };
    });

    return {
      id: result.licitacao.id,
      status: result.licitacao.status,
      eventId: result.event.id,
    };
  }

  private isValidStatusTransition(oldStatus: LicitacaoStatus, newStatus: LicitacaoStatus): boolean {
    const validTransitions: Record<LicitacaoStatus, LicitacaoStatus[]> = {
      [LicitacaoStatus.DRAFT]: [LicitacaoStatus.OPEN, LicitacaoStatus.CANCELLED],
      [LicitacaoStatus.OPEN]: [LicitacaoStatus.CLOSED, LicitacaoStatus.CANCELLED],
      [LicitacaoStatus.CLOSED]: [LicitacaoStatus.AWARDED, LicitacaoStatus.CANCELLED],
      [LicitacaoStatus.CANCELLED]: [], // Não pode sair de cancelado
      [LicitacaoStatus.AWARDED]: [], // Não pode sair de adjudicado
    };

    return validTransitions[oldStatus]?.includes(newStatus) || false;
  }
}
