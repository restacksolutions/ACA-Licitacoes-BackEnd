# 📄 API de Documentos da Empresa e Licitações - Guia de Integração Frontend

Este documento contém todas as informações necessárias para integrar as APIs dos módulos de **Documentos da Empresa** e **Licitações** no seu frontend.

## 🔗 Informações Básicas

- **URL Base**: `http://localhost:3000` (desenvolvimento)
- **Swagger**: `http://localhost:3000/docs`
- **Autenticação**: JWT Bearer Token + Company Guard
- **Headers Obrigatórios**: 
  - `Authorization: Bearer <access_token>`
  - `X-Company-Id: <company_id>`

## 🔐 Autenticação

Todas as rotas requerem **dois guards**:
1. **JwtAccessGuard**: Valida o token JWT
2. **CompanyGuard**: Valida se o usuário tem acesso à empresa

**Headers obrigatórios:**
- `Authorization: Bearer <access_token>`
- `X-Company-Id: <company_id>`

> **Nota**: O `CompanyGuard` tenta obter o `companyId` do header `X-Company-Id`, parâmetro da URL ou body da requisição.

### 🔧 Configuração no Swagger

O Swagger está configurado com **autenticação dupla**:

1. **Acesse**: `http://localhost:3000/docs`
2. **Clique em "Authorize"** (botão verde no topo)
3. **Configure duas autenticações**:
   - **access**: Cole seu token JWT
   - **company-id**: Cole o ID da empresa
4. **Clique em "Authorize"** para ambos
5. **Todas as requisições** incluirão automaticamente os headers

**Exemplo de configuração:**
```
access: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
company-id: da6cc36e-b112-4301-ae6d-f824ccf944ad
```

## 📋 Exemplos de Valores no Swagger

O Swagger está configurado com **exemplos de valores** para facilitar os testes:

### 🏛️ Licitações
- **Título**: `"Licitação para Serviços de TI"`
- **Status**: `draft`, `open`, `closed`, `cancelled`, `awarded`
- **URL do Edital**: `"https://example.com/edital.pdf"`
- **Data da Sessão**: `"2024-12-15T14:00:00.000Z"`
- **Prazo de Submissão**: `"2024-12-10T23:59:59.000Z"`

### 📄 Documentos da Licitação
- **Nome**: `"Proposta Técnica"`
- **Tipo**: `"proposta"`
- **Obrigatório**: `true/false`
- **Entregue**: `true/false`
- **Assinado**: `true/false`
- **Observações**: `"Documento obrigatório para participação na licitação"`

### 📝 Eventos da Licitação
- **Tipo**: `status_changed`, `note`, `deadline_update`, `document_added`
- **Payload**: Objeto JSON com `from`, `to`, `reason`

### 📤 Upload de Arquivos
- **Campo "file"**: Seletor de arquivo funcional
- **Tipos permitidos**: PDF, DOC, DOCX
- **Tamanho máximo**: 10MB
- **Validação automática**: Tipo e tamanho

## 🧪 Como Testar no Swagger

### 1. **Configuração Inicial**
1. Acesse `http://localhost:3000/docs`
2. Clique em **"Authorize"** (botão verde)
3. Configure as duas autenticações:
   - **access**: Seu token JWT
   - **company-id**: ID da empresa
4. Clique em **"Authorize"** para ambos

### 2. **Testando Licitações**
1. **Criar Licitação**: Use os exemplos pré-preenchidos
2. **Listar Licitações**: Teste filtros por status e busca
3. **Upload de Arquivo**: Use o seletor de arquivo funcional
4. **Adicionar Eventos**: Teste diferentes tipos de eventos

### 3. **Benefícios dos Exemplos**
- ✅ **Dados realistas** para testes
- ✅ **Validação automática** de tipos
- ✅ **Headers automáticos** em todas as requisições
- ✅ **Interface intuitiva** para upload de arquivos
- ✅ **Códigos de resposta** detalhados

## 📊 Estrutura de Dados

### DTOs Principais

#### CreateCompanyDocDto
```typescript
{
  company_id: string;              // ID da empresa (obrigatório)
  clientName: string;              // Nome do cliente/empresa (obrigatório)
  docType: string;                 // Tipo do documento (obrigatório)
  issueDate?: string;              // Data de emissão (ISO 8601)
  expiresAt?: string;              // Data de expiração (ISO 8601)
  notes?: string;                  // Observações (máx 1000 caracteres)
}
```

#### UpdateCompanyDocDto
```typescript
{
  clientName?: string;             // Nome do cliente/empresa
  docType?: string;                // Tipo do documento
  issueDate?: string;              // Data de emissão (ISO 8601)
  expiresAt?: string;              // Data de expiração (ISO 8601)
  notes?: string;                  // Observações (máx 1000 caracteres)
  version?: number;                // Versão (gerenciada automaticamente)
}
```

### Tipos de Resposta

#### CompanyDocument (Resposta completa)
```typescript
{
  id: string;                      // UUID do documento
  clientName: string;              // Nome do cliente/empresa
  docType: string;                 // Tipo do documento
  issueDate?: string;              // Data de emissão (ISO 8601)
  expiresAt?: string;              // Data de expiração (ISO 8601)
  notes?: string;                  // Observações
  // Campos de arquivo (após upload)
  fileName?: string;               // Nome do arquivo
  fileMime?: string;               // MIME type
  fileSize?: number;               // Tamanho em bytes
  fileSha256?: string;             // Hash SHA256
  version?: number;                // Versão do documento
  companyId: string;               // ID da empresa
  createdAt: string;               // Data de criação (ISO 8601)
  updatedAt: string;               // Data de atualização (ISO 8601)
}
```

#### Documento com Status (Lista)
```typescript
{
  id: string;
  clientName: string;
  docType: string;
  issueDate?: string;
  expiresAt?: string;
  notes?: string;
  fileName?: string;
  fileMime?: string;
  fileSize?: number;
  version?: number;
  status: 'valid' | 'expiring' | 'expired';  // Calculado automaticamente
  daysToExpire?: number;           // Dias para expirar (se aplicável)
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🏛️ APIs de Licitações

> **🔧 Swagger**: Acesse `http://localhost:3000/docs` e navegue até a seção **"Licitações"** para testar todos os endpoints com exemplos pré-preenchidos.

### 📋 Visão Geral do Sistema de Licitações

O sistema de licitações permite gerenciar todo o ciclo de vida de uma licitação, desde a criação até a adjudicação. O fluxo completo inclui:

1. **Criação da Licitação** (status: `draft`)
2. **Adição de Documentos** obrigatórios e opcionais
3. **Publicação** (status: `open`)
4. **Gestão de Eventos** (mudanças de status, notas, prazos)
5. **Upload de Arquivos** pelos participantes
6. **Fechamento** (status: `closed` ou `awarded`)

### 🔄 Fluxo de Implementação Recomendado

#### **Fase 1: Estrutura Básica**
```typescript
// 1. Criar licitação
const licitacao = await createLicitacao({
  title: "Licitação para Serviços de TI",
  status: "draft",
  editalUrl: "https://example.com/edital.pdf",
  sessionDate: "2024-12-15T14:00:00.000Z",
  submissionDeadline: "2024-12-10T23:59:59.000Z"
});

// 2. Adicionar documentos obrigatórios
await addDocument(licitacao.id, {
  name: "Proposta Técnica",
  docType: "proposta",
  required: true,
  issueDate: "2024-01-15T00:00:00.000Z",
  expiresAt: "2024-12-31T23:59:59.000Z",
  notes: "Documento obrigatório para participação"
});
```

#### **Fase 2: Gestão de Status**
```typescript
// 3. Publicar licitação
await updateLicitacao(licitacao.id, {
  status: "open"
});

// 4. Registrar evento de publicação
await addEvent(licitacao.id, {
  type: "status_changed",
  payload: {
    from: "draft",
    to: "open",
    reason: "Licitação publicada conforme cronograma"
  }
});
```

#### **Fase 3: Upload e Participação**
```typescript
// 5. Upload de arquivos pelos participantes
const formData = new FormData();
formData.append('file', arquivoPDF);

await uploadDocument(licitacao.id, docId, formData);

// 6. Marcar documento como entregue
await updateDocument(licitacao.id, docId, {
  submitted: true
});
```

### Estrutura de Dados - Licitações

#### CreateLicitacaoDto
```typescript
{
  title: string;                    // Título da licitação (obrigatório, min: 5, max: 200)
  status: 'draft' | 'open' | 'closed' | 'cancelled' | 'awarded';  // Status da licitação
  editalUrl?: string;               // URL do edital (opcional, deve ser URL válida)
  sessionDate?: string;              // Data da sessão (ISO 8601, formato: YYYY-MM-DDTHH:mm:ss.sssZ)
  submissionDeadline?: string;      // Prazo de submissão (ISO 8601, deve ser anterior à sessionDate)
}
```

**Validações:**
- `title`: Obrigatório, 5-200 caracteres
- `status`: Obrigatório, deve ser um dos valores válidos
- `editalUrl`: Opcional, deve ser URL válida se informada
- `sessionDate`: Opcional, formato ISO 8601
- `submissionDeadline`: Opcional, deve ser anterior à `sessionDate`

**Exemplo de uso:**
```typescript
const licitacaoData = {
  title: "Licitação para Serviços de Consultoria em TI",
  status: "draft",
  editalUrl: "https://example.com/edital-2024-001.pdf",
  sessionDate: "2024-12-15T14:00:00.000Z",
  submissionDeadline: "2024-12-10T23:59:59.000Z"
};
```

#### UpdateLicitacaoDto
```typescript
{
  title?: string;                   // Título da licitação (min: 5, max: 200)
  status?: 'draft' | 'open' | 'closed' | 'cancelled' | 'awarded';
  editalUrl?: string;               // URL do edital (deve ser URL válida)
  sessionDate?: string;              // Data da sessão (ISO 8601)
  submissionDeadline?: string;      // Prazo de submissão (ISO 8601)
}
```

**Validações:**
- Todos os campos são opcionais
- Mesmas validações do `CreateLicitacaoDto`
- `submissionDeadline` deve ser anterior à `sessionDate` se ambas forem informadas

**Exemplo de uso:**
```typescript
const updateData = {
  status: "open",
  sessionDate: "2024-12-20T14:00:00.000Z"  // Adiando a sessão
};
```

#### CreateLicDocDto (Documentos da Licitação)
```typescript
{
  name: string;                     // Nome do documento (obrigatório, min: 3, max: 100)
  docType?: string;                 // Tipo do documento (opcional, max: 50)
  required?: boolean;               // Se é obrigatório (padrão: false)
  submitted?: boolean;              // Se foi entregue (padrão: false)
  signed?: boolean;                 // Se foi assinado (padrão: false)
  issueDate?: string;               // Data de emissão (ISO 8601)
  expiresAt?: string;               // Data de expiração (ISO 8601)
  notes?: string;                   // Observações (máx 1000 caracteres)
}
```

**Validações:**
- `name`: Obrigatório, 3-100 caracteres
- `docType`: Opcional, máximo 50 caracteres
- `required`: Opcional, padrão `false`
- `submitted`: Opcional, padrão `false`
- `signed`: Opcional, padrão `false`
- `issueDate`: Opcional, formato ISO 8601
- `expiresAt`: Opcional, formato ISO 8601, deve ser posterior à `issueDate`
- `notes`: Opcional, máximo 1000 caracteres

**Tipos de documento comuns:**
- `proposta` - Proposta técnica/comercial
- `qualificacao` - Documentos de qualificação
- `garantia` - Garantias e seguros
- `contrato` - Contrato de execução
- `outros` - Outros documentos

**Exemplo de uso:**
```typescript
const documentoData = {
  name: "Proposta Técnica",
  docType: "proposta",
  required: true,
  issueDate: "2024-01-15T00:00:00.000Z",
  expiresAt: "2024-12-31T23:59:59.000Z",
  notes: "Documento obrigatório para participação na licitação"
};
```

#### CreateLicEventDto (Eventos da Licitação)
```typescript
{
  type: string;                     // Tipo do evento (obrigatório)
  payload: any;                     // Dados do evento (JSON arbitrário, obrigatório)
}
```

**Tipos de evento suportados:**
- `status_changed` - Mudança de status da licitação
- `note` - Nota ou observação
- `deadline_update` - Atualização de prazos
- `document_added` - Adição de documento
- `document_updated` - Atualização de documento
- `document_submitted` - Documento entregue
- `document_signed` - Documento assinado

**Validações:**
- `type`: Obrigatório, deve ser um dos tipos válidos
- `payload`: Obrigatório, objeto JSON válido

**Exemplos de payload por tipo:**

**Status Changed:**
```typescript
{
  type: "status_changed",
  payload: {
    from: "draft",
    to: "open",
    reason: "Licitação publicada conforme cronograma",
    changedBy: "user@example.com"
  }
}
```

**Note:**
```typescript
{
  type: "note",
  payload: {
    message: "Licitação suspensa temporariamente para ajustes no edital",
    priority: "high",
    category: "administrative"
  }
}
```

**Deadline Update:**
```typescript
{
  type: "deadline_update",
  payload: {
    field: "submissionDeadline",
    oldValue: "2024-12-10T23:59:59.000Z",
    newValue: "2024-12-15T23:59:59.000Z",
    reason: "Prorrogação solicitada pelos participantes"
  }
}
```

**Document Added:**
```typescript
{
  type: "document_added",
  payload: {
    documentName: "Proposta Técnica",
    documentType: "proposta",
    required: true,
    addedBy: "admin@example.com"
  }
}
```

### 📋 Endpoints Completos - Licitações

#### **1. CRUD de Licitações**

##### **POST /licitacoes** - Criar Licitação
```http
POST /licitacoes
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "title": "Licitação para Serviços de Consultoria em TI",
  "status": "draft",
  "editalUrl": "https://example.com/edital-2024-001.pdf",
  "sessionDate": "2024-12-15T14:00:00.000Z",
  "submissionDeadline": "2024-12-10T23:59:59.000Z"
}
```

**Resposta (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Licitação para Serviços de Consultoria em TI",
  "status": "draft",
  "editalUrl": "https://example.com/edital-2024-001.pdf",
  "sessionDate": "2024-12-15T14:00:00.000Z",
  "submissionDeadline": "2024-12-10T23:59:59.000Z",
  "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

##### **GET /licitacoes** - Listar Licitações
```http
GET /licitacoes?status=open&search=TI
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Parâmetros de Query:**
- `status` (opcional): `draft`, `open`, `closed`, `cancelled`, `awarded`
- `search` (opcional): Busca por título

**Resposta (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Licitação para Serviços de Consultoria em TI",
    "status": "open",
    "editalUrl": "https://example.com/edital-2024-001.pdf",
    "sessionDate": "2024-12-15T14:00:00.000Z",
    "submissionDeadline": "2024-12-10T23:59:59.000Z",
    "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

##### **GET /licitacoes/:id** - Obter Licitação por ID
```http
GET /licitacoes/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Licitação para Serviços de Consultoria em TI",
  "status": "open",
  "editalUrl": "https://example.com/edital-2024-001.pdf",
  "sessionDate": "2024-12-15T14:00:00.000Z",
  "submissionDeadline": "2024-12-10T23:59:59.000Z",
  "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

##### **PATCH /licitacoes/:id** - Atualizar Licitação
```http
PATCH /licitacoes/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "status": "open",
  "sessionDate": "2024-12-20T14:00:00.000Z"
}
```

**Resposta (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Licitação para Serviços de Consultoria em TI",
  "status": "open",
  "editalUrl": "https://example.com/edital-2024-001.pdf",
  "sessionDate": "2024-12-20T14:00:00.000Z",
  "submissionDeadline": "2024-12-10T23:59:59.000Z",
  "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

##### **DELETE /licitacoes/:id** - Excluir Licitação
```http
DELETE /licitacoes/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta (200):**
```json
{
  "message": "Licitação excluída com sucesso"
}
```

#### **2. Gestão de Documentos**

##### **GET /licitacoes/:id/documents** - Listar Documentos
```http
GET /licitacoes/123e4567-e89b-12d3-a456-426614174000/documents
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta (200):**
```json
[
  {
    "id": "doc-123e4567-e89b-12d3-a456-426614174000",
    "name": "Proposta Técnica",
    "docType": "proposta",
    "required": true,
    "submitted": false,
    "signed": false,
    "issueDate": "2024-01-15T00:00:00.000Z",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "notes": "Documento obrigatório para participação",
    "licitacaoId": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

##### **POST /licitacoes/:id/documents** - Adicionar Documento
```http
POST /licitacoes/123e4567-e89b-12d3-a456-426614174000/documents
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "name": "Proposta Técnica",
  "docType": "proposta",
  "required": true,
  "issueDate": "2024-01-15T00:00:00.000Z",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "notes": "Documento obrigatório para participação na licitação"
}
```

**Resposta (201):**
```json
{
  "id": "doc-123e4567-e89b-12d3-a456-426614174000",
  "name": "Proposta Técnica",
  "docType": "proposta",
  "required": true,
  "submitted": false,
  "signed": false,
  "issueDate": "2024-01-15T00:00:00.000Z",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "notes": "Documento obrigatório para participação na licitação",
  "licitacaoId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### **3. Gestão de Eventos**

##### **GET /licitacoes/:id/events** - Listar Eventos
```http
GET /licitacoes/123e4567-e89b-12d3-a456-426614174000/events
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta (200):**
```json
[
  {
    "id": "event-123e4567-e89b-12d3-a456-426614174000",
    "type": "status_changed",
    "payload": {
      "from": "draft",
      "to": "open",
      "reason": "Licitação publicada conforme cronograma"
    },
    "licitacaoId": "123e4567-e89b-12d3-a456-426614174000",
    "createdById": "user-123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

##### **POST /licitacoes/:id/events** - Adicionar Evento
```http
POST /licitacoes/123e4567-e89b-12d3-a456-426614174000/events
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "type": "status_changed",
  "payload": {
    "from": "draft",
    "to": "open",
    "reason": "Licitação publicada conforme cronograma",
    "changedBy": "admin@example.com"
  }
}
```

**Resposta (201):**
```json
{
  "id": "event-123e4567-e89b-12d3-a456-426614174000",
  "type": "status_changed",
  "payload": {
    "from": "draft",
    "to": "open",
    "reason": "Licitação publicada conforme cronograma",
    "changedBy": "admin@example.com"
  },
  "licitacaoId": "123e4567-e89b-12d3-a456-426614174000",
  "createdById": "user-123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Resposta - Licitação Completa
```typescript
{
  id: string;                       // UUID da licitação
  title: string;                    // Título da licitação
  status: string;                   // Status atual
  editalUrl?: string;              // URL do edital
  sessionDate?: string;            // Data da sessão
  submissionDeadline?: string;     // Prazo de submissão
  companyId: string;               // ID da empresa
  createdAt: string;               // Data de criação
  updatedAt: string;               // Data de atualização
}
```

### 🚨 Códigos de Erro e Validações

#### **Códigos de Status HTTP**

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| `200` | OK | Operação realizada com sucesso |
| `201` | Created | Recurso criado com sucesso |
| `400` | Bad Request | Dados inválidos ou malformados |
| `401` | Unauthorized | Token JWT inválido ou expirado |
| `403` | Forbidden | Sem permissão para a empresa |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito (ex: status inválido) |
| `422` | Unprocessable Entity | Erro de validação |
| `500` | Internal Server Error | Erro interno do servidor |

#### **Validações de Negócio**

##### **Licitações**
- ✅ **Título**: Obrigatório, 5-200 caracteres
- ✅ **Status**: Deve ser um dos valores válidos
- ✅ **URL do Edital**: Deve ser URL válida se informada
- ✅ **Datas**: Formato ISO 8601 obrigatório
- ✅ **Prazo de Submissão**: Deve ser anterior à data da sessão

##### **Documentos**
- ✅ **Nome**: Obrigatório, 3-100 caracteres
- ✅ **Tipo**: Máximo 50 caracteres
- ✅ **Data de Expiração**: Deve ser posterior à data de emissão
- ✅ **Observações**: Máximo 1000 caracteres

##### **Eventos**
- ✅ **Tipo**: Deve ser um dos tipos válidos
- ✅ **Payload**: Deve ser JSON válido
- ✅ **Campos Obrigatórios**: `type` e `payload`

#### **Exemplos de Respostas de Erro**

##### **400 - Bad Request**
```json
{
  "statusCode": 400,
  "message": "Dados inválidos",
  "error": "Bad Request",
  "details": [
    {
      "field": "title",
      "message": "Título deve ter entre 5 e 200 caracteres"
    },
    {
      "field": "submissionDeadline",
      "message": "Prazo de submissão deve ser anterior à data da sessão"
    }
  ]
}
```

##### **401 - Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

##### **403 - Forbidden**
```json
{
  "statusCode": 403,
  "message": "Sem permissão para acessar esta empresa",
  "error": "Forbidden"
}
```

##### **404 - Not Found**
```json
{
  "statusCode": 404,
  "message": "Licitação não encontrada",
  "error": "Not Found"
}
```

##### **409 - Conflict**
```json
{
  "statusCode": 409,
  "message": "Não é possível alterar status de licitação fechada",
  "error": "Conflict"
}
```

### 🔧 Implementação Frontend - Exemplos Práticos

#### **1. Service para Licitações (TypeScript)**

```typescript
// services/licitacoes.service.ts
export class LicitacoesService {
  private baseUrl = 'http://localhost:3000';
  private headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.getToken()}`,
    'X-Company-Id': this.getCompanyId()
  };

  // Criar licitação
  async createLicitacao(data: CreateLicitacaoDto) {
    const response = await fetch(`${this.baseUrl}/licitacoes`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao criar licitação: ${response.status}`);
    }
    
    return response.json();
  }

  // Listar licitações
  async listLicitacoes(filters?: { status?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await fetch(`${this.baseUrl}/licitacoes?${params}`, {
      headers: this.headers
    });
    
    return response.json();
  }

  // Obter licitação por ID
  async getLicitacao(id: string) {
    const response = await fetch(`${this.baseUrl}/licitacoes/${id}`, {
      headers: this.headers
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao obter licitação: ${response.status}`);
    }
    
    return response.json();
  }

  // Atualizar licitação
  async updateLicitacao(id: string, data: UpdateLicitacaoDto) {
    const response = await fetch(`${this.baseUrl}/licitacoes/${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar licitação: ${response.status}`);
    }
    
    return response.json();
  }

  // Excluir licitação
  async deleteLicitacao(id: string) {
    const response = await fetch(`${this.baseUrl}/licitacoes/${id}`, {
      method: 'DELETE',
      headers: this.headers
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao excluir licitação: ${response.status}`);
    }
    
    return response.json();
  }

  // Adicionar documento
  async addDocument(licitacaoId: string, data: CreateLicDocDto) {
    const response = await fetch(`${this.baseUrl}/licitacoes/${licitacaoId}/documents`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao adicionar documento: ${response.status}`);
    }
    
    return response.json();
  }

  // Listar documentos
  async listDocuments(licitacaoId: string) {
    const response = await fetch(`${this.baseUrl}/licitacoes/${licitacaoId}/documents`, {
      headers: this.headers
    });
    
    return response.json();
  }

  // Upload de arquivo
  async uploadDocument(licitacaoId: string, docId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseUrl}/licitacoes/${licitacaoId}/documents/${docId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'X-Company-Id': this.getCompanyId()
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status}`);
    }
    
    return response.json();
  }

  // Adicionar evento
  async addEvent(licitacaoId: string, data: CreateLicEventDto) {
    const response = await fetch(`${this.baseUrl}/licitacoes/${licitacaoId}/events`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao adicionar evento: ${response.status}`);
    }
    
    return response.json();
  }

  // Listar eventos
  async listEvents(licitacaoId: string) {
    const response = await fetch(`${this.baseUrl}/licitacoes/${licitacaoId}/events`, {
      headers: this.headers
    });
    
    return response.json();
  }

  private getToken(): string {
    return localStorage.getItem('access_token') || '';
  }

  private getCompanyId(): string {
    return localStorage.getItem('company_id') || '';
  }
}
```

#### **2. Hook React para Licitações**

```typescript
// hooks/useLicitacoes.ts
import { useState, useEffect } from 'react';
import { LicitacoesService } from '../services/licitacoes.service';

export const useLicitacoes = () => {
  const [licitacoes, setLicitacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const service = new LicitacoesService();

  const loadLicitacoes = async (filters?: { status?: string; search?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await service.listLicitacoes(filters);
      setLicitacoes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const createLicitacao = async (data: CreateLicitacaoDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const newLicitacao = await service.createLicitacao(data);
      setLicitacoes(prev => [newLicitacao, ...prev]);
      return newLicitacao;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar licitação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLicitacao = async (id: string, data: UpdateLicitacaoDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedLicitacao = await service.updateLicitacao(id, data);
      setLicitacoes(prev => 
        prev.map(lic => lic.id === id ? updatedLicitacao : lic)
      );
      return updatedLicitacao;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar licitação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLicitacao = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await service.deleteLicitacao(id);
      setLicitacoes(prev => prev.filter(lic => lic.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir licitação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLicitacoes();
  }, []);

  return {
    licitacoes,
    loading,
    error,
    loadLicitacoes,
    createLicitacao,
    updateLicitacao,
    deleteLicitacao
  };
};
```

#### **3. Componente React para Listagem**

```tsx
// components/LicitacoesList.tsx
import React, { useState } from 'react';
import { useLicitacoes } from '../hooks/useLicitacoes';

export const LicitacoesList: React.FC = () => {
  const { licitacoes, loading, error, loadLicitacoes } = useLicitacoes();
  const [filters, setFilters] = useState({ status: '', search: '' });

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    loadLicitacoes(newFilters);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      cancelled: 'bg-yellow-100 text-yellow-800',
      awarded: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="open">Aberta</option>
          <option value="closed">Fechada</option>
          <option value="cancelled">Cancelada</option>
          <option value="awarded">Adjudicada</option>
        </select>
        
        <input
          type="text"
          placeholder="Buscar por título..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
      </div>

      {/* Lista de licitações */}
      <div className="grid gap-4">
        {licitacoes.map((licitacao) => (
          <div key={licitacao.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{licitacao.title}</h3>
              <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(licitacao.status)}`}>
                {licitacao.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              {licitacao.editalUrl && (
                <p>Edital: <a href={licitacao.editalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ver edital</a></p>
              )}
              {licitacao.sessionDate && (
                <p>Sessão: {new Date(licitacao.sessionDate).toLocaleString('pt-BR')}</p>
              )}
              {licitacao.submissionDeadline && (
                <p>Prazo: {new Date(licitacao.submissionDeadline).toLocaleString('pt-BR')}</p>
              )}
            </div>
            
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Ver Detalhes
              </button>
              <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Editar
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```
```

### Resposta - Summary da Licitação
```typescript
{
  total: number;                   // Total de documentos
  required: number;                // Documentos obrigatórios
  submitted: number;               // Documentos entregues
  signed: number;                  // Documentos assinados
  coveragePercent: number;         // Percentual de cobertura
}
```

---

## 🚀 Endpoints da API

> **💡 Dica**: Todos os endpoints estão disponíveis no Swagger com exemplos de valores pré-preenchidos. Acesse `http://localhost:3000/docs` para testar diretamente no navegador.

### 1. CRUD de Documentos

#### 📝 Criar Documento
```http
POST /company-docs
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "company_id": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
  "clientName": "Empresa ABC Ltda",
  "docType": "Contrato de Prestação de Serviços",
  "issueDate": "2024-01-15T00:00:00.000Z",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "notes": "Contrato de prestação de serviços de consultoria"
}
```

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "clientName": "Empresa ABC Ltda",
  "docType": "Contrato de Prestação de Serviços",
  "issueDate": "2024-01-15T00:00:00.000Z",
  "expiresAt": "2024-12-31T23:59:59.000Z",
  "notes": "Contrato de prestação de serviços de consultoria",
  "fileName": "pending",
  "fileMime": "application/octet-stream",
  "fileSize": 0,
  "fileSha256": "",
  "version": 1,
  "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 📋 Listar Documentos
```http
GET /company-docs?status=expiring&inDays=30
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Query Parameters:**
- `status` (opcional): `valid` | `expiring` | `expired`
- `inDays` (opcional): Número de dias para filtrar documentos que expiram

**Resposta:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "clientName": "Empresa ABC Ltda",
    "docType": "Contrato de Prestação de Serviços",
    "issueDate": "2024-01-15T00:00:00.000Z",
    "expiresAt": "2024-12-31T23:59:59.000Z",
    "notes": "Contrato de prestação de serviços de consultoria",
    "fileName": "contrato_abc_2024.pdf",
    "fileMime": "application/pdf",
    "fileSize": 245760,
    "version": 2,
    "status": "valid",
    "daysToExpire": 45,
    "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z"
  }
]
```

#### 🔍 Obter Documento Específico
```http
GET /company-docs/{id}
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta:** Mesmo formato do item individual da listagem.

#### ✏️ Atualizar Documento
```http
PATCH /company-docs/{id}
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "clientName": "Empresa ABC Ltda - Atualizada",
  "expiresAt": "2025-12-31T23:59:59.000Z",
  "notes": "Contrato prorrogado por mais um ano"
}
```

**Resposta:** Documento atualizado.

#### 🗑️ Excluir Documento
```http
DELETE /company-docs/{id}
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta:**
```json
{
  "message": "Documento excluído com sucesso",
  "id": "123e4567-e89b-12d3-a456-426614174000"
}
```

---

### 2. CRUD de Licitações

#### 📝 Criar Licitação
```http
POST /licitacoes
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "title": "Licitação para Serviços de TI",
  "status": "draft",
  "editalUrl": "https://example.com/edital.pdf",
  "sessionDate": "2024-12-15T14:00:00.000Z",
  "submissionDeadline": "2024-12-10T23:59:59.000Z"
}
```

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Licitação para Serviços de TI",
  "status": "draft",
  "editalUrl": "https://example.com/edital.pdf",
  "sessionDate": "2024-12-15T14:00:00.000Z",
  "submissionDeadline": "2024-12-10T23:59:59.000Z",
  "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### 📋 Listar Licitações
```http
GET /licitacoes?status=open&search=TI
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Query Parameters:**
- `status` (opcional): `draft` | `open` | `closed` | `cancelled` | `awarded`
- `search` (opcional): Busca por título

**Resposta:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Licitação para Serviços de TI",
    "status": "open",
    "editalUrl": "https://example.com/edital.pdf",
    "sessionDate": "2024-12-15T14:00:00.000Z",
    "submissionDeadline": "2024-12-10T23:59:59.000Z",
    "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### 🔍 Obter Licitação Específica
```http
GET /licitacoes/{id}
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

#### ✏️ Atualizar Licitação
```http
PATCH /licitacoes/{id}
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "status": "open",
  "submissionDeadline": "2024-12-20T23:59:59.000Z"
}
```

#### 🗑️ Excluir Licitação
```http
DELETE /licitacoes/{id}
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

### 3. Documentos da Licitação

#### 📋 Listar Documentos da Licitação
```http
GET /licitacoes/{id}/documents
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

#### 📝 Adicionar Documento à Licitação
```http
POST /licitacoes/{id}/documents
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "name": "Proposta Técnica",
  "docType": "proposta",
  "required": true,
  "notes": "Documento obrigatório para participação"
}
```

#### ✏️ Atualizar Documento da Licitação
```http
PATCH /licitacoes/{id}/documents/{docId}
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "submitted": true,
  "signed": true
}
```

#### 🗑️ Remover Documento da Licitação
```http
DELETE /licitacoes/{id}/documents/{docId}
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

### 4. Eventos da Licitação

#### 📋 Listar Eventos da Licitação
```http
GET /licitacoes/{id}/events
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

#### 📝 Adicionar Evento à Licitação
```http
POST /licitacoes/{id}/events
Content-Type: application/json
Authorization: Bearer <token>
X-Company-Id: <company_id>

{
  "type": "status_changed",
  "payload": {
    "from": "draft",
    "to": "open",
    "reason": "Licitação publicada"
  }
}
```

### 5. Resumo da Licitação

#### 📊 Obter Resumo da Licitação
```http
GET /licitacoes/{id}/summary
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta:**
```json
{
  "total": 5,
  "required": 4,
  "submitted": 3,
  "signed": 2,
  "coveragePercent": 60
}
```

---

### 6. Upload e Download de Arquivos

#### 📤 Upload de Arquivo
```http
POST /company-docs/{id}/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
X-Company-Id: <company_id>

Form Data:
- file: [arquivo] (PDF, DOC, DOCX)
```

**Limitações:**
- **Tamanho máximo**: 10MB (configurável via `UPLOAD_MAX_BYTES`)
- **Tipos permitidos**: PDF, DOC, DOCX (configurável via `UPLOAD_ALLOWED_MIME`)

**Resposta:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "clientName": "Empresa ABC Ltda",
  "docType": "Contrato de Prestação de Serviços",
  "fileName": "contrato_abc_2024.pdf",
  "fileMime": "application/pdf",
  "fileSize": 245760,
  "fileSha256": "a1b2c3d4e5f6...",
  "version": 2,
  "companyId": "da6cc36e-b112-4301-ae6d-f824ccf944ad",
  "updatedAt": "2024-01-20T14:30:00.000Z"
}
```

#### 📥 Download de Arquivo
```http
GET /company-docs/{id}/file
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta:** Arquivo binário com headers apropriados.

### 7. Upload e Download de Arquivos de Licitações

#### 📤 Upload de Arquivo para Documento da Licitação

> **🔧 Swagger**: Use o seletor de arquivo funcional na seção **"Licitações - Upload"** do Swagger.

```http
POST /licitacoes/{id}/documents/{docId}/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
X-Company-Id: <company_id>

Form Data:
- file: [arquivo] (PDF, DOC, DOCX)
```

**Resposta:**
```json
{
  "id": "doc-123",
  "name": "Proposta Técnica",
  "fileName": "proposta_tecnica.pdf",
  "fileMime": "application/pdf",
  "fileSize": 245760,
  "fileSha256": "a1b2c3d4e5f6...",
  "submitted": true,
  "licitacaoId": "lic-456"
}
```

#### 📥 Download de Arquivo da Licitação
```http
GET /licitacoes/{id}/documents/{docId}/file
Authorization: Bearer <token>
X-Company-Id: <company_id>
```

**Resposta:** Arquivo binário com headers apropriados.

---

## 💻 Exemplos de Integração

### JavaScript/TypeScript (Fetch API)

```typescript
// Configuração base
const API_BASE = 'http://localhost:3000';
const token = 'seu-access-token';
const companyId = 'seu-company-id';

const headers = {
  'Authorization': `Bearer ${token}`,
  'X-Company-Id': companyId,
  'Content-Type': 'application/json'
};

// Criar documento
async function criarDocumento(dados) {
  const response = await fetch(`${API_BASE}/company-docs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dados)
  });
  return response.json();
}

// Listar documentos com filtros
async function listarDocumentos(filtros = {}) {
  const params = new URLSearchParams(filtros);
  const response = await fetch(`${API_BASE}/company-docs?${params}`, {
    headers: { ...headers, 'Content-Type': undefined }
  });
  return response.json();
}

// Upload de arquivo
async function uploadArquivo(documentoId, arquivo) {
  const formData = new FormData();
  formData.append('file', arquivo);
  
  const response = await fetch(
    `${API_BASE}/company-docs/${documentoId}/upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-Id': companyId
        // Não definir Content-Type para multipart/form-data
      },
      body: formData
    }
  );
  return response.json();
}

// Download de arquivo
async function downloadArquivo(documentoId) {
  const response = await fetch(
    `${API_BASE}/company-docs/${documentoId}/file`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-Id': companyId
      }
    }
  );
  
  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// === FUNÇÕES PARA LICITAÇÕES ===

// Criar licitação
async function criarLicitacao(dados) {
  const response = await fetch(`${API_BASE}/licitacoes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dados)
  });
  return response.json();
}

// Listar licitações
async function listarLicitacoes(filtros = {}) {
  const params = new URLSearchParams(filtros);
  const response = await fetch(`${API_BASE}/licitacoes?${params}`, {
    headers: { ...headers, 'Content-Type': undefined }
  });
  return response.json();
}

// Adicionar documento à licitação
async function adicionarDocumentoLic(licitacaoId, dados) {
  const response = await fetch(`${API_BASE}/licitacoes/${licitacaoId}/documents`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dados)
  });
  return response.json();
}

// Upload de arquivo para documento da licitação
async function uploadArquivoLic(licitacaoId, documentoId, arquivo) {
  const formData = new FormData();
  formData.append('file', arquivo);
  
  const response = await fetch(
    `${API_BASE}/licitacoes/${licitacaoId}/documents/${documentoId}/upload`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Company-Id': companyId
      },
      body: formData
    }
  );
  return response.json();
}

// Obter resumo da licitação
async function obterResumoLic(licitacaoId) {
  const response = await fetch(`${API_BASE}/licitacoes/${licitacaoId}/summary`, {
    headers: { ...headers, 'Content-Type': undefined }
  });
  return response.json();
}
```

### Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Company-Id': companyId
  }
});

// Criar documento
const documento = await api.post('/company-docs', dados);

// Upload com progress
const uploadProgress = await api.post(
  `/company-docs/${documentoId}/upload`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Upload: ${percentCompleted}%`);
    }
  }
);
```

### React Hook Personalizado

```typescript
import { useState, useEffect } from 'react';

function useCompanyDocs() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocumentos = async (filtros = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filtros);
      const response = await fetch(`/api/company-docs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId
        }
      });
      const data = await response.json();
      setDocumentos(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  return { documentos, loading, error, refetch: fetchDocumentos };
}

// Hook para Licitações
function useLicitacoes() {
  const [licitacoes, setLicitacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLicitacoes = async (filtros = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filtros);
      const response = await fetch(`/api/licitacoes?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId
        }
      });
      const data = await response.json();
      setLicitacoes(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const criarLicitacao = async (dados) => {
    try {
      const response = await fetch('/api/licitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId
        },
        body: JSON.stringify(dados)
      });
      if (response.ok) {
        fetchLicitacoes(); // Recarregar lista
      }
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchLicitacoes();
  }, []);

  return { 
    licitacoes, 
    loading, 
    error, 
    refetch: fetchLicitacoes,
    criarLicitacao 
  };
}
```

---

## ⚠️ Códigos de Status HTTP

### Sucesso
| Código | Descrição |
|--------|-----------|
| `200` | OK - Operação realizada com sucesso |
| `201` | Created - Recurso criado com sucesso |

### Erro do Cliente
| Código | Descrição | Solução |
|--------|-----------|---------|
| `400` | Bad Request | Verificar dados enviados (validação falhou) |
| `401` | Unauthorized | Token JWT inválido ou expirado |
| `403` | Forbidden | Sem permissão para a empresa ou operação |
| `404` | Not Found | Recurso não encontrado |
| `413` | Payload Too Large | Arquivo muito grande (max 10MB) |
| `415` | Unsupported Media Type | Tipo de arquivo não permitido |

### Erro do Servidor
| Código | Descrição |
|--------|-----------|
| `500` | Internal Server Error | Erro interno do servidor |

---

## 🔧 Configurações e Limitações

### Upload de Arquivos
```env
UPLOAD_MAX_BYTES=10485760  # 10MB (padrão)
UPLOAD_ALLOWED_MIME=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

**Tipos de arquivo permitidos:**
- `application/pdf` - Arquivos PDF
- `application/msword` - Documentos Word (.doc)
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` - Documentos Word (.docx)

### Rate Limiting
- **Limite global**: 300 requisições por minuto
- **Aplicado a**: Todas as rotas da API

### Permissões
- **Criar/Atualizar/Excluir**: Apenas admin/owner
- **Listar/Visualizar**: Todos os membros da empresa

---

## 📱 Exemplo de Interface React

```tsx
import React, { useState } from 'react';

function DocumentoForm() {
  const [formData, setFormData] = useState({
    company_id: '',
    clientName: '',
    docType: '',
    issueDate: '',
    expiresAt: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/company-docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Documento criado com sucesso!');
        // Redirecionar ou atualizar lista
      }
    } catch (error) {
      alert('Erro ao criar documento');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do cliente"
        value={formData.clientName}
        onChange={(e) => setFormData({...formData, clientName: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="Tipo do documento"
        value={formData.docType}
        onChange={(e) => setFormData({...formData, docType: e.target.value})}
        required
      />
      
      <input
        type="date"
        value={formData.issueDate}
        onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
      />
      
      <input
        type="date"
        value={formData.expiresAt}
        onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
      />
      
      <textarea
        placeholder="Observações"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
        maxLength={1000}
      />
      
      <button type="submit">Criar Documento</button>
    </form>
  );
}

// Exemplo de Interface para Licitações
function LicitacaoForm() {
  const [formData, setFormData] = useState({
    title: '',
    status: 'draft',
    editalUrl: '',
    sessionDate: '',
    submissionDeadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/licitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Company-Id': companyId
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Licitação criada com sucesso!');
        // Redirecionar ou atualizar lista
      }
    } catch (error) {
      alert('Erro ao criar licitação');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título da licitação"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <select
        value={formData.status}
        onChange={(e) => setFormData({...formData, status: e.target.value})}
      >
        <option value="draft">Rascunho</option>
        <option value="open">Aberta</option>
        <option value="closed">Fechada</option>
        <option value="cancelled">Cancelada</option>
        <option value="awarded">Adjudicada</option>
      </select>
      
      <input
        type="url"
        placeholder="URL do edital"
        value={formData.editalUrl}
        onChange={(e) => setFormData({...formData, editalUrl: e.target.value})}
      />
      
      <input
        type="datetime-local"
        placeholder="Data da sessão"
        value={formData.sessionDate}
        onChange={(e) => setFormData({...formData, sessionDate: e.target.value})}
      />
      
      <input
        type="datetime-local"
        placeholder="Prazo de submissão"
        value={formData.submissionDeadline}
        onChange={(e) => setFormData({...formData, submissionDeadline: e.target.value})}
      />
      
      <button type="submit">Criar Licitação</button>
    </form>
  );
}
```

---

## 🚀 Próximos Passos

### **Fase 1: Configuração e Testes**
1. **Teste no Swagger** primeiro: Acesse `http://localhost:3000/docs` para entender a API
2. **Configure a autenticação** no seu frontend (JWT + X-Company-Id)
3. **Teste todos os endpoints** usando os exemplos pré-preenchidos

### **Fase 2: Implementação Backend**
4. **Implemente os services** TypeScript para as APIs
5. **Configure interceptors** para headers automáticos
6. **Implemente tratamento de erros** robusto

### **Fase 3: Interface do Usuário**
7. **Crie os hooks React** para gerenciamento de estado
8. **Implemente componentes** de listagem e formulários
9. **Configure upload** de arquivos com drag-and-drop
10. **Adicione validações** em tempo real

### **Fase 4: Funcionalidades Avançadas**
11. **Implemente filtros** e busca avançada
12. **Adicione notificações** em tempo real
13. **Configure relatórios** e dashboards
14. **Implemente auditoria** e logs de eventos

### **Fase 5: Testes e Deploy**
15. **Teste todas as funcionalidades** com dados reais
16. **Configure CI/CD** para deploy automático
17. **Implemente monitoramento** e alertas
18. **Documente casos de uso** específicos

## ✨ Melhorias Implementadas

### 🔧 Swagger Configurado
- ✅ **Autenticação dupla**: JWT + X-Company-Id
- ✅ **Exemplos de valores**: Dados realistas para todos os campos
- ✅ **Upload funcional**: Seletor de arquivo com validação
- ✅ **Headers automáticos**: Configuração persistente entre requisições
- ✅ **Documentação completa**: Schemas e respostas detalhadas

### 📋 Benefícios para Desenvolvedores
- ✅ **Testes rápidos**: Interface visual para testar APIs
- ✅ **Validação automática**: Tipos e formatos validados
- ✅ **Exemplos realistas**: Dados de exemplo para todos os campos
- ✅ **Upload intuitivo**: Interface drag-and-drop para arquivos
- ✅ **Códigos de resposta**: Exemplos de sucesso e erro
5. **Implemente validações** no frontend
6. **Teste todas as funcionalidades** com dados reais
7. **Integre os módulos** de documentos e licitações no seu sistema

---

## 📞 Suporte

Para dúvidas ou problemas:
- **Swagger**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/healthz`
- **Logs**: Verifique a saída do console
- **Testes**: Use Postman, Insomnia ou cURL
- **Documentação**: Este guia e comentários no código

---

*Documento atualizado automaticamente - Última atualização: Outubro 2024*




