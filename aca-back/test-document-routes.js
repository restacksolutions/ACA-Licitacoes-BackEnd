const fetch = require('node-fetch');

async function testDocumentRoutes() {
  console.log('🧪 Testando rotas de documentos...\n');

  const baseUrl = 'http://localhost:3000/v1';
  
  // Primeiro, vamos fazer login para obter um token
  console.log('1️⃣ Fazendo login...');
  try {
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

    if (!loginResponse.ok) {
      console.log('❌ Erro no login:', loginResponse.status, await loginResponse.text());
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login realizado com sucesso');
    console.log('🔑 Token obtido:', loginData.access_token ? 'Sim' : 'Não');

    const token = loginData.access_token;

    // Obter empresas
    console.log('\n2️⃣ Obtendo empresas...');
    const companiesResponse = await fetch(`${baseUrl}/companies`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!companiesResponse.ok) {
      console.log('❌ Erro ao obter empresas:', companiesResponse.status, await companiesResponse.text());
      return;
    }

    const companies = await companiesResponse.json();
    console.log('✅ Empresas obtidas:', companies.length);
    
    if (companies.length === 0) {
      console.log('❌ Nenhuma empresa encontrada');
      return;
    }

    const company = companies[0].company || companies[0];
    const companyId = company.id;
    console.log('🏢 Empresa selecionada:', company.name, 'ID:', companyId);

    // Obter documentos
    console.log('\n3️⃣ Obtendo documentos...');
    const documentsResponse = await fetch(`${baseUrl}/companies/${companyId}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!documentsResponse.ok) {
      console.log('❌ Erro ao obter documentos:', documentsResponse.status, await documentsResponse.text());
      return;
    }

    const documentsData = await documentsResponse.json();
    console.log('✅ Documentos obtidos:', documentsData.documents?.length || 0);
    
    if (!documentsData.documents || documentsData.documents.length === 0) {
      console.log('❌ Nenhum documento encontrado');
      return;
    }

    const document = documentsData.documents[0];
    const documentId = document.id;
    console.log('📄 Documento selecionado:', document.docType, 'ID:', documentId);

    // Testar download
    console.log('\n4️⃣ Testando download...');
    const downloadResponse = await fetch(`${baseUrl}/companies/${companyId}/documents/${documentId}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('📊 Status do download:', downloadResponse.status);
    if (downloadResponse.ok) {
      console.log('✅ Download funcionando');
      console.log('📦 Content-Type:', downloadResponse.headers.get('content-type'));
      console.log('📏 Content-Length:', downloadResponse.headers.get('content-length'));
    } else {
      console.log('❌ Erro no download:', await downloadResponse.text());
    }

    // Testar metadados
    console.log('\n5️⃣ Testando metadados...');
    const metaResponse = await fetch(`${baseUrl}/companies/${companyId}/documents/${documentId}/meta`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Status dos metadados:', metaResponse.status);
    if (metaResponse.ok) {
      console.log('✅ Metadados funcionando');
      const metaData = await metaResponse.json();
      console.log('📄 Metadados:', metaData);
    } else {
      console.log('❌ Erro nos metadados:', await metaResponse.text());
    }

    // Testar exclusão (apenas se houver mais de um documento)
    if (documentsData.documents.length > 1) {
      console.log('\n6️⃣ Testando exclusão...');
      const deleteResponse = await fetch(`${baseUrl}/companies/${companyId}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📊 Status da exclusão:', deleteResponse.status);
      if (deleteResponse.ok) {
        console.log('✅ Exclusão funcionando');
      } else {
        console.log('❌ Erro na exclusão:', await deleteResponse.text());
      }
    } else {
      console.log('\n6️⃣ Pulando teste de exclusão (apenas 1 documento)');
    }

  } catch (error) {
    console.error('🚨 Erro geral:', error.message);
  }
}

testDocumentRoutes();
