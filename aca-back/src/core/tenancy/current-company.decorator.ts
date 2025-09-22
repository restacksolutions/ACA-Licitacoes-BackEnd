import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentCompany = createParamDecorator((_d, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.companyId as string;
});
