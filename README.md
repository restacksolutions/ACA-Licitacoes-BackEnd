# 🔧 ACA Licitações Backend API

Sistema de licitações multi-tenant com autenticação JWT local, desenvolvido em **NestJS + Prisma + PostgreSQL**.

## 🚀 Quick Start

### 1. Subir a infraestrutura

```bash
# Subir PostgreSQL e Adminer
docker compose up -d

# Verificar se os containers estão rodando
docker compose ps
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar banco de dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev -n auth_register

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

### 4. Executar aplicação

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

## 📚 Documentação

- **API Docs**: http://localhost:3000/docs
- **Adminer**: http://localhost:8080 (PostgreSQL admin)

## 🏗️ Arquitetura

### Estrutura do Projeto

```
src/
├── core/                    # Módulos core
│   ├── config/             # Configuração e validação de env
│   ├── prisma/             # Cliente Prisma singleton
│   ├── security/           # JWT, guards, decorators
│   └── tenancy/            # Multi-tenancy (CompanyGuard)
├── adapters/               # Adapters externos
│   └── hashing/            # Argon2 para hash de senhas
└── modules/                # Módulos de domínio
    ├── auth/               # Autenticação (register, login, refresh)
    ├── users/              # Gestão de usuários
    ├── companies/          # Gestão de empresas
    └── members/            # Gestão de membros
```

### Fluxo de Autenticação

1. **Register**: Cria usuário + empresa + membership (owner)
2. **Login**: Valida credenciais e retorna JWT tokens
3. **Refresh**: Renova tokens usando refresh token
4. **Guards**: Protegem rotas com JWT + Company + Roles

### Multi-tenancy

- **CompanyGuard**: Valida se usuário é membro da empresa
- **RolesGuard**: Controla permissões por role (owner/admin/member)
- **Rotas**: Padrão `/companies/:companyId/...`

## 🔐 Autenticação

### Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Cadastrar usuário + empresa | ❌ |
| POST | `/auth/login` | Login com email/senha | ❌ |
| POST | `/auth/refresh` | Renovar tokens | ❌ |
| GET | `/auth/me` | Dados do usuário logado | ✅ |

### Exemplo de Register

```json
POST /v1/auth/register
{
  "fullName": "João Silva",
  "email": "joao@example.com",
  "password": "Senha123",
  "company": {
    "name": "Empresa do João",
    "cnpj": "00.000.000/0001-00",
    "phone": "11 99999-9999",
    "address": "Rua das Flores, 123"
  }
}
```

**Resposta (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_expires_at": "2025-09-23T21:28:56.693Z",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_expires_at": "2025-09-30T21:28:56.693Z",
  "user": {
    "id": "uuid",
    "fullName": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2025-09-22T20:30:00.000Z"
  },
  "company": {
    "id": "uuid",
    "name": "Empresa do João",
    "cnpj": "00.000.000/0001-00",
    "active": true,
    "createdAt": "2025-09-22T20:30:00.000Z"
  },
  "membership": {
    "id": "uuid",
    "role": "owner"
  }
}
```

### Exemplo de Login

```json
POST /v1/auth/login
{
  "email": "joao@example.com",
  "password": "Senha123"
}
```

**Resposta (200):** Mesmo formato do register

### Exemplo de Refresh

```json
POST /v1/auth/refresh
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Exemplo de Me

```bash
GET /v1/auth/me
Authorization: Bearer <access_token>
```

**Resposta (200):**
```json
{
  "id": "uuid",
  "fullName": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2025-09-22T20:30:00.000Z"
}
```

## 🏢 Gestão de Empresas

### Endpoints

| Método | Endpoint | Descrição | Auth | Roles |
|--------|----------|-----------|------|-------|
| GET | `/companies/:id` | Detalhes da empresa | ✅ | - |
| PATCH | `/companies/:id` | Atualizar empresa | ✅ | owner, admin |

### Exemplo de Atualização

```json
PATCH /v1/companies/{companyId}
Authorization: Bearer <token>
{
  "name": "Nova Empresa",
  "phone": "(11) 88888-8888",
  "active": true
}
```

## 👥 Gestão de Membros

### Endpoints

| Método | Endpoint | Descrição | Auth | Roles |
|--------|----------|-----------|------|-------|
| GET | `/companies/:id/members` | Listar membros | ✅ | - |
| POST | `/companies/:id/members` | Convidar membro | ✅ | owner, admin |
| PATCH | `/companies/:id/members/:id` | Alterar role | ✅ | owner, admin |
| DELETE | `/companies/:id/members/:id` | Remover membro | ✅ | owner, admin |

### Exemplo de Convite

```json
POST /v1/companies/{companyId}/members
Authorization: Bearer <token>
{
  "email": "newuser@example.com",
  "role": "member"
}
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aca?schema=public

# JWT Secrets
JWT_ACCESS_SECRET=dev_access_secret_change_me
JWT_REFRESH_SECRET=dev_refresh_secret_change_me
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Swagger
SWAGGER_TITLE=ACA Licitações API
SWAGGER_VERSION=1.0
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Prisma
npm run prisma:generate    # Gerar cliente
npm run prisma:migrate     # Executar migrações
npm run prisma:deploy      # Deploy migrações
npm run prisma:studio      # Interface visual
npm run prisma:reset       # Reset banco
```

## 🗄️ Banco de Dados

### Modelos Principais

- **AppUser**: Usuários do sistema
- **Company**: Empresas (multi-tenant)
- **CompanyMember**: Relacionamento usuário-empresa
- **CompanyDocument**: Documentos da empresa
- **Licitacao**: Licitações
- **LicitacaoDocument**: Documentos de licitação
- **LicitacaoEvent**: Eventos/histórico

### Enums

- **RoleCompany**: `owner`, `admin`, `member`
- **LicitacaoStatus**: `draft`, `open`, `closed`, `cancelled`, `awarded`
- **CompanyDocType**: `cnpj`, `certidao`, `procuracao`, `outro`
- **LicitacaoDocType**: `proposta`, `habilitacao`, `contrato`, `outro`

### Constraints Importantes

```sql
-- Um usuário só pode criar/possuir uma empresa
-- Para desativar esta constraint e permitir múltiplas empresas por usuário:
-- 1. Comente a linha @@unique([createdById]) em schema.prisma
-- 2. Execute: npx prisma migrate dev
@@unique([createdById])

-- Um usuário só pode ser membro de uma empresa (opcional)
-- Para ativar esta constraint (1 usuário = 1 empresa):
-- 1. Descomente a linha @@unique([userId]) em schema.prisma
-- 2. Execute: npx prisma migrate dev
-- @@unique([userId])
```

## 🛡️ Segurança

### Validações

- **Senhas**: Mínimo 8 caracteres, pelo menos 1 letra e 1 número, hash com Argon2
- **Email**: Formato válido, único no sistema
- **CNPJ**: Formato 00.000.000/0001-00 ou 14 dígitos
- **JWT**: Access token (15m) + Refresh token (7d) com algoritmo HS256
- **Guards**: JWT + Company + Roles
- **CORS**: Configurado para frontend
- **Helmet**: Headers de segurança

### Permissões

| Role | Criar Empresa | Gerenciar Membros | Editar Empresa |
|------|---------------|-------------------|----------------|
| owner | ✅ | ✅ | ✅ |
| admin | ❌ | ✅ | ✅ |
| member | ❌ | ❌ | ❌ |

## 🧪 Testes

### Teste Manual

1. **Register**:
   ```bash
   curl -X POST http://localhost:3000/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"fullName":"João Silva","email":"joao@example.com","password":"Senha123","company":{"name":"Empresa do João","cnpj":"00.000.000/0001-00"}}'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:3000/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"joao@example.com","password":"Senha123"}'
   ```

3. **Refresh**:
   ```bash
   curl -X POST http://localhost:3000/v1/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refresh_token":"<refresh_token>"}'
   ```

4. **Auth Me**:
   ```bash
   curl -X GET http://localhost:3000/v1/auth/me \
     -H "Authorization: Bearer <access_token>"
   ```

## 🚀 Deploy

### Produção

1. **Configurar variáveis de ambiente**
2. **Executar migrações**: `npx prisma migrate deploy`
3. **Build**: `npm run build`
4. **Start**: `npm run start:prod`

### Docker (Opcional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

## 📝 Próximos Passos

- [ ] Implementar módulos de documentos
- [ ] Implementar módulos de licitações
- [ ] Implementar upload de arquivos
- [ ] Implementar notificações
- [ ] Implementar auditoria
- [ ] Implementar testes automatizados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ pela equipe ACA**
