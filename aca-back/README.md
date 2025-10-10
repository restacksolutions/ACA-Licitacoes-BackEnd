# README – ACA/VV Licitações (Backend)

Backend em **NestJS + Prisma + PostgreSQL + JWT** para gestão de **empresas**, **membros**, **documentos institucionais**, **licitações**, **eventos**, integração com **n8n**, e **upload de arquivos direto no banco** (BYTEA).

> **Stack**: Node 20+, NestJS, Prisma, PostgreSQL 16, JWT/Refresh, Helmet, Rate Limit, Swagger.
> **Armazenamento de arquivos**: em **BYTEA** no banco (sem S3).
> **Ambientes**: dev (Docker local), staging/prod (Railway).

---

## 0) Pré‑requisitos

* **Node.js 20+** (npm incluso)
* **Docker** + **Docker Compose**
* **Git**

> Windows: use **WSL2** + Docker Desktop.
> Linux/macOS: Docker Engine + Compose plugin.

---

## 1) Clonar o projeto

```bash
git clone <seu-repo>.git aca-back
cd aca-back
```

---

## 2) Variáveis de ambiente

Crie o arquivo **.env** (baseado no `.env.example`). Para dev:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aca?schema=public"

# Auth
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

# Upload (limites e tipos)
UPLOAD_MAX_BYTES=10485760
UPLOAD_ALLOWED_MIME=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# n8n Webhooks (opcional)
N8N_WEBHOOK_SECRET=change_me_webhook_secret
N8N_IP_WHITELIST=
```

> **Importante**: nunca comite `.env` no repositório público.

---

## 3) Subir o banco (Docker)

Crie **docker-compose.yml** na raiz (se ainda não existir):

```yaml
version: "3.9"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: aca
    ports: ["5432:5432"]
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

Suba o serviço:

```bash
docker compose up -d
```

---

## 4) Instalar dependências do backend

```bash
npm i
```

Se o projeto ainda não tiver o Prisma inicializado:

```bash
npm i -D prisma
npm i @prisma/client
npx prisma generate
```

---

## 5) Criar o schema e rodar migrations

O repositório inclui **prisma/schema.prisma** com todas as tabelas (incluindo arquivos em BYTEA).

```bash
npx prisma generate
npx prisma migrate dev --name init
```

**Seed opcional:**

```bash
npx ts-node prisma/seed.ts
```

---

## 6) Rodar a API em dev

```bash
npm run start:dev
```

* API: [http://localhost:3000](http://localhost:3000)
* Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)
* Health: [http://localhost:3000/healthz](http://localhost:3000/healthz)

---

## 7) Estrutura de pastas

```
src/
  main.ts                  # bootstrap (helmet, rate limit, cors, swagger)
  app.module.ts
  health/health.controller.ts
  common/
    guards/
      jwt-access.guard.ts
      jwt-refresh.guard.ts
      company.guard.ts
    utils/
      prisma.service.ts
      roles.util.ts
      hash.util.ts
      webhook.util.ts
  modules/
    auth/
      auth.module.ts
      auth.service.ts
      auth.controller.ts
      dto.ts
    companies/
      companies.module.ts
      companies.service.ts
      companies.controller.ts
      dto.ts
    members/
      members.module.ts
      members.service.ts
      members.controller.ts
      dto.ts
    company-docs/
      company-docs.module.ts
      company-docs.service.ts
      company-docs.controller.ts
      company-docs.upload.controller.ts
      dto.ts
    licitacoes/
      licitacoes.module.ts
      licitacoes.service.ts
      licitacoes.controller.ts
      dto.ts
    webhooks/
      webhooks.module.ts
      webhooks.controller.ts
      dto.ts
prisma/
  schema.prisma
  seed.ts (opcional)
```

---

## 8) Fluxos principais

### 8.1 Autenticação (JWT)

* `POST /auth/register` → cria **usuário + empresa + membership (owner)** e retorna `{ accessToken, refreshToken }`
* `POST /auth/login` → retorna tokens
* `POST /auth/refresh` → usar **refresh token** no header `Authorization: Bearer <refresh>`
* `POST /auth/me` (teste) → requer **access token**

**Headers em rotas de domínio**:

* `Authorization: Bearer <access token>`
* `X-Company-Id: <uuid da empresa>` (escopo por empresa)

### 8.2 Empresas

* `GET /companies` – lista empresas do usuário
* `POST /companies` – cria empresa e vincula usuário como `owner`
* `GET /companies/:id` – requer `X-Company-Id`
* `PATCH /companies/:id` – **owner**
* `DELETE /companies/:id` – **owner**

### 8.3 Membros

* `GET /companies/:companyId/members` – lista
* `POST /companies/:companyId/members` – **owner|admin** adiciona (por `userId` ou `userEmail` existente)
* `PATCH /companies/:companyId/members/:memberId/role` – **owner**
* `DELETE /companies/:companyId/members/:memberId` – **owner|admin**

### 8.4 Documentos da Empresa (arquivos no banco)

* `POST /company-docs` – cria metadados (sem arquivo) – **owner|admin**
* `POST /company-docs/upload` – **multipart/form-data** com `file` + campos (cria já com arquivo) – **owner|admin**
* `GET /company-docs` – filtros `status=valid|expiring|expired&inDays=15|7|1|0`
* `GET /company-docs/:id` – detalhe
* `GET /company-docs/:id/file` – **download** do binário
* `PATCH /company-docs/:id` – edita metadados (se trocar `file` use rota de upload dedicada)
* `DELETE /company-docs/:id`

### 8.5 Licitações

* `POST /licitacoes` – cria licitação
* `GET /licitacoes?status=&search=`
* `GET /licitacoes/:id`
* `PATCH /licitacoes/:id`
* `DELETE /licitacoes/:id`
* `GET /licitacoes/:id/documents` – lista documentos da licitação
* `POST /licitacoes/:id/documents` – adiciona doc (metadados)
* `POST /licitacoes/:id/documents/upload` – **multipart** com `file` (se implementado)
* `PATCH /licitacoes/:id/documents/:docId`
* `DELETE /licitacoes/:id/documents/:docId`
* `GET /licitacoes/:id/events` – lista eventos
* `POST /licitacoes/:id/events` – cria evento
* `GET /licitacoes/:id/summary` – retorna `{ total, required, submitted, signed, coveragePercent }`

### 8.6 Webhooks n8n (opcional)

* **Assinatura HMAC** (`X-Webhook-Signature`) com **N8N_WEBHOOK_SECRET**.
* `POST /webhooks/edital/analyze`
  Body: `{ input:{ licitacaoId, editalUrl? }, output:{ requiredDocs:[], vehicleHints:[] } }`
  A API salva `licitacao_documents` e um *event* com `vehicle_hints`.
* `POST /webhooks/company-docs/notify` (log opcional)

---

## 9) Exemplos rápidos (cURL)

### 9.1 Register → Login → Me

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Secret123!","companyName":"Minha Empresa","cnpj":"00.000.000/0001-00"}'

# guarde access/refresh
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Secret123!"}'

curl -X POST http://localhost:3000/auth/me \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

### 9.2 Criar documento com upload (arquivo no banco)

```bash
curl -X POST http://localhost:3000/company-docs/upload \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "X-Company-Id: <COMPANY_ID>" \
  -F clientName="Acme Ltda" -F docType="Certidao" -F file=@./certidao.pdf
```

### 9.3 Consultar vencimentos (para n8n)

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" -H "X-Company-Id: <COMPANY_ID>" \
  "http://localhost:3000/company-docs?status=expiring&inDays=15"
```

---

## 10) Segurança

* **JWT**: access (15min), refresh (7d). Use HTTPS em prod.
* **Headers**: sempre envie `X-Company-Id` em rotas de domínio; o backend valida membership.
* **Rate limit**: aplicado globalmente (300 req/min). Ajuste no `main.ts`.
* **Helmet & CORS**: habilitados; configure a *origin* do seu frontend.
* **Upload**: whitelist de MIME e tamanho máximo (`UPLOAD_*`).
* **Webhooks**: HMAC obrigatório + whitelist de IP (opcional).

---

## 11) Build e execução em produção

### 11.1 Build

```bash
npm run build
```

Gera `dist/`. Execute com Node (ou PM2/Docker).

### 11.2 Execução (Node)

```bash
NODE_ENV=production node dist/main.js
```

### 11.3 Railway (resumo)

1. Crie um projeto no Railway e adicione um **PostgreSQL** gerenciado.
2. Configure as **variáveis de ambiente** (as mesmas do `.env`, ajustando `DATABASE_URL`).
3. Conecte o repositório GitHub e habilite deploy automático.
4. Defina comando start: `node dist/main.js` (build na pipeline: `npm ci && npm run build`).

> Em prod, aumente limites de upload com cuidado; monitore crescimento do banco.

---

## 12) Testes e qualidade

* Adicione **unit/integration/e2e** (Pactum/Playwright) progressivamente.
* Husky + lint-staged (opcional) para padronizar commits.
* **Swagger** já expõe contratos de API; exporte coleção para Postman se desejar.

---

## 13) Troubleshooting

* **Prisma: P1001 (cannot reach database)** → verifique se o container `db` está up em `docker compose ps` e a porta 5432 livre.
* **Porta 3000 ocupada** → altere `PORT` no `.env` ou pare o serviço conflitando.
* **Migrations falham** → apague o volume `db_data` (atenção: **perde dados**) e re‑suba; ou corrija o schema/migrations.
* **Uploads grandes** → aumente `UPLOAD_MAX_BYTES` e ajuste *reverse proxy* (Nginx) se houver.

---

## 14) Roadmap (próximas versões)

* Convites por e‑mail (n8n) e *magic link* de cadastro.
* Auditoria completa (`created_by/updated_by`) em todas as entidades.
* RBAC fino por recurso (permissões detalhadas).
* Observabilidade (OpenTelemetry, métricas e tracing).
* Geração de propostas e templates automáticos.
* Particionamento/otimização para grandes volumes de arquivos.

---

## 15) Licença

Defina aqui a licença do repositório (ex.: MIT) e termos de uso.

---

**Pronto!** Com este README você consegue subir o ambiente do zero em uma máquina limpa, entender os módulos, rodar migrations, autenticar, fazer uploads e integrar com n8n.
