import { Controller, Post, Body, Get, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../core/security/public.decorator';
import { SupabaseAuthService } from './supabase-auth.service';
import { UserService } from './user.service';
import { LoginDto, RegisterDto, AuthResponseDto, UserProfileDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('api/v1/auth')
export class AuthNewController {
  constructor(
    private supabaseAuth: SupabaseAuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email ou CNPJ já está em uso' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      // 1. Registrar no Supabase Auth com metadados
      const authResult = await this.supabaseAuth.signUp(
        registerDto.email,
        registerDto.password,
        registerDto.fullName,
        registerDto.companyName
      );

      if (!authResult.user) {
        throw new HttpException('Falha ao criar usuário no Supabase', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // 2. SEMPRE criar usuário no banco local (ou buscar se já existir)
      const user = await this.userService.createUser({
        authUserId: authResult.user.id,
        email: registerDto.email,
        fullName: registerDto.fullName,
      });

      // 3. SEMPRE criar empresa para o usuário
      const company = await this.userService.createCompany({
        name: registerDto.companyName,
        cnpj: registerDto.companyCnpj,
        phone: registerDto.companyPhone,
        address: registerDto.companyAddress,
        createdById: user.id,
      });

      // 4. SEMPRE adicionar usuário como owner da empresa
      await this.userService.addUserToCompany(user.id, company.id, 'owner');

      // 5. Retornar resposta
      return {
        user_id: authResult.user.id,
        email: authResult.user.email!,
        access_token: authResult.session?.access_token || '',
        expires_at: authResult.session?.expires_at ? new Date(authResult.session.expires_at * 1000).toISOString() : '',
        company_id: company.id,
        company_name: company.name,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      if (error.message.includes('User already registered')) {
        throw new HttpException('Email já está em uso', HttpStatus.CONFLICT);
      }
      
      if (error.message.includes('CNPJ já está em uso')) {
        throw new HttpException('CNPJ já está em uso', HttpStatus.CONFLICT);
      }

      throw new HttpException(`Erro interno: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      // 1. Fazer login no Supabase Auth
      const authResult = await this.supabaseAuth.signIn(
        loginDto.email,
        loginDto.password
      );

      if (!authResult.user || !authResult.session) {
        throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
      }

      // 2. SEMPRE garantir que usuário existe no banco local
      let user;
      try {
        user = await this.userService.findUserByAuthId(authResult.user.id);
      } catch (error) {
        // Se usuário não existe no banco local, SEMPRE criar
        user = await this.userService.createUser({
          authUserId: authResult.user.id,
          email: authResult.user.email!,
          fullName: authResult.user.user_metadata?.full_name || authResult.user.email!.split('@')[0],
        });

        // SEMPRE criar empresa padrão para novos usuários
        const company = await this.userService.createCompany({
          name: `Empresa de ${user.fullName}`,
          createdById: user.id,
        });

        await this.userService.addUserToCompany(user.id, company.id, 'owner');
      }

      // 3. Buscar empresa ativa (primeira empresa do usuário)
      const userWithCompanies = await this.userService.getUserWithCompanies(authResult.user.id);
      const activeCompany = userWithCompanies.memberships?.[0]?.company;

      return {
        user_id: authResult.user.id,
        email: authResult.user.email!,
        access_token: authResult.session.access_token,
        expires_at: new Date(authResult.session.expires_at! * 1000).toISOString(),
        company_id: activeCompany?.id,
        company_name: activeCompany?.name,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message.includes('Invalid login credentials')) {
        throw new HttpException('Email ou senha incorretos', HttpStatus.UNAUTHORIZED);
      }

      throw new HttpException(`Erro interno: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Fazer logout' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  async logout() {
    try {
      await this.supabaseAuth.signOut();
      return { message: 'Logout realizado com sucesso' };
    } catch (error) {
      throw new HttpException(`Erro ao fazer logout: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async getProfile(@Request() req): Promise<UserProfileDto> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HttpException('Token de acesso não fornecido', HttpStatus.UNAUTHORIZED);
      }

      const token = authHeader.substring(7);
      const user = await this.supabaseAuth.getUser(token);
      
      if (!user) {
        throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
      }

      const localUser = await this.userService.findUserByAuthId(user.id);

      return {
        id: localUser.id,
        authUserId: localUser.authUserId!,
        fullName: localUser.fullName!,
        email: localUser.email,
        createdAt: localUser.createdAt.toISOString(),
        updatedAt: localUser.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(`Erro ao obter perfil: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
