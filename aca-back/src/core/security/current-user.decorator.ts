import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export type AuthUser = { authUserId: string; email?: string };
export const CurrentUser = createParamDecorator((_d, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user as AuthUser;
});
