import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<Array<'owner'|'admin'|'member'>>('roles', ctx.getHandler());
    if (!required || required.length === 0) return true;
    const req = ctx.switchToHttp().getRequest();
    const role = req.membership?.role;
    if (!role || !required.includes(role)) throw new ForbiddenException('Permissão insuficiente');
    return true;
  }
}
