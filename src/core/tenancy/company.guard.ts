import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const companyId = request.params.companyId || request.headers['x-company-id'];
    
    if (!companyId) {
      throw new ForbiddenException('Company ID is required');
    }
    
    if (!user?.userId) {
      throw new ForbiddenException('User not authenticated');
    }
    
    const membership = await this.prisma.companyMember.findUnique({
      where: {
        companyId_userId: {
          companyId,
          userId: user.userId,
        },
      },
      include: {
        company: true,
      },
    });
    
    if (!membership) {
      throw new ForbiddenException('User is not a member of this company');
    }
    
    // Add membership to request for use in other guards
    request.membership = membership;
    
    return true;
  }
}
