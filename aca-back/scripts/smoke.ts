import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function smokeTest() {
  console.log('🧪 Iniciando smoke test...');

  try {
    // Teste 1: Conectar ao banco
    console.log('1️⃣ Testando conexão...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Conexão OK');

    // Teste 2: Verificar extensões
    console.log('2️⃣ Verificando extensões...');
    const extensions = await prisma.$queryRaw<Array<{extname: string}>>`
      SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto', 'citext')
    `;
    console.log('✅ Extensões encontradas:', extensions.map(e => e.extname));

    // Teste 3: Contar registros
    console.log('3️⃣ Contando registros...');
    const counts = await Promise.all([
      prisma.appUser.count(),
      prisma.company.count(),
      prisma.licitacao.count(),
      prisma.licitacaoDocument.count(),
      prisma.companyDocument.count(),
    ]);
    
    console.log('✅ Contadores:', {
      users: counts[0],
      companies: counts[1],
      licitacoes: counts[2],
      licitacaoDocs: counts[3],
      companyDocs: counts[4],
    });

    // Teste 4: Criar e ler registro
    console.log('4️⃣ Testando CRUD...');
    const testUser = await prisma.appUser.create({
      data: {
        email: 'teste@smoke.com',
        fullName: 'Usuário Teste',
      },
    });
    console.log('✅ Usuário criado:', testUser.id);

    const foundUser = await prisma.appUser.findUnique({
      where: { id: testUser.id },
    });
    console.log('✅ Usuário encontrado:', foundUser?.email);

    // Limpar teste
    await prisma.appUser.delete({ where: { id: testUser.id } });
    console.log('✅ Usuário de teste removido');

    console.log('🎉 Smoke test concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no smoke test:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

smokeTest();
