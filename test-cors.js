#!/usr/bin/env node

/**
 * Script de teste para verificar se o CORS está funcionando corretamente
 * Execute: node test-cors.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const TEST_ORIGINS = [
  'http://localhost:4200',
  'http://localhost:3001',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:3001'
];

function makeRequest(method, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testCORS() {
  console.log('🧪 Iniciando testes de CORS...\n');

  // Teste 1: Health Check
  console.log('1️⃣ Testando Health Check...');
  try {
    const response = await makeRequest('GET', '/v1/health');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   CORS Headers: ${JSON.stringify({
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials']
    })}`);
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
  }

  // Teste 2: OPTIONS Preflight
  console.log('\n2️⃣ Testando requisições OPTIONS (preflight)...');
  for (const origin of TEST_ORIGINS) {
    try {
      const response = await makeRequest('OPTIONS', '/v1/auth/login', {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      });
      console.log(`   Origin: ${origin}`);
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   CORS Headers: ${JSON.stringify({
        'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
        'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': response.headers['access-control-allow-headers'],
        'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials']
      })}`);
    } catch (error) {
      console.log(`   ❌ Erro para ${origin}: ${error.message}`);
    }
  }

  // Teste 3: Login POST
  console.log('\n3️⃣ Testando requisição POST de login...');
  try {
    const response = await makeRequest('POST', '/v1/auth/login', {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:4200'
    }, JSON.stringify({
      email: 'test@test.com',
      password: '123456'
    }));
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   CORS Headers: ${JSON.stringify({
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials']
    })}`);
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
  }

  console.log('\n✅ Testes de CORS concluídos!');
}

// Executar testes
testCORS().catch(console.error);
