# 🔧 ACA Licitações Backend

Backend API do sistema de licitações desenvolvido em **NestJS + Prisma + PostgreSQL**.

## 🚀 Quick Start

### Com Docker (Recomendado)

```bash
# 1. Iniciar banco de dados
cd aca-database
docker-compose up -d

# 2. Iniciar backend
cd ../aca-back
docker-compose up -d

# 3. Verificar logs
docker-compose logs -f
```

### Desenvolvimento Local

```bash
# 1. Instalar dependências
cd aca-back
npm install

# 2. Configurar banco (PostgreSQL rodando)
# Ajustar DATABASE_URL no .env

# 3. Executar migrações
npx prisma migrate dev

# 4. Iniciar em modo desenvolvimento
npm run start:dev
```

## 📁 Estrutura

```
aca-back/
├── src/
│   ├── core/                    # Módulos core
│   │   ├── config/             # Configuração e validação
│   │   ├── prisma/             # Cliente Prisma
│   │   ├── security/           # JWT, guards, decorators
│   │   └── tenancy/            # Multi-tenancy
│   ├── adapters/               # Adapters externos
│   └── modules/                # Módulos de domínio
│       ├── auth/               # Autenticação
│       ├── users/              # Usuários
│       ├── companies/          # Empresas
│       ├── members/            # Membros
│       ├── documents/          # Documentos
│       ├── bids/               # Propostas
│       └── workflow/           # Workflow
├── prisma/                     # Schema e migrações
├── Dockerfile                  # Container do backend
└── docker-compose.yml         # Backend + banco
```

## 🔐 Autenticação

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/v1/auth/register` | Cadastrar usuário + empresa |
| POST | `/v1/auth/login` | Login |
| POST | `/v1/auth/refresh` | Renovar tokens |
| GET | `/v1/auth/me` | Dados do usuário |

### Exemplo de Uso

```bash
# Register
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "João Silva",
    "email": "joao@example.com",
    "password": "Senha123",
    "company": {
      "name": "Empresa do João",
      "cnpj": "00.000.000/0001-00"
    }
  }'

# Login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "Senha123"
  }'
```

## 🗄️ Banco de Dados

### Schema Principal

```prisma
model AppUser {
  id           String   @id @default(uuid())
  fullName     String?
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  createdCompanies Company[] @relation("CompanyCreatedBy")
  memberships      CompanyMember[]
}

model Company {
  id             String   @id @default(uuid())
  name           String
  cnpj           String?  @unique
  phone          String?
  address        String?
  active         Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  createdById String   @map("created_by")
  createdBy   AppUser  @relation("CompanyCreatedBy", fields: [createdById], references: [id])
  members     CompanyMember[]
  documents   CompanyDocument[]
  licitacoes Licitacao[]
}
```

### Comandos Prisma

```bash
# Gerar cliente
npx prisma generate

# Migração de desenvolvimento
npx prisma migrate dev

# Deploy em produção
npx prisma migrate deploy

# Prisma Studio
npx prisma studio

# Reset do banco
npx prisma migrate reset
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://aca_user:aca_password@postgres:5432/aca_licitacoes?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
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

# Testes
npm run test
npm run test:e2e

# Linting
npm run lint
npm run format
```

## 🐳 Docker

### Build e Run

```bash
# Build da imagem
docker build -t aca-backend .

# Executar container
docker run -p 3000:3000 aca-backend

# Com docker-compose
docker-compose up -d
```

### Health Check

```bash
# Verificar saúde da API
curl http://localhost:3000/health

# Logs do container
docker-compose logs -f aca-backend
```

## 🛡️ Segurança

### Validações

- **Senhas**: Mínimo 8 caracteres, hash com Argon2
- **Email**: Formato válido, único no sistema
- **CNPJ**: Formato 00.000.000/0001-00
- **JWT**: Access token (15m) + Refresh token (7d)

### Guards

- **JwtAuthGuard**: Valida JWT token
- **CompanyGuard**: Valida membership na empresa
- **RolesGuard**: Controla permissões por role

### Permissões

| Role | Criar Empresa | Gerenciar Membros | Editar Empresa |
|------|---------------|-------------------|----------------|
| owner | ✅ | ✅ | ✅ |
| admin | ❌ | ✅ | ✅ |
| member | ❌ | ❌ | ❌ |

## 📚 API Documentation

- **Swagger UI**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🚀 Deploy

### Produção

```bash
# 1. Build
npm run build

# 2. Executar migrações
npx prisma migrate deploy

# 3. Iniciar
npm run start:prod
```

### Docker

```bash
# Build para produção
docker build -t aca-backend:prod .

# Deploy
docker run -d -p 3000:3000 aca-backend:prod
```

---

**Desenvolvido com ❤️ pela equipe RESTACK**