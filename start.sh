#!/bin/sh

# Aguardar o banco de dados estar disponível
echo "Aguardando banco de dados..."
sleep 5

# Executar migrações do Prisma
echo "Executando migrações do banco de dados..."
npx prisma migrate deploy --schema=prisma/schema.prisma

# Iniciar a aplicação
echo "Iniciando aplicação..."
node dist/main.js
