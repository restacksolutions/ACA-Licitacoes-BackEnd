FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run prisma:generate || npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000

# Instalar dependências de produção
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Copiar arquivos necessários
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY start.sh ./
COPY entrypoint.sh ./

# Instalar Prisma CLI globalmente para garantir disponibilidade
RUN npm install -g prisma

# Dar permissões de execução aos scripts
RUN chmod +x /app/start.sh /app/entrypoint.sh

# Expor a porta
EXPOSE 3000

# Usar o script de inicialização mais robusto
CMD ["/app/entrypoint.sh"]
