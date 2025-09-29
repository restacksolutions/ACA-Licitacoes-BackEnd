import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ActiveCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.activeCompany;
  },
);

export const ActiveMembership = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.activeMembership;
  },
);
