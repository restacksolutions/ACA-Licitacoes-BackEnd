FROM postgres:15-alpine

# Instalar extensões necessárias
RUN apk add --no-cache postgresql-contrib

# Copiar scripts de inicialização
COPY init-scripts/ /docker-entrypoint-initdb.d/

# Configurar permissões
RUN chmod +x /docker-entrypoint-initdb.d/*.sh

# Expor porta
EXPOSE 5432

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD pg_isready -U aca_user -d aca_licitacoes || exit 1
