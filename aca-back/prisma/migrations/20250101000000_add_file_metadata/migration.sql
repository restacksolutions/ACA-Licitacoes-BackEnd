-- AddFileMetadata
-- Adiciona colunas de metadados de arquivo nas tabelas de documentos

-- Adicionar colunas na tabela company_documents
ALTER TABLE "public"."company_documents" ADD COLUMN "file_bytes" BYTEA;
ALTER TABLE "public"."company_documents" ADD COLUMN "mime_type" TEXT DEFAULT 'application/pdf';
ALTER TABLE "public"."company_documents" ADD COLUMN "file_size" BIGINT;
ALTER TABLE "public"."company_documents" ADD COLUMN "sha256_hex" TEXT;

-- Adicionar colunas na tabela licitacao_documents
ALTER TABLE "public"."licitacao_documents" ADD COLUMN "file_bytes" BYTEA;
ALTER TABLE "public"."licitacao_documents" ADD COLUMN "mime_type" TEXT DEFAULT 'application/pdf';
ALTER TABLE "public"."licitacao_documents" ADD COLUMN "file_size" BIGINT;
ALTER TABLE "public"."licitacao_documents" ADD COLUMN "sha256_hex" TEXT;

-- Criar índices únicos para evitar duplicatas
CREATE UNIQUE INDEX "company_documents_company_id_doc_type_version_key" ON "public"."company_documents"("company_id", "doc_type", "version");
CREATE INDEX "company_documents_company_id_doc_type_idx" ON "public"."company_documents"("company_id", "doc_type");

CREATE UNIQUE INDEX "licitacao_documents_licitacao_id_doc_type_version_key" ON "public"."licitacao_documents"("licitacao_id", "doc_type", "version");
CREATE INDEX "licitacao_documents_licitacao_id_doc_type_idx" ON "public"."licitacao_documents"("licitacao_id", "doc_type");
