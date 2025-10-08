import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CompanyGuard } from '../../common/guards/company.guard';
import { requireOwner } from '../../common/utils/roles.util';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { sub: string; email: string };
  companyId?: string;
  membership?: { role: string; [key: string]: any };
}

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAccessGuard)
@ApiBearerAuth('access')
export class CompaniesController {
  constructor(private service: CompaniesService) {}

  // Lista empresas onde o usuário tem membership
  @Get()
  @ApiOperation({ summary: 'Listar empresas do usuário' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Termo de busca por nome da empresa',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas retornada com sucesso',
  })
  list(@Req() req: RequestWithUser, @Query('search') search?: string) {
    return this.service.listByUser(req.user.sub, search);
  }

  // Cria nova empresa e torna o usuário atual owner
  @Post()
  @ApiOperation({ summary: 'Criar nova empresa' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Req() req: RequestWithUser, @Body() dto: CreateCompanyDto) {
    return this.service.createAndOwn(req.user.sub, dto);
  }

  // Leitura de uma empresa específica dentro do escopo
  @Get(':id')
  @UseGuards(CompanyGuard)
  @ApiOperation({ summary: 'Obter empresa por ID' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  getOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.service.getByIdForUser(id, req.user.sub);
  }

  // Atualização restrita a owner/admin (usaremos owner no MVP)
  @Patch(':id')
  @UseGuards(CompanyGuard)
  @ApiOperation({ summary: 'Atualizar empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  @ApiResponse({ status: 403, description: 'Apenas owner pode atualizar' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    requireOwner(req); // troque por requireAdminOrOwner(req) se desejar
    return this.service.update(req.companyId!, dto);
  }

  // Exclusão: apenas owner
  @Delete(':id')
  @UseGuards(CompanyGuard)
  @ApiOperation({ summary: 'Excluir empresa' })
  @ApiParam({ name: 'id', description: 'ID da empresa' })
  @ApiResponse({ status: 200, description: 'Empresa excluída com sucesso' })
  @ApiResponse({ status: 403, description: 'Apenas owner pode excluir' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  remove(@Req() req: RequestWithUser) {
    requireOwner(req);
    return this.service.remove(req.companyId!);
  }
}
