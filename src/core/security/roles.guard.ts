import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { RoleCompany } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleCompany[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const membership = request.membership;
    
    if (!membership) {
      throw new ForbiddenException('User is not a member of this company');
    }
    
    const hasRole = requiredRoles.some((role) => membership.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }
    
    return true;
  }
}
