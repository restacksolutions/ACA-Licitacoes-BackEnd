#!/bin/sh

# Configurar variáveis de ambiente
export NODE_ENV=production

# Aguardar o banco de dados estar disponível
echo "Aguardando banco de dados..."
sleep 10

# Verificar se o Prisma está disponível
echo "Verificando Prisma..."
if ! command -v npx &> /dev/null; then
    echo "npx não encontrado, tentando instalar..."
    npm install -g npx
fi

# Verificar se o schema do Prisma existe
if [ ! -f "prisma/schema.prisma" ]; then
    echo "ERRO: Schema do Prisma não encontrado em prisma/schema.prisma"
    exit 1
fi

# Gerar cliente do Prisma
echo "Gerando cliente do Prisma..."
npx prisma generate --schema=prisma/schema.prisma

# Executar migrações do Prisma
echo "Executando migrações do banco de dados..."
npx prisma migrate deploy --schema=prisma/schema.prisma

# Verificar se a aplicação foi compilada
if [ ! -f "dist/main.js" ]; then
    echo "ERRO: Aplicação não compilada. dist/main.js não encontrado"
    exit 1
fi

# Iniciar a aplicação
echo "Iniciando aplicação..."
exec node dist/main.js
