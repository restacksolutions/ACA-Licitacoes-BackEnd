-- AddRLSViewsIndexes
-- Implementa RLS por company_id, views de status e índices otimizados

-- 1. Criar view para status calculado de documentos da empresa
CREATE OR REPLACE VIEW v_company_documents AS
SELECT
  cd.*,
  CASE
    WHEN cd.expires_at IS NULL THEN 'Sem validade'
    WHEN cd.expires_at < CURRENT_DATE THEN 'Expirado'
    WHEN cd.expires_at <= CURRENT_DATE + INTERVAL '15 days' THEN 'À vencer'
    ELSE 'Válido'
  END AS status_calc
FROM public.company_documents cd;

-- 2. Criar view para usuários sem empresa (auditoria)
CREATE OR REPLACE VIEW v_users_without_company AS
SELECT u.id, u.email
FROM public.app_users u
LEFT JOIN public.company_members m ON m.user_id = u.id
WHERE m.user_id IS NULL;

-- 3. Adicionar índices otimizados para filtros
CREATE INDEX IF NOT EXISTS idx_company_documents_company_status ON public.company_documents(company_id, expires_at DESC);
CREATE INDEX IF NOT EXISTS idx_company_documents_company_type ON public.company_documents(company_id, doc_type);
CREATE INDEX IF NOT EXISTS idx_company_documents_status_calc ON public.company_documents(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_licitacoes_company ON public.licitacoes(company_id);
CREATE INDEX IF NOT EXISTS idx_licitacoes_status ON public.licitacoes(status);
CREATE INDEX IF NOT EXISTS idx_licitacoes_company_status ON public.licitacoes(company_id, status);

CREATE INDEX IF NOT EXISTS idx_licitacao_documents_licitacao ON public.licitacao_documents(licitacao_id);
CREATE INDEX IF NOT EXISTS idx_licitacao_documents_required_submitted ON public.licitacao_documents(required, submitted);
CREATE INDEX IF NOT EXISTS idx_licitacao_documents_licitacao_type ON public.licitacao_documents(licitacao_id, doc_type);

-- 4. Ativar RLS em todas as tabelas com company_id
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licitacao_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- 5. RLS será implementado via middleware do NestJS
-- As policies RLS serão criadas quando o sistema de autenticação estiver configurado
-- Por enquanto, apenas ativamos RLS sem policies específicas

-- 6. Adicionar constraint para garantir que licitacoes sempre tenham company_id
ALTER TABLE public.licitacoes ALTER COLUMN company_id SET NOT NULL;

-- 7. Adicionar trigger para updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas que precisam
DROP TRIGGER IF EXISTS update_company_documents_updated_at ON public.company_documents;
CREATE TRIGGER update_company_documents_updated_at
    BEFORE UPDATE ON public.company_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_licitacoes_updated_at ON public.licitacoes;
CREATE TRIGGER update_licitacoes_updated_at
    BEFORE UPDATE ON public.licitacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_licitacao_documents_updated_at ON public.licitacao_documents;
CREATE TRIGGER update_licitacao_documents_updated_at
    BEFORE UPDATE ON public.licitacao_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
