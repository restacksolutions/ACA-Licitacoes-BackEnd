import { PrismaService } from '../../core/prisma/prisma.service';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
export declare class AuthService {
    private prisma;
    private supabaseAuth;
    constructor(prisma: PrismaService, supabaseAuth: SupabaseAuthService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
    me(authUserId: string): Promise<{
        memberships: ({
            company: {
                name: string;
                id: string;
                createdAt: Date;
                cnpj: string | null;
                phone: string | null;
                address: string | null;
                logoPath: string | null;
                letterheadPath: string | null;
                active: boolean;
                createdById: string;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.RoleCompany;
            companyId: string;
            userId: string;
        })[];
    } & {
        email: string | null;
        fullName: string | null;
        id: string;
        authUserId: string;
        createdAt: Date;
    }>;
}
