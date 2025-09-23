@echo off
echo 🧪 Testando CORS do Backend ACA Licitações
echo.

echo 1️⃣ Testando Health Check...
curl -X GET http://localhost:3000/v1/health -v
echo.

echo 2️⃣ Testando OPTIONS Preflight para localhost:4200...
curl -X OPTIONS http://localhost:3000/v1/auth/login ^
  -H "Origin: http://localhost:4200" ^
  -H "Access-Control-Request-Method: POST" ^
  -H "Access-Control-Request-Headers: Content-Type, Authorization" ^
  -v
echo.

echo 3️⃣ Testando OPTIONS Preflight para localhost:3001...
curl -X OPTIONS http://localhost:3000/v1/auth/login ^
  -H "Origin: http://localhost:3001" ^
  -H "Access-Control-Request-Method: POST" ^
  -H "Access-Control-Request-Headers: Content-Type, Authorization" ^
  -v
echo.

echo 4️⃣ Testando POST de login...
curl -X POST http://localhost:3000/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -H "Origin: http://localhost:4200" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"123456\"}" ^
  -v
echo.

echo ✅ Testes concluídos!
pause
