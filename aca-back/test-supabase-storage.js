const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabaseStorage() {
  console.log('🔍 Testando conexão com Supabase Storage...');
  
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
    
    // 1. Verificar se o bucket existe
    console.log('\n📦 Verificando bucket...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erro ao listar buckets:', bucketsError.message);
      return;
    }
    
    console.log('📋 Buckets disponíveis:');
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'público' : 'privado'})`);
    });
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.log(`\n⚠️  Bucket '${bucketName}' não existe. Criando...`);
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        console.error('❌ Erro ao criar bucket:', createError.message);
        return;
      }
      
      console.log('✅ Bucket criado com sucesso!');
    } else {
      console.log(`✅ Bucket '${bucketName}' encontrado!`);
    }
    
    // 2. Testar upload de arquivo
    console.log('\n📤 Testando upload de arquivo...');
    const testContent = Buffer.from('Teste de upload do ACA Licitações - ' + new Date().toISOString());
    const testPath = `test/documents/test-${Date.now()}.pdf`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testPath, testContent, {
        contentType: 'application/pdf',
        upsert: true
      });
    
    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError.message);
      return;
    }
    
    console.log('✅ Upload realizado com sucesso!');
    console.log('📁 Caminho do arquivo:', uploadData.path);
    
    // 3. Testar download do arquivo
    console.log('\n📥 Testando download do arquivo...');
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(testPath);
    
    if (downloadError) {
      console.error('❌ Erro no download:', downloadError.message);
      return;
    }
    
    const downloadedContent = await downloadData.text();
    console.log('✅ Download realizado com sucesso!');
    console.log('📄 Conteúdo baixado:', downloadedContent);
    
    // 4. Testar URL assinada
    console.log('\n🔗 Testando URL assinada...');
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(testPath, 3600);
    
    if (signedUrlError) {
      console.error('❌ Erro ao gerar URL assinada:', signedUrlError.message);
      return;
    }
    
    console.log('✅ URL assinada gerada com sucesso!');
    console.log('🔗 URL:', signedUrlData.signedUrl);
    
    // 5. Limpar arquivo de teste
    console.log('\n🧹 Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([testPath]);
    
    if (deleteError) {
      console.warn('⚠️  Erro ao deletar arquivo de teste:', deleteError.message);
    } else {
      console.log('✅ Arquivo de teste removido!');
    }
    
    console.log('\n🎉 Teste do Supabase Storage concluído com sucesso!');
    console.log('✅ O sistema está pronto para fazer upload de documentos!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSupabaseStorage();
