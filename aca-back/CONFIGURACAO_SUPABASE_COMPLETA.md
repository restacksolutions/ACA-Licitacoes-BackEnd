# 🚀 Configuração Completa para Supabase Real

## ✅ **Status: Schema Atualizado para PostgreSQL**

O schema já foi atualizado para usar PostgreSQL. Agora siga estes passos:

## 📋 **Passo 1: Obter Credenciais do Supabase**

1. **Acesse seu projeto Supabase**: https://supabase.com/dashboard
2. **Vá em Settings > API**
3. **Copie as seguintes informações**:

```env
# Exemplo das credenciais que você precisa:
SUPABASE_PROJECT_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2ODAwMCwiZXhwIjoyMDE0MzQ0MDAwfQ.exemplo
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk4NzY4MDAwLCJleHAiOjIwMTQzNDQwMDB9.exemplo
```

4. **Vá em Settings > Database**
5. **Copie a Connection String** (substitua [YOUR-PASSWORD] pela sua senha):

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## 📝 **Passo 2: Criar Arquivo .env**

1. **Renomeie** `env-template.txt` para `.env`
2. **Substitua** os valores pelos seus dados reais:

```env
# Database PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.SEU_PROJETO_ID.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:SUA_SENHA@db.SEU_PROJETO_ID.supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_PROJECT_URL="https://SEU_PROJETO_ID.supabase.co"
SUPABASE_ANON_KEY="SUA_ANON_KEY_AQUI"
SUPABASE_SERVICE_ROLE="SUA_SERVICE_ROLE_KEY_AQUI"
SUPABASE_JWKS_URL="https://SEU_PROJETO_ID.supabase.co/auth/v1/keys"

# JWT Configuration
JWT_SECRET="sua-chave-secreta-jwt-muito-segura-para-producao"
```

## 🔧 **Passo 3: Executar Comandos**

Execute estes comandos no terminal:

```bash
# 1. Parar o servidor atual (Ctrl+C)

# 2. Instalar dependências (se necessário)
npm install

# 3. Gerar cliente Prisma para PostgreSQL
npx prisma generate

# 4. Executar migrações no Supabase
npx prisma migrate dev --name init-postgresql

# 5. Verificar conexão
npx prisma db pull

# 6. Iniciar servidor
npm run start:dev
```

## 🧪 **Passo 4: Testar Integração**

### **Teste 1: Health Check**
```bash
curl http://localhost:3000/v1/health
```

### **Teste 2: Registro de Usuário**
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "123456",
    "fullName": "Usuário Teste",
    "companyName": "Empresa Teste",
    "cnpj": "12.345.678/0001-90"
  }'
```

### **Teste 3: Verificar no Supabase**
1. **Acesse**: https://supabase.com/dashboard
2. **Vá em Authentication > Users**
3. **Verifique** se o usuário foi criado
4. **Vá em Table Editor**
5. **Verifique** as tabelas `app_users` e `companies`

## ✅ **Verificações de Sucesso**

- ✅ Servidor inicia sem erros
- ✅ Health check retorna 200
- ✅ Registro de usuário funciona
- ✅ Usuário aparece no Supabase
- ✅ Dados salvos nas tabelas do Supabase

## 🚨 **Se Houver Problemas**

### **Erro de Conexão:**
- Verifique se as credenciais estão corretas
- Teste a conexão: `npx prisma db pull`

### **Erro de Migração:**
- Limpe as migrações: `rm -rf prisma/migrations`
- Execute: `npx prisma migrate dev --name init`

### **Erro de Autenticação:**
- Verifique se as chaves do Supabase estão corretas
- Teste no Supabase Dashboard

## 🎯 **Resultado Final**

Após a configuração, seu sistema irá:
- ✅ Usar o banco PostgreSQL do Supabase
- ✅ Salvar usuários no Supabase Auth
- ✅ Salvar dados nas tabelas do Supabase
- ✅ Funcionar com autenticação real

**🚀 Pronto! Seu sistema estará usando o Supabase real!**
