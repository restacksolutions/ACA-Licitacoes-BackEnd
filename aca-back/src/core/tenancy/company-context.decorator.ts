import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CompanyContext {
  userId: string;
  authUserId: string;
  companies: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  activeCompany: {
    id: string;
    name: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  activeMembership: {
    id: string;
    companyId: string;
    userId: string;
    role: string;
  };
}

export const CompanyContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CompanyContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.companyContext;
  },
);

export const ActiveCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.companyContext?.activeCompany;
  },
);

export const ActiveMembership = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.companyContext?.activeMembership;
  },
);

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.companyContext?.userId;
  },
);
