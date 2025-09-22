import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PageQuery {
  @ApiPropertyOptional({ default: 1 }) @IsInt() @Min(1) @IsOptional() page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsInt() @Min(1) @IsOptional() pageSize?: number = 20;
  @ApiPropertyOptional() @IsString() @IsOptional() q?: string;
  @ApiPropertyOptional({ enum: ['asc','desc'] }) @IsIn(['asc','desc']) @IsOptional() order?: 'asc'|'desc' = 'desc';
}
