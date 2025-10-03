# ✅ Configuração do docType Formatado - {Cliente - Tipo Documento}

## 🎯 **Objetivo Alcançado:**
O campo `docType` na tabela `company_documents` agora é salvo no formato:
**`{Cliente - Tipo Documento}`**

## 🔧 **Alterações Implementadas:**

### **1. Schema do Prisma Atualizado:**
```prisma
model CompanyDocument {
  id        String   @id @default(cuid())
  companyId String   @map("company_id")
  docType   String   // ✅ Mudado de enum para string
  // ... outros campos
}
```

### **2. DTOs Atualizados:**
- ✅ `CreateCompanyDocDto` - docType como string
- ✅ `UploadDocumentDto` - docType como string  
- ✅ `UpdateCompanyDocDto` - docType como string
- ✅ Validação com `@IsIn()` em vez de `@IsEnum()`

### **3. Serviço de Documentos Modificado:**
```typescript
// Formatação automática no upload
const clientName = dto.clientName || 'Cliente';
const docTypeLabel = this.getDocTypeLabel(dto.docType);
const formattedDocType = `${clientName} - ${docTypeLabel}`;

// Salva no banco como: "Empresa ABC - CNPJ"
```

### **4. Método de Formatação:**
```typescript
private getDocTypeLabel(docType: string): string {
  const labels = {
    'cnpj': 'CNPJ',
    'certidao': 'Certidão',
    'procuracao': 'Procuração',
    'inscricao_estadual': 'Inscrição Estadual',
    'outro': 'Outros'
  };
  return labels[docType] || docType;
}
```

## 📋 **Exemplos de Formatação:**

| Entrada | Resultado no Banco |
|---------|-------------------|
| `docType: 'cnpj'` + `clientName: 'Empresa ABC'` | `"Empresa ABC - CNPJ"` |
| `docType: 'certidao'` + `clientName: 'Cliente XYZ'` | `"Cliente XYZ - Certidão"` |
| `docType: 'inscricao_estadual'` + `clientName: 'Empresa 123'` | `"Empresa 123 - Inscrição Estadual"` |
| `docType: 'outro'` + `clientName: 'Cliente Teste'` | `"Cliente Teste - Outros"` |

## 🚀 **Funcionalidades Afetadas:**

### **✅ Upload de Documentos:**
- Formata automaticamente o docType
- Usa o `clientName` fornecido no DTO
- Fallback para "Cliente" se não fornecido

### **✅ Criação de Documentos:**
- Formata automaticamente o docType
- Usa "Cliente" como nome padrão

### **✅ Atualização de Documentos:**
- Formata automaticamente se docType for fornecido
- Usa "Cliente" como nome padrão

### **✅ Reupload de Documentos:**
- Formata automaticamente o docType
- Usa o `clientName` fornecido no DTO

## 🧪 **Teste Realizado:**
```bash
node test-doctype-format.js
# ✅ Resultado: Formatação funcionando perfeitamente
```

## 🎯 **Resultado Final:**
- ✅ Campo `docType` salvo como string formatada
- ✅ Formato: `{Cliente - Tipo Documento}`
- ✅ Validação mantida com valores aceitos
- ✅ Compatível com frontend existente
- ✅ Banco de dados atualizado

**🚀 Configuração concluída! O sistema agora salva o docType no formato solicitado.**
