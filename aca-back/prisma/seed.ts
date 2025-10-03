import { PrismaClient, LicitacaoDocType, LicitacaoStatus, RoleCompany } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const user = await prisma.appUser.upsert({
    where: { email: 'admin@aca.dev' },
    update: {},
    create: {
      email: 'admin@aca.dev',
      fullName: 'Admin ACA',
      passwordHash: '$2b$10$hash_aqui_opcional', // opcional
    },
  });

  console.log('✅ Usuário criado/encontrado:', user.fullName);

  const company = await prisma.company.create({
    data: {
      name: 'ACA Tecnologia',
      cnpj: '12.345.678/0001-90',
      createdById: user.id,
      members: {
        create: [{ userId: user.id, role: RoleCompany.owner }],
      },
    },
  });

  console.log('✅ Empresa criada:', company.name);

  const lic = await prisma.licitacao.create({
    data: {
      companyId: company.id,
      title: 'Pregão Eletrônico 001/2025',
      orgao: 'Prefeitura X',
      modalidade: 'Pregão',
      status: LicitacaoStatus.draft,
      documents: {
        create: [
          {
            docType: LicitacaoDocType.proposta,
            required: true,
            version: 1,
            filePath: 'docs/licitacoes/edital-001-v1.pdf',
          },
          {
            docType: LicitacaoDocType.habilitacao,
            required: false,
            version: 1,
            filePath: 'docs/licitacoes/tr-001-v1.pdf',
          },
        ],
      },
    },
  });

  console.log('✅ Licitação criada:', lic.title);

  // Criar alguns documentos da empresa
  await prisma.companyDocument.create({
    data: {
      companyId: company.id,
      docType: 'cnpj',
      docNumber: '12.345.678/0001-90',
      issuer: 'Receita Federal',
      filePath: 'docs/company/cnpj.pdf',
    },
  });

  console.log('✅ Documento da empresa criado');

  console.log('🎉 Seed concluído com sucesso!');
  console.log({ user, company, lic });
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
