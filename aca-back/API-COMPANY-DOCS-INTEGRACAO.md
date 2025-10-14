# 📄 API de Documentos da Empresa - Guia de Integração Frontend

Este documento contém todas as informações necessárias para integrar as APIs do módulo de **Documentos da Empresa** no seu frontend.

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

## 🚀 Endpoints da API

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

### 2. Upload e Download de Arquivos

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
```

---

## 🚀 Próximos Passos

1. **Configure a autenticação** no seu frontend
2. **Implemente os hooks/services** para as APIs
3. **Crie as interfaces** para listagem e formulários
4. **Configure o upload** de arquivos
5. **Implemente validações** no frontend
6. **Teste todas as funcionalidades** com dados reais

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

