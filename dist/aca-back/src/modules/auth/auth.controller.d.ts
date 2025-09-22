import { AuthService } from './auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
export declare class AuthController {
    private readonly svc;
    constructor(svc: AuthService);
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    me(user: {
        authUserId: string;
    }): Promise<{
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
