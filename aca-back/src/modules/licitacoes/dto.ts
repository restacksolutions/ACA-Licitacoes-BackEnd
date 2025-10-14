import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

export enum LicStatus {
  draft = 'draft',
  open = 'open',
  closed = 'closed',
  cancelled = 'cancelled',
  awarded = 'awarded',
}

export class CreateLicitacaoDto {
  @IsNotEmpty() title: string;
  @IsEnum(LicStatus) status: LicStatus;
  @IsOptional() @IsUrl() editalUrl?: string; // opcional (se não houver upload)
  @IsOptional() @IsDateString() sessionDate?: string;
  @IsOptional() @IsDateString() submissionDeadline?: string;
}

export class UpdateLicitacaoDto {
  @IsOptional() title?: string;
  @IsOptional() @IsEnum(LicStatus) status?: LicStatus;
  @IsOptional() @IsUrl() editalUrl?: string;
  @IsOptional() @IsDateString() sessionDate?: string;
  @IsOptional() @IsDateString() submissionDeadline?: string;
}

export class CreateLicDocDto {
  @IsNotEmpty() name: string;
  @IsOptional() docType?: string;
  @IsOptional() required?: boolean; // default true
  @IsOptional() submitted?: boolean; // marcado como true ao enviar arquivo
  @IsOptional() signed?: boolean;
  @IsOptional() @IsDateString() issueDate?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
  @IsOptional() notes?: string;
}

export class UpdateLicDocDto extends CreateLicDocDto {}

export class CreateLicEventDto {
  @IsNotEmpty() type: string; // ex: status_changed | note | deadline_update
  @IsNotEmpty() payload: any; // JSON arbitrário
}
