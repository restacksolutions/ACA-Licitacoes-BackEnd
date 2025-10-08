import { createParamDecorator, ExecutionContext } from '@nestjs/common';
interface RequestWithUser extends Request {
  user?: Record<string, unknown>;
}

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (!req.user) {
      return undefined;
    }
    return data ? req.user[data] : req.user;
  },
);
