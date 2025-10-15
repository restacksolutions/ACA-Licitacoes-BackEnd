import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../common/utils/prisma.service';
import {
  CreateBrandDto,
  UpdateBrandDto,
  CreateModelDto,
  UpdateModelDto,
} from './dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  // ===== Brands =====
  listBrands(search?: string) {
    return this.prisma.carBrand.findMany({
      where: {
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      orderBy: { name: 'asc' },
    });
  }

  async getBrand(id: string) {
    const b = await this.prisma.carBrand.findUnique({ where: { id } });
    if (!b) throw new NotFoundException('Brand not found');
    return b;
  }

  async createBrand(dto: CreateBrandDto) {
    try {
      return await this.prisma.carBrand.create({ data: { name: dto.name } });
    } catch (e: unknown) {
      if (
        e &&
        typeof e === 'object' &&
        'code' in e &&
        String(e.code) === 'P2002'
      )
        throw new BadRequestException('Brand name already exists');
      throw e;
    }
  }

  async updateBrand(id: string, dto: UpdateBrandDto) {
    await this.getBrand(id);
    return this.prisma.carBrand.update({ where: { id }, data: dto });
  }

  async deleteBrand(id: string) {
    // opcional: bloquear se houver modelos
    const count = await this.prisma.vehicleModel.count({
      where: { brandId: id },
    });
    if (count > 0)
      throw new BadRequestException('Cannot delete brand with models');
    return this.prisma.carBrand.delete({ where: { id } });
  }

  // ===== Models =====
  listModels(params: {
    brandId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { brandId, search, page = 1, limit = 20 } = params;
    const skip = (page - 1) * limit;
    return this.prisma.vehicleModel.findMany({
      where: {
        brandId: brandId || undefined,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              {
                specs: {
                  path: ['category'],
                  string_contains: search,
                  mode: 'insensitive',
                },
              },
            ]
          : undefined,
      },
      orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
      skip,
      take: limit,
      include: { brand: true },
    });
  }

  async getModel(id: string) {
    const m = await this.prisma.vehicleModel.findUnique({
      where: { id },
      include: { brand: true },
    });
    if (!m) throw new NotFoundException('Model not found');
    return m;
  }

  async createModel(dto: CreateModelDto) {
    // valida a marca
    const brand = await this.prisma.carBrand.findUnique({
      where: { id: dto.brandId },
    });
    if (!brand) throw new BadRequestException('Brand does not exist');
    return this.prisma.vehicleModel.create({
      data: { brandId: dto.brandId, name: dto.name, specs: dto.specs ?? {} },
    });
  }

  async updateModel(id: string, dto: UpdateModelDto) {
    if (dto.brandId) {
      const brand = await this.prisma.carBrand.findUnique({
        where: { id: dto.brandId },
      });
      if (!brand) throw new BadRequestException('Brand does not exist');
    }
    await this.getModel(id);
    return this.prisma.vehicleModel.update({ where: { id }, data: dto });
  }

  async deleteModel(id: string) {
    await this.getModel(id);
    return this.prisma.vehicleModel.delete({ where: { id } });
  }
}
