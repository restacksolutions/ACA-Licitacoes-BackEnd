-- CreateIndex
CREATE INDEX "LicitacaoDocument_licitacao_id_name_idx" ON "LicitacaoDocument"("licitacao_id", "name");

-- Se você já tinha criado via Prisma:
DROP INDEX IF EXISTS "LicitacaoDocument_licitacaoId_name_key";

-- Se você criou manualmente algum índice único:
DROP INDEX IF EXISTS licdoc_unique_name_per_licitacao;