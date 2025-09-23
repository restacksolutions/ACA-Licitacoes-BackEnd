# Script PowerShell para testar CORS
Write-Host "🧪 Testando CORS do Backend ACA Licitações" -ForegroundColor Green
Write-Host ""

# Teste 1: Health Check
Write-Host "1️⃣ Testando Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/v1/health" -Method GET
    Write-Host "   ✅ Status: 200 OK" -ForegroundColor Green
    Write-Host "   Resposta: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 2: OPTIONS Preflight
Write-Host "2️⃣ Testando OPTIONS Preflight..." -ForegroundColor Yellow
$origins = @("http://localhost:4200", "http://localhost:3001", "http://127.0.0.1:4200", "http://127.0.0.1:3001")

foreach ($origin in $origins) {
    try {
        $headers = @{
            "Origin" = $origin
            "Access-Control-Request-Method" = "POST"
            "Access-Control-Request-Headers" = "Content-Type, Authorization"
        }
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/v1/auth/login" -Method OPTIONS -Headers $headers
        Write-Host "   ✅ Origin: $origin - Status: $($response.StatusCode)" -ForegroundColor Green
        
        # Mostrar headers CORS
        $corsHeaders = @{
            "Access-Control-Allow-Origin" = $response.Headers["Access-Control-Allow-Origin"]
            "Access-Control-Allow-Methods" = $response.Headers["Access-Control-Allow-Methods"]
            "Access-Control-Allow-Headers" = $response.Headers["Access-Control-Allow-Headers"]
            "Access-Control-Allow-Credentials" = $response.Headers["Access-Control-Allow-Credentials"]
        }
        Write-Host "   CORS Headers: $($corsHeaders | ConvertTo-Json)" -ForegroundColor Cyan
    } catch {
        Write-Host "   ❌ Origin: $origin - Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Teste 3: POST Login
Write-Host "3️⃣ Testando POST de login..." -ForegroundColor Yellow
try {
    $body = @{
        email = "test@test.com"
        password = "123456"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
        "Origin" = "http://localhost:4200"
    }

    $response = Invoke-WebRequest -Uri "http://localhost:3000/v1/auth/login" -Method POST -Headers $headers -Body $body
    Write-Host "   ✅ Status: $($response.StatusCode)" -ForegroundColor Green
    
    # Mostrar headers CORS
    $corsHeaders = @{
        "Access-Control-Allow-Origin" = $response.Headers["Access-Control-Allow-Origin"]
        "Access-Control-Allow-Credentials" = $response.Headers["Access-Control-Allow-Credentials"]
    }
    Write-Host "   CORS Headers: $($corsHeaders | ConvertTo-Json)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Testes de CORS concluídos!" -ForegroundColor Green
Read-Host "Pressione Enter para continuar"
