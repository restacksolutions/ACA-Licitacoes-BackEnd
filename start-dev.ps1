# Script PowerShell para iniciar o backend com CORS configurado
Write-Host "🚀 Iniciando Backend ACA Licitações com CORS configurado" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🗄️ Gerando Prisma client..." -ForegroundColor Yellow
npm run prisma:generate

Write-Host ""
Write-Host "🚀 Iniciando servidor em modo desenvolvimento..." -ForegroundColor Green
Write-Host ""
Write-Host "✅ CORS configurado para:" -ForegroundColor Cyan
Write-Host "   - http://localhost:4200 (Angular dev server)" -ForegroundColor White
Write-Host "   - http://localhost:3001 (Angular alternativo)" -ForegroundColor White
Write-Host "   - http://127.0.0.1:4200 (Localhost alternativo)" -ForegroundColor White
Write-Host "   - http://127.0.0.1:3001 (Localhost alternativo)" -ForegroundColor White
Write-Host ""
Write-Host "📚 Swagger: http://localhost:3000/docs" -ForegroundColor Magenta
Write-Host "🏥 Health: http://localhost:3000/v1/health" -ForegroundColor Magenta
Write-Host ""

npm run start:dev
