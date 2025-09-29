const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Verificar se usuário já existe
  let user = await prisma.appUser.findUnique({
    where: { id: 'aca-user-123' },
  });

  if (!user) {
    // Criar usuário primeiro
    user = await prisma.appUser.create({
      data: {
        id: 'aca-user-123',
        authUserId: 'aca-user-123',
        email: 'admin@teste.com',
        fullName: 'Admin Teste',
      },
    });
    console.log('✅ Usuário criado:', user.fullName);
  } else {
    console.log('✅ Usuário já existe:', user.fullName);
  }

  // Criar empresa
  const company = await prisma.company.create({
    data: {
      name: 'Empresa Teste',
      cnpj: '12345678000199',
      phone: '11999999999',
      address: 'Rua Teste, 123',
      createdById: user.id,
    },
  });
  console.log('✅ Empresa criada:', company.name);

  // Criar membership
  const membership = await prisma.companyMember.create({
    data: {
      userId: user.id,
      companyId: company.id,
      role: 'owner',
    },
  });
  console.log('✅ Membership criado:', membership.role);

  // Criar licitação de teste
  const licitacao = await prisma.licitacao.create({
    data: {
      companyId: company.id,
      title: '5 carros curitiba',
      orgao: 'PR',
      modalidade: 'Pregão eletrônico',
      sessionAt: new Date('2025-09-02T02:32:00.000Z'),
      submissionDeadline: new Date('2025-10-11T02:32:00.000Z'),
      status: 'draft',
      saleValue: 1000000,
      notes: 'dasdasda',
    },
  });
  console.log('✅ Licitação criada:', licitacao.title);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
