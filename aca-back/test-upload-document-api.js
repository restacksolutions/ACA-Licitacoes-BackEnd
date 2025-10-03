const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testDocumentUpload() {
  console.log('🔍 Testando upload de documento via API...');
  
  try {
    // 1. Primeiro, fazer login para obter token
    console.log('\n🔐 Fazendo login...');
    const loginResponse = await fetch('http://localhost:3000/auth/login', {
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
      console.error('❌ Erro no login:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login realizado com sucesso!');
    
    // 2. Obter empresas para pegar o ID
    console.log('\n🏢 Obtendo empresas...');
    const companiesResponse = await fetch('http://localhost:3000/companies', {
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
    console.log('📋 Empresas encontradas:', companiesData.length);
    
    if (companiesData.length === 0) {
      console.error('❌ Nenhuma empresa encontrada!');
      return;
    }
    
    const company = companiesData[0].company || companiesData[0];
    const companyId = company.id;
    console.log('✅ Empresa selecionada:', company.name, '(ID:', companyId + ')');
    
    // 3. Criar arquivo de teste
    console.log('\n📄 Criando arquivo de teste...');
    const testContent = `Documento de teste do ACA Licitações
Data: ${new Date().toISOString()}
Empresa: ${company.name}
Tipo: CNPJ
Número: 12.345.678/0001-90
Emissor: Receita Federal
Data de Emissão: 2024-01-01
Data de Vencimento: 2025-01-01
Observações: Documento de teste para verificar upload no Supabase Storage

Este é um documento PDF simulado para testar a funcionalidade de upload.
O sistema deve salvar este arquivo no Supabase Storage e registrar os metadados no banco de dados.`;
    
    const testFilePath = path.join(__dirname, 'test-document.pdf');
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Arquivo de teste criado:', testFilePath);
    
    // 4. Fazer upload do documento
    console.log('\n📤 Fazendo upload do documento...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-document.pdf',
      contentType: 'application/pdf'
    });
    formData.append('clientName', 'Cliente Teste');
    formData.append('docType', 'cnpj');
    formData.append('docNumber', '12.345.678/0001-90');
    formData.append('issuer', 'Receita Federal');
    formData.append('issueDate', '2024-01-01');
    formData.append('expiresAt', '2025-01-01');
    formData.append('notes', 'Documento de teste para verificar upload no Supabase Storage');
    
    const uploadResponse = await fetch(`http://localhost:3000/companies/${companyId}/documents/upload`, {
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
    
    // 5. Verificar se o documento foi salvo no banco
    console.log('\n🔍 Verificando documento no banco de dados...');
    const documentsResponse = await fetch(`http://localhost:3000/companies/${companyId}/documents`, {
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
    
    const uploadedDoc = documentsData.documents.find(doc => doc.id === uploadData.id);
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
    }
    
    // 6. Testar download do documento
    console.log('\n📥 Testando download do documento...');
    const downloadResponse = await fetch(`http://localhost:3000/companies/${companyId}/documents/${uploadData.id}/content`, {
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
    
    // 7. Limpar arquivo de teste
    console.log('\n🧹 Limpando arquivo de teste...');
    fs.unlinkSync(testFilePath);
    console.log('✅ Arquivo de teste removido!');
    
    console.log('\n🎉 Teste de upload de documento concluído com sucesso!');
    console.log('✅ O sistema está funcionando corretamente com Supabase Storage!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDocumentUpload();
