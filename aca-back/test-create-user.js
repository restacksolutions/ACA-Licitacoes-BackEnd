const fetch = require('node-fetch');

async function createTestUser() {
  console.log('🧪 Criando usuário de teste...\n');

  const baseUrl = 'http://localhost:3000/v1';
  
  try {
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'Usuário Teste',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Empresa Teste',
        companyCnpj: '12345678000199',
        companyPhone: '11999999999',
        companyAddress: 'Rua Teste, 123'
      })
    });

    console.log('📊 Status do registro:', registerResponse.status);
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Usuário criado com sucesso');
      console.log('🔑 Token:', registerData.access_token ? 'Sim' : 'Não');
    } else {
      const errorText = await registerResponse.text();
      console.log('❌ Erro no registro:', errorText);
      
      // Se o usuário já existe, tentar fazer login
      if (registerResponse.status === 400 && errorText.includes('já existe')) {
        console.log('\n🔄 Usuário já existe, tentando fazer login...');
        
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

        console.log('📊 Status do login:', loginResponse.status);
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('✅ Login realizado com sucesso');
          console.log('🔑 Token:', loginData.access_token ? 'Sim' : 'Não');
        } else {
          const loginError = await loginResponse.text();
          console.log('❌ Erro no login:', loginError);
        }
      }
    }

  } catch (error) {
    console.error('🚨 Erro geral:', error.message);
  }
}

createTestUser();
