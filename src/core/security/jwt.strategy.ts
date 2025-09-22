import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtVerify } from 'jose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      // Verify token with jose
      const secret = new TextEncoder().encode(
        this.configService.get<string>('JWT_ACCESS_SECRET')
      );
      
      const { payload: verifiedPayload } = await jwtVerify(payload, secret, {
        algorithms: ['HS256'],
      });
      
      return {
        userId: verifiedPayload.sub,
        email: verifiedPayload.email,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
