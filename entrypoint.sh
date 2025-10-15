#!/bin/bash
set -e

echo "=== INICIANDO APLICAÇÃO ACA LICITAÇÕES ==="

# Configurar variáveis de ambiente
export NODE_ENV=production
export PATH="/usr/local/bin:/usr/bin:/bin:$PATH"

# Verificar se estamos no diretório correto
echo "Diretório atual: $(pwd)"
echo "Conteúdo do diretório:"
ls -la

# Verificar se o Node.js está disponível
echo "Verificando Node.js..."
node --version
npm --version

# Aguardar o banco de dados estar disponível
echo "Aguardando banco de dados estar disponível..."
sleep 15

# Verificar se o Prisma está disponível
echo "Verificando Prisma..."
if ! command -v prisma &> /dev/null; then
    echo "Prisma CLI não encontrado, tentando instalar..."
    npm install -g prisma@latest
fi

# Verificar se o npx está disponível
if ! command -v npx &> /dev/null; then
    echo "npx não encontrado, tentando instalar..."
    npm install -g npx
fi

# Verificar se o schema do Prisma existe
echo "Verificando schema do Prisma..."
if [ ! -f "prisma/schema.prisma" ]; then
    echo "ERRO: Schema do Prisma não encontrado em prisma/schema.prisma"
    echo "Conteúdo do diretório prisma:"
    ls -la prisma/ || echo "Diretório prisma não existe"
    exit 1
fi

# Verificar se a aplicação foi compilada
echo "Verificando aplicação compilada..."
if [ ! -f "dist/main.js" ]; then
    echo "ERRO: Aplicação não compilada. dist/main.js não encontrado"
    echo "Conteúdo do diretório dist:"
    ls -la dist/ || echo "Diretório dist não existe"
    exit 1
fi

# Gerar cliente do Prisma
echo "Gerando cliente do Prisma..."
npx prisma generate --schema=prisma/schema.prisma || prisma generate --schema=prisma/schema.prisma

# Executar migrações do Prisma
echo "Executando migrações do banco de dados..."
npx prisma migrate deploy --schema=prisma/schema.prisma || prisma migrate deploy --schema=prisma/schema.prisma

# Verificar se a variável DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
    echo "AVISO: DATABASE_URL não está definida"
else
    echo "DATABASE_URL está configurada"
fi

# Iniciar a aplicação
echo "Iniciando aplicação..."
echo "Porta: ${PORT:-3000}"
echo "NODE_ENV: $NODE_ENV"

exec node dist/main.js
