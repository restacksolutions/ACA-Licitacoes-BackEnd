import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/security/jwt-auth.guard';
import { CompanyGuard } from '../../core/tenancy/company.guard';
import { RolesGuard } from '../../core/security/roles.guard';
import { Roles } from '../../core/security/roles.decorator';
import { BidsService } from './bids.service';
import { CreateBidDto, UpdateBidDto, BidResponseDto } from './dto/bid.dto';

@ApiTags('Bids')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard, CompanyGuard)
@Controller('companies/:companyId/bids')
export class BidsController {
  constructor(private readonly svc: BidsService) {}

  @Get()
  list(@Param('companyId') companyId: string) {
    return this.svc.list(companyId);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Post()
  create(@Param('companyId') companyId: string, @Body() dto: CreateBidDto) {
    return this.svc.create(companyId, dto);
  }

  @Get(':bidId')
  get(@Param('companyId') companyId: string, @Param('bidId') bidId: string) {
    return this.svc.get(companyId, bidId);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Patch(':bidId')
  update(@Param('companyId') companyId: string, @Param('bidId') bidId: string, @Body() dto: Partial<CreateBidDto>) {
    return this.svc.update(companyId, bidId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('owner','admin')
  @Delete(':bidId')
  remove(@Param('bidId') bidId: string) {
    return this.svc.remove(bidId);
  }
}
