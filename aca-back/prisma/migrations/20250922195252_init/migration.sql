-- CreateTable
CREATE TABLE "app_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authUserId" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "logoPath" TEXT,
    "letterheadPath" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "companies_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "app_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    CONSTRAINT "company_members_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "company_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "company_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "docNumber" TEXT,
    "issuer" TEXT,
    "issueDate" DATETIME,
    "expiresAt" DATETIME,
    "filePath" TEXT,
    "notes" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "company_documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "licitacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "orgao" TEXT,
    "modalidade" TEXT,
    "editalUrl" TEXT,
    "sessionAt" DATETIME,
    "submissionDeadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "saleValue" DECIMAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "licitacoes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "licitacao_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "licitacaoId" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "signed" BOOLEAN NOT NULL DEFAULT false,
    "issueDate" DATETIME,
    "expiresAt" DATETIME,
    "filePath" TEXT,
    "generatedFromTemplate" BOOLEAN NOT NULL DEFAULT false,
    "templatePath" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "licitacao_documents_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "licitacoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "licitacao_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "licitacaoId" TEXT NOT NULL,
    "eventAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldStatus" TEXT,
    "newStatus" TEXT,
    "description" TEXT,
    "createdById" TEXT,
    CONSTRAINT "licitacao_events_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "licitacoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "licitacao_events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "app_users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_authUserId_key" ON "app_users"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "companies"("cnpj");

-- CreateIndex
CREATE INDEX "members_company_user_idx" ON "company_members"("companyId", "userId");

-- CreateIndex
CREATE INDEX "company_documents_companyId_idx" ON "company_documents"("companyId");

-- CreateIndex
CREATE INDEX "licitacoes_companyId_status_idx" ON "licitacoes"("companyId", "status");

-- CreateIndex
CREATE INDEX "licitacao_documents_licitacaoId_idx" ON "licitacao_documents"("licitacaoId");

-- CreateIndex
CREATE INDEX "licitacao_events_licitacaoId_idx" ON "licitacao_events"("licitacaoId");
