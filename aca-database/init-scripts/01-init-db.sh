#!/bin/bash
set -e

echo "Inicializando banco de dados ACA Licitações..."

# Criar extensões necessárias
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Habilitar extensões necessárias
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    
    -- Configurar timezone
    SET timezone = 'America/Sao_Paulo';
    
    -- Criar usuário específico para a aplicação (opcional)
    -- CREATE USER aca_app_user WITH PASSWORD 'aca_app_password';
    -- GRANT ALL PRIVILEGES ON DATABASE aca_licitacoes TO aca_app_user;
    
    echo "Banco de dados inicializado com sucesso!"
EOSQL
