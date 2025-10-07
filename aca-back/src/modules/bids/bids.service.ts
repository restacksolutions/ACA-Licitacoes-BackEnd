import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateBidDto } from './dto/bid.dto';

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  list(companyId: string) {
    return this.prisma.licitacao.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
  }

  create(companyId: string, dto: CreateBidDto) {
    const data = {
      ...dto,
      companyId,
      saleValue: dto.saleValue ? parseFloat(dto.saleValue) : null,
      status: dto.status || 'DRAFT' as any
    };
    return this.prisma.licitacao.create({ data });
  }

  async get(companyId: string, bidId: string) {
    const b = await this.prisma.licitacao.findFirst({ where: { id: bidId, companyId } });
    if (!b) throw new NotFoundException('Licitação não encontrada');
    return b;
  }

  update(companyId: string, bidId: string, dto: Partial<CreateBidDto>) {
    const data = {
      ...dto,
      saleValue: dto.saleValue ? parseFloat(dto.saleValue) : undefined,
      status: dto.status as any
    };
    return this.prisma.licitacao.update({ where: { id: bidId }, data });
  }

  remove(bidId: string) {
    return this.prisma.licitacao.delete({ where: { id: bidId } });
  }
}
