-- CreateEnum
CREATE TYPE "public"."RoleCompany" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "public"."LicitacaoStatus" AS ENUM ('draft', 'open', 'closed', 'cancelled', 'awarded');

-- CreateTable
CREATE TABLE "public"."app_users" (
    "id" TEXT NOT NULL,
    "auth_user_id" TEXT NOT NULL,
    "full_name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "logo_path" TEXT,
    "letterhead_path" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_members" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "public"."RoleCompany" NOT NULL DEFAULT 'member',

    CONSTRAINT "company_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."company_documents" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "doc_number" TEXT,
    "issuer" TEXT,
    "issue_date" DATE,
    "expires_at" DATE,
    "file_path" TEXT,
    "notes" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."licitacoes" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "orgao" TEXT,
    "modalidade" TEXT,
    "edital_url" TEXT,
    "session_at" TIMESTAMP(3),
    "submission_deadline" TIMESTAMP(3),
    "status" "public"."LicitacaoStatus" NOT NULL DEFAULT 'draft',
    "sale_value" DECIMAL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."licitacao_documents" (
    "id" TEXT NOT NULL,
    "licitacao_id" TEXT NOT NULL,
    "doc_type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "signed" BOOLEAN NOT NULL DEFAULT false,
    "issue_date" DATE,
    "expires_at" DATE,
    "file_path" TEXT,
    "generated_from_template" BOOLEAN NOT NULL DEFAULT false,
    "template_path" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licitacao_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."licitacao_events" (
    "id" TEXT NOT NULL,
    "licitacao_id" TEXT NOT NULL,
    "event_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "old_status" "public"."LicitacaoStatus",
    "new_status" "public"."LicitacaoStatus",
    "description" TEXT,
    "created_by" TEXT,

    CONSTRAINT "licitacao_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."car_brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "car_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vehicle_models" (
    "id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "year_from" INTEGER,
    "year_to" INTEGER,
    "specs" JSONB NOT NULL DEFAULT '{}',
    "extra_info" TEXT,

    CONSTRAINT "vehicle_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_users_auth_user_id_key" ON "public"."app_users"("auth_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_users_email_key" ON "public"."app_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "public"."companies"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "car_brands_name_key" ON "public"."car_brands"("name");

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_members" ADD CONSTRAINT "company_members_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_members" ADD CONSTRAINT "company_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."app_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."company_documents" ADD CONSTRAINT "company_documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."licitacoes" ADD CONSTRAINT "licitacoes_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."licitacao_documents" ADD CONSTRAINT "licitacao_documents_licitacao_id_fkey" FOREIGN KEY ("licitacao_id") REFERENCES "public"."licitacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."licitacao_events" ADD CONSTRAINT "licitacao_events_licitacao_id_fkey" FOREIGN KEY ("licitacao_id") REFERENCES "public"."licitacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."licitacao_events" ADD CONSTRAINT "licitacao_events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."app_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vehicle_models" ADD CONSTRAINT "vehicle_models_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."car_brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
