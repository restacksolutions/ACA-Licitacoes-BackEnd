import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentMembership = createParamDecorator((_d, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.membership as { id: string; role: 'owner'|'admin'|'member' };
});
