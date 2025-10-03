const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testDirectUpload() {
  console.log('🔍 Testando upload direto para Supabase Storage...');
  
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE;
  const bucketName = process.env.SB_BUCKET || 'docs';
  
  console.log('📋 Configurações:');
  console.log('- URL:', supabaseUrl);
  console.log('- Bucket:', bucketName);
  console.log('- Service Role Key:', serviceRoleKey ? '✅ Configurado' : '❌ Não configurado');
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Credenciais do Supabase não encontradas!');
    return;
  }
  
  try {
    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    // Simular dados de um documento
    const companyId = 'test-company-123';
    const clientName = 'Cliente Teste';
    const docType = 'cnpj';
    const docTypeLabel = 'CNPJ';
    const formattedDocType = `${clientName} - ${docTypeLabel}`;
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileExtension = 'pdf';
    const fileName = `${formattedDocType.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;
    const filePath = `documents/${companyId}/${fileName}`;
    
    console.log('\n📄 Simulando documento:');
    console.log('- Cliente:', clientName);
    console.log('- Tipo:', docType);
    console.log('- Tipo formatado:', formattedDocType);
    console.log('- Nome do arquivo:', fileName);
    console.log('- Caminho completo:', filePath);
    
    // Criar conteúdo do PDF simulado
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
100 700 Td
(Documento: ${formattedDocType}) Tj
0 -20 Td
(Numero: 12.345.678/0001-90) Tj
0 -20 Td
(Emissor: Receita Federal) Tj
0 -20 Td
(Data: 2024-01-01) Tj
0 -20 Td
(Observacoes: Teste de upload direto) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000525 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`;

    const fileBuffer = Buffer.from(pdfContent, 'utf8');
    
    console.log('\n📤 Fazendo upload para Supabase Storage...');
    
    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });
    
    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError.message);
      return;
    }
    
    console.log('✅ Upload realizado com sucesso!');
    console.log('📁 Caminho do arquivo:', uploadData.path);
    
    // Testar download
    console.log('\n📥 Testando download...');
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (downloadError) {
      console.error('❌ Erro no download:', downloadError.message);
      return;
    }
    
    const downloadedBuffer = Buffer.from(await downloadData.arrayBuffer());
    console.log('✅ Download realizado com sucesso!');
    console.log('📊 Tamanho do arquivo baixado:', downloadedBuffer.length, 'bytes');
    
    // Testar URL assinada
    console.log('\n🔗 Testando URL assinada...');
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 3600);
    
    if (signedUrlError) {
      console.error('❌ Erro ao gerar URL assinada:', signedUrlError.message);
      return;
    }
    
    console.log('✅ URL assinada gerada com sucesso!');
    console.log('🔗 URL:', signedUrlData.signedUrl);
    
    // Simular dados que seriam salvos no banco
    const documentData = {
      id: 'doc-' + Date.now(),
      companyId: companyId,
      docType: formattedDocType,
      docNumber: '12.345.678/0001-90',
      issuer: 'Receita Federal',
      issueDate: new Date('2024-01-01'),
      expiresAt: new Date('2025-01-01'),
      filePath: uploadData.path,
      notes: 'Teste de upload direto para Supabase Storage',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('\n📋 Dados que seriam salvos no banco:');
    console.log(JSON.stringify(documentData, null, 2));
    
    // Limpar arquivo de teste
    console.log('\n🧹 Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (deleteError) {
      console.warn('⚠️  Erro ao deletar arquivo de teste:', deleteError.message);
    } else {
      console.log('✅ Arquivo de teste removido!');
    }
    
    console.log('\n🎉 Teste de upload direto concluído com sucesso!');
    console.log('✅ O Supabase Storage está funcionando perfeitamente!');
    console.log('✅ A integração está pronta para ser usada no sistema!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDirectUpload();
