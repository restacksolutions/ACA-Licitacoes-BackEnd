const fetch = require('node-fetch');

async function testAuth() {
  console.log('🧪 Testando autenticação...\n');

  const baseUrl = 'http://localhost:3000/v1';
  
  try {
    // Testar health primeiro
    console.log('1️⃣ Testando health...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    console.log('Health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health OK:', healthData);
    }

    // Testar login com credenciais mock
    console.log('\n2️⃣ Testando login...');
    const loginResponse = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    console.log('Login status:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login OK');
      console.log('Token presente:', !!loginData.access_token);
      
      // Testar uma rota protegida
      console.log('\n3️⃣ Testando rota protegida...');
      const companiesResponse = await fetch(`${baseUrl}/companies`, {
        headers: {
          'Authorization': `Bearer ${loginData.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Companies status:', companiesResponse.status);
      
      if (companiesResponse.ok) {
        const companies = await companiesResponse.json();
        console.log('✅ Companies OK, count:', companies.length);
      } else {
        const errorText = await companiesResponse.text();
        console.log('❌ Companies error:', errorText);
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login error:', errorText);
    }

  } catch (error) {
    console.error('🚨 Erro geral:', error.message);
  }
}

testAuth();
