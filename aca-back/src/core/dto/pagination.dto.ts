import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @ApiPropertyOptional({ 
    example: 1, 
    minimum: 1,
    description: 'Número da página (começando em 1)' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    example: 20, 
    minimum: 1, 
    maximum: 100,
    description: 'Itens por página' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  perPage?: number = 20;

  @ApiPropertyOptional({ 
    example: 'createdAt',
    description: 'Campo para ordenação' 
  })
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @ApiPropertyOptional({ 
    enum: SortOrder,
    example: SortOrder.DESC,
    description: 'Direção da ordenação' 
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}

export class CompanyFilterDto extends PaginationDto {
  @ApiPropertyOptional({ 
    example: 'uuid-da-empresa',
    description: 'ID da empresa para filtrar recursos' 
  })
  @IsOptional()
  @IsString()
  companyId?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
