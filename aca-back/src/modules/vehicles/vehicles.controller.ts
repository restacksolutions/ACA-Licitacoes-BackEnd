import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import {
  CreateBrandDto,
  UpdateBrandDto,
  CreateModelDto,
  UpdateModelDto,
} from './dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { requireAdminOrOwner } from '../../common/utils/roles.util';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { sub: string; email: string };
  membership?: { role: string; [key: string]: any };
}

@Controller('vehicles')
@UseGuards(JwtAccessGuard)
export class VehiclesController {
  constructor(private service: VehiclesService) {}

  // ===== Brands =====
  @Get('brands')
  listBrands(@Query('search') search?: string) {
    return this.service.listBrands(search);
  }

  @Get('brands/:id')
  getBrand(@Param('id') id: string) {
    return this.service.getBrand(id);
  }

  @Post('brands')
  createBrand(@Req() req: AuthenticatedRequest, @Body() dto: CreateBrandDto) {
    requireAdminOrOwner(req);
    return this.service.createBrand(dto);
  }

  @Patch('brands/:id')
  updateBrand(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateBrandDto,
  ) {
    requireAdminOrOwner(req);
    return this.service.updateBrand(id, dto);
  }

  @Delete('brands/:id')
  deleteBrand(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    requireAdminOrOwner(req);
    return this.service.deleteBrand(id);
  }

  // ===== Models =====
  @Get('models')
  listModels(
    @Query('brandId') brandId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listModels({
      brandId,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('models/:id')
  getModel(@Param('id') id: string) {
    return this.service.getModel(id);
  }

  @Post('models')
  createModel(@Req() req: AuthenticatedRequest, @Body() dto: CreateModelDto) {
    requireAdminOrOwner(req);
    return this.service.createModel(dto);
  }

  @Patch('models/:id')
  updateModel(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateModelDto,
  ) {
    requireAdminOrOwner(req);
    return this.service.updateModel(id, dto);
  }

  @Delete('models/:id')
  deleteModel(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    requireAdminOrOwner(req);
    return this.service.deleteModel(id);
  }
}
