import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(ctx: ExecutionContext) {
    const req = ctx
      .switchToHttp()
      .getRequest<{ headers: Record<string, string> }>();
    const auth: unknown = req?.headers?.['authorization'];
    if (typeof auth !== 'string' || !auth.startsWith('Bearer '))
      throw new UnauthorizedException('Missing token');
    const token = auth.slice(7);
    try {
      // refresh usa outro segredo e tem claim type: 'refresh'
      const payload: { sub: string; email: string; type: string } =
        await this.jwt.verifyAsync(token, {
          secret: process.env.JWT_REFRESH_SECRET!,
        });
      if (!payload || payload.type !== 'refresh')
        throw new UnauthorizedException('Not a refresh token');
      (req as Record<string, any>).refresh = payload; // { sub, email, type }
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
