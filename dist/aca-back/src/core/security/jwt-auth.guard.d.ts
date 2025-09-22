import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtStrategy } from './jwt.strategy';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwt;
    private readonly reflector;
    constructor(jwt: JwtStrategy, reflector: Reflector);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
