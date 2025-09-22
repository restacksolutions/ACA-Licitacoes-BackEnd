import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ArgonAdapter } from '../../adapters/hashing/argon.adapter';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
export declare class AuthService {
    private prisma;
    private argon;
    private configService;
    constructor(prisma: PrismaService, argon: ArgonAdapter, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshDto: RefreshDto): Promise<AuthResponseDto>;
    me(userId: string): Promise<UserResponseDto>;
    private generateTokens;
    private parseExpirationTime;
}
