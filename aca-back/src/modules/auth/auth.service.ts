import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SupabaseAuthService } from '../../core/auth/supabase-auth.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabaseAuth: SupabaseAuthService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const authResult = await this.supabaseAuth.login(loginDto.email, loginDto.password);
    
    // Verifica se o usuário existe no banco local, se não, cria
    let user = await this.prisma.appUser.findUnique({
      where: { authUserId: authResult.user_id },
    });

    if (!user) {
      // Cria o usuário no banco local se não existir
      user = await this.prisma.appUser.create({
        data: {
          authUserId: authResult.user_id,
          email: authResult.email,
          fullName: authResult.email.split('@')[0], // Nome padrão baseado no email
        },
      });
    }

    return authResult;
  }

  async me(authUserId: string) {
    const user = await this.prisma.appUser.findUnique({
      where: { authUserId },
      include: {
        memberships: {
          include: { company: true },
        },
      },
    });
    // pode acontecer do back ainda não ter espelhado o user; trate como preferir
    return user;
  }
}
