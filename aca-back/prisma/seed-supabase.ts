import { PrismaClient, LicitacaoDocType, LicitacaoStatus, RoleCompany } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do Supabase...');

  // 1. Criar usuário admin
  const user = await prisma.appUser.upsert({
    where: { email: 'admin@aca.dev' },
    update: {},
    create: {
      email: 'admin@aca.dev',
      fullName: 'Admin ACA',
      passwordHash: '$2b$10$hash_aqui_opcional', // opcional para Supabase Auth
    },
  });

  console.log('✅ Usuário criado/encontrado:', user.fullName);

  // 2. Criar empresa
  const company = await prisma.company.create({
    data: {
      name: 'ACA Tecnologia',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      createdById: user.id,
      members: {
        create: [
          {
            userId: user.id,
            role: 'OWNER',
          },
        ],
      },
    },
  });

  console.log('✅ Empresa criada:', company.name);

  // 3. Criar licitação
  const licitacao = await prisma.licitacao.create({
    data: {
      companyId: company.id,
      title: 'Pregão Eletrônico 001/2025',
      orgao: 'Prefeitura Municipal de São Paulo',
      modalidade: 'Pregão Eletrônico',
      editalUrl: 'https://example.com/edital-001-2025.pdf',
      sessionAt: new Date('2025-02-15T14:00:00Z'),
      submissionDeadline: new Date('2025-02-10T23:59:59Z'),
      status: 'DRAFT',
      saleValue: 50000.00,
      notes: 'Licitação para aquisição de equipamentos de informática',
    },
  });

  console.log('✅ Licitação criada:', licitacao.title);

  // 4. Criar documentos da empresa
  const companyDoc = await prisma.companyDocument.create({
    data: {
      companyId: company.id,
      name: 'CNPJ',
      type: 'CNPJ',
      docType: 'cnpj',
      docNumber: '12.345.678/0001-90',
      issuer: 'Receita Federal',
      issueDate: new Date('2020-01-15'),
      expiresAt: new Date('2030-01-15'),
      filePath: 'docs/company/cnpj.pdf',
      notes: 'CNPJ da empresa',
    },
  });

  console.log('✅ Documento da empresa criado:', companyDoc.docType);

  // 5. Criar documentos da licitação
  const licitacaoDocs = await prisma.licitacaoDocument.createMany({
    data: [
      {
        licitacaoId: licitacao.id,
        name: 'Proposta Técnica e Comercial',
        type: 'PROPOSTA',
        docType: 'PROPOSTA',
        required: true,
        filePath: 'docs/licitacoes/proposta-001.pdf',
        notes: 'Proposta técnica e comercial',
      },
      {
        licitacaoId: licitacao.id,
        name: 'Documentos de Habilitação',
        type: 'HABILITACAO',
        docType: 'HABILITACAO',
        required: true,
        filePath: 'docs/licitacoes/habilitacao-001.pdf',
        notes: 'Documentos de habilitação',
      },
    ],
  });

  console.log('✅ Documentos da licitação criados:', licitacaoDocs.count);

  // 6. Criar evento da licitação
  const event = await prisma.licitacaoEvent.create({
    data: {
      licitacaoId: licitacao.id,
      title: 'Licitação criada',
      eventDate: new Date(),
      newStatus: 'DRAFT',
      description: 'Licitação criada',
      createdById: user.id,
    },
  });

  console.log('✅ Evento criado:', event.description);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('📊 Resumo:');
  console.log(`   - Usuário: ${user.email}`);
  console.log(`   - Empresa: ${company.name}`);
  console.log(`   - Licitação: ${licitacao.title}`);
  console.log(`   - Documentos: ${licitacaoDocs.count + 1}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
