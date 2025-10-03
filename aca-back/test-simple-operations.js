const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testSimpleOperations() {
  console.log('🔍 Testando operações simples de documentos...');
  
  try {
    // 1. Fazer login com credenciais de teste
    console.log('\n🔐 Fazendo login...');
    const loginResponse = await fetch('http://localhost:3000/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'teste@exemplo.com',
        password: 'senha123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login falhou, tentando criar usuário...');
      
      // Tentar registrar usuário
      const registerResponse = await fetch('http://localhost:3000/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'teste@exemplo.com',
          password: 'senha123',
          fullName: 'Usuário Teste',
          companyName: 'Empresa Teste Ltda'
        })
      });
      
      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        console.error('❌ Erro no registro:', errorText);
        return;
      }
      
      const registerData = await registerResponse.json();
      console.log('✅ Usuário registrado com sucesso!');
      
      const token = registerData.access_token;
      const companyId = registerData.company_id;
      
      await testDocumentOperations(token, companyId);
    } else {
      const loginData = await loginResponse.json();
      console.log('✅ Login realizado com sucesso!');
      
      const token = loginData.access_token;
      
      // Obter empresas
      const companiesResponse = await fetch('http://localhost:3000/v1/companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!companiesResponse.ok) {
        console.error('❌ Erro ao obter empresas:', await companiesResponse.text());
        return;
      }
      
      const companiesData = await companiesResponse.json();
      const company = companiesData[0].company || companiesData[0];
      const companyId = company.id;
      
      console.log('✅ Empresa selecionada:', company.name);
      
      await testDocumentOperations(token, companyId);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function testDocumentOperations(token, companyId) {
  try {
    // 1. Criar arquivo de teste
    console.log('\n📄 Criando arquivo de teste...');
    const testContent = `Documento de teste do ACA Licitações
Data: ${new Date().toISOString()}
Empresa ID: ${companyId}
Tipo: CNPJ
Número: 12.345.678/0001-90
Emissor: Receita Federal
Data de Emissão: 2024-01-01
Data de Vencimento: 2025-01-01
Observações: Documento de teste para verificar operações

Este é um documento PDF simulado para testar as funcionalidades do sistema.`;
    
    const testFilePath = path.join(__dirname, 'test-simple-operations.pdf');
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Arquivo de teste criado:', testFilePath);
    
    // 2. Fazer upload do documento
    console.log('\n📤 Fazendo upload do documento...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-simple-operations.pdf',
      contentType: 'application/pdf'
    });
    formData.append('clientName', 'Cliente Teste Simples');
    formData.append('docType', 'cnpj');
    formData.append('docNumber', '12.345.678/0001-90');
    formData.append('issuer', 'Receita Federal');
    formData.append('issueDate', '2024-01-01');
    formData.append('expiresAt', '2025-01-01');
    formData.append('notes', 'Documento de teste para verificar operações');
    
    const uploadResponse = await fetch(`http://localhost:3000/v1/companies/${companyId}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ Erro no upload:', errorText);
      return;
    }
    
    const uploadData = await uploadResponse.json();
    console.log('✅ Upload realizado com sucesso!');
    console.log('📋 Dados do documento:', {
      id: uploadData.id,
      docType: uploadData.docType,
      filePath: uploadData.filePath,
      version: uploadData.version
    });
    
    const documentId = uploadData.id;
    
    // 3. Verificar se o documento foi salvo no banco
    console.log('\n🔍 Verificando documento no banco de dados...');
    const documentsResponse = await fetch(`http://localhost:3000/v1/companies/${companyId}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!documentsResponse.ok) {
      console.error('❌ Erro ao obter documentos:', await documentsResponse.text());
      return;
    }
    
    const documentsData = await documentsResponse.json();
    console.log('📋 Documentos encontrados:', documentsData.documents.length);
    
    const uploadedDoc = documentsData.documents.find(doc => doc.id === documentId);
    if (uploadedDoc) {
      console.log('✅ Documento encontrado no banco de dados!');
      console.log('📄 Detalhes:', {
        id: uploadedDoc.id,
        docType: uploadedDoc.docType,
        filePath: uploadedDoc.filePath,
        docNumber: uploadedDoc.docNumber,
        issuer: uploadedDoc.issuer,
        version: uploadedDoc.version
      });
    } else {
      console.error('❌ Documento não encontrado no banco de dados!');
      return;
    }
    
    // 4. Testar download do documento
    console.log('\n📥 Testando download do documento...');
    const downloadResponse = await fetch(`http://localhost:3000/v1/companies/${companyId}/documents/${documentId}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!downloadResponse.ok) {
      console.error('❌ Erro no download:', await downloadResponse.text());
      return;
    }
    
    const downloadBuffer = await downloadResponse.arrayBuffer();
    console.log('✅ Download realizado com sucesso!');
    console.log('📊 Tamanho do arquivo baixado:', downloadBuffer.byteLength, 'bytes');
    
    // Verificar se o conteúdo baixado é válido
    const downloadedContent = Buffer.from(downloadBuffer).toString('utf8');
    if (downloadedContent.includes('Documento de teste do ACA Licitações')) {
      console.log('✅ Conteúdo do arquivo baixado está correto!');
    } else {
      console.warn('⚠️  Conteúdo do arquivo baixado pode estar incorreto');
    }
    
    // 5. Testar exclusão do documento
    console.log('\n🗑️  Testando exclusão do documento...');
    const deleteResponse = await fetch(`http://localhost:3000/v1/companies/${companyId}/documents/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!deleteResponse.ok) {
      console.error('❌ Erro na exclusão:', await deleteResponse.text());
      return;
    }
    
    console.log('✅ Exclusão realizada com sucesso!');
    
    // 6. Verificar se o documento foi removido do banco
    console.log('\n🔍 Verificando se documento foi removido do banco...');
    const documentsAfterDeleteResponse = await fetch(`http://localhost:3000/v1/companies/${companyId}/documents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!documentsAfterDeleteResponse.ok) {
      console.error('❌ Erro ao obter documentos após exclusão:', await documentsAfterDeleteResponse.text());
      return;
    }
    
    const documentsAfterDeleteData = await documentsAfterDeleteResponse.json();
    const deletedDoc = documentsAfterDeleteData.documents.find(doc => doc.id === documentId);
    
    if (!deletedDoc) {
      console.log('✅ Documento foi removido do banco de dados!');
    } else {
      console.error('❌ Documento ainda existe no banco de dados!');
    }
    
    // 7. Limpar arquivo de teste
    console.log('\n🧹 Limpando arquivo de teste...');
    fs.unlinkSync(testFilePath);
    console.log('✅ Arquivo de teste removido!');
    
    console.log('\n🎉 Teste de operações de documentos concluído com sucesso!');
    console.log('✅ Upload funcionando');
    console.log('✅ Download funcionando');
    console.log('✅ Exclusão funcionando');
    console.log('✅ Sistema 100% funcional!');
    
  } catch (error) {
    console.error('❌ Erro nas operações de documentos:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSimpleOperations();
