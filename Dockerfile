# ===== 1) Build =====
FROM node:20-alpine AS build
WORKDIR /app

# copie apenas os manifests do backend
COPY aca-back/package*.json ./ 
RUN npm ci

# copie o código do backend
COPY aca-back/ .

# Prisma Client + build do Nest
RUN npm run prisma:generate || npx prisma generate
RUN npm run build
 
# ===== 2) Runtime =====
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

# apenas deps de runtime
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# artefatos + prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# start: aplica migrations e sobe API
CMD sh -c "node -v && npm run prisma:migrate && node dist/main.js"
