@echo off
echo 🚀 Iniciando Backend ACA Licitações com CORS configurado
echo.

echo 📦 Instalando dependências...
call npm install

echo.
echo 🗄️ Gerando Prisma client...
call npm run prisma:generate

echo.
echo 🚀 Iniciando servidor em modo desenvolvimento...
echo.
echo ✅ CORS configurado para:
echo    - http://localhost:4200 (Angular dev server)
echo    - http://localhost:3001 (Angular alternativo)
echo    - http://127.0.0.1:4200 (Localhost alternativo)
echo    - http://127.0.0.1:3001 (Localhost alternativo)
echo.
echo 📚 Swagger: http://localhost:3000/docs
echo 🏥 Health: http://localhost:3000/v1/health
echo.

call npm run start:dev
