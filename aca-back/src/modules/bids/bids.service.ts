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
    return this.prisma.licitacao.create({ data: { companyId, ...dto } });
  }

  async get(companyId: string, bidId: string) {
    const b = await this.prisma.licitacao.findFirst({ where: { id: bidId, companyId } });
    if (!b) throw new NotFoundException('Licitação não encontrada');
    return b;
  }

  update(companyId: string, bidId: string, dto: Partial<CreateBidDto>) {
    return this.prisma.licitacao.update({ where: { id: bidId }, data: dto });
  }

  remove(bidId: string) {
    return this.prisma.licitacao.delete({ where: { id: bidId } });
  }
}
