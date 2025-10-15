import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty() @IsString() name!: string;
}

export class UpdateBrandDto {
  @IsOptional() @IsString() name?: string;
}

export class CreateModelDto {
  @IsNotEmpty() @IsUUID() brandId!: string;
  @IsNotEmpty() @IsString() name!: string;
  @IsOptional() @IsObject() specs?: Record<string, any>;
}

export class UpdateModelDto {
  @IsOptional() @IsUUID() brandId?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsObject() specs?: Record<string, any>;
}
