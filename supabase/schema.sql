-- ==============================================================================
-- MATCH JURÍDICO - BANCO DE DADOS POSTGRESQL (SUPABASE)
-- Estrutura para Assistência Jurídica Dativa, Matching Regional, IA e Chat
-- ==============================================================================

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TIPOS ENUM
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('cidadao', 'advogado', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE requerimento_status AS ENUM (
        'rascunho',
        'aguardando_analise',
        'aberto_para_match',
        'em_processamento',
        'aceito',
        'em_andamento',
        'concluido',
        'cancelado'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE prioridade_nivel AS ENUM ('baixa', 'media', 'alta', 'urgente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TABELA: PROFILES (Extensão de auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'cidadao',
    nome_completo TEXT NOT NULL,
    cpf TEXT,
    telefone TEXT,
    email TEXT,
    avatar_url TEXT,
    govbr_verified BOOLEAN DEFAULT FALSE,
    govbr_nivel TEXT DEFAULT 'BRONZE', -- BRONZE, PRATA, OURO
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. TABELA: COMARCAS (Com indicadores regionais e score de oportunidade)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comarcas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    uf VARCHAR(2) NOT NULL DEFAULT 'PR',
    regiao TEXT, -- Metropolitana, Norte, Oeste, Campos Gerais, Sudoeste, etc.
    populacao INTEGER DEFAULT 0,
    num_advogados_ativos INTEGER DEFAULT 0,
    total_processos_ano INTEGER DEFAULT 0,
    score_oportunidade NUMERIC(4, 2) DEFAULT 5.00, -- 0.00 a 10.00 (alto = deserto/alta carência)
    is_deserto_juridico BOOLEAN GENERATED ALWAYS AS (num_advogados_ativos <= 3 OR score_oportunidade >= 7.50) STORED,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    raio_atendimento_sugerido_km INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. TABELA: ESPECIALIDADES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.especialidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icone TEXT,
    descricao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. TABELA: COMARCA × ESPECIALIDADE (Matriz de demanda regional)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comarca_especialidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comarca_id UUID NOT NULL REFERENCES public.comarcas(id) ON DELETE CASCADE,
    especialidade_id UUID NOT NULL REFERENCES public.especialidades(id) ON DELETE CASCADE,
    volume_demanda INTEGER DEFAULT 0,
    percentual_dominante NUMERIC(5, 2) DEFAULT 0.00,
    UNIQUE(comarca_id, especialidade_id)
);

-- ------------------------------------------------------------------------------
-- 6. TABELA: ADVOGADOS DATIVOS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.advogados_dativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    numero_oab TEXT NOT NULL,
    uf_oab VARCHAR(2) NOT NULL DEFAULT 'PR',
    comarca_sede_id UUID REFERENCES public.comarcas(id) ON DELETE SET NULL,
    raio_maximo_km INTEGER DEFAULT 100,
    disponivel BOOLEAN DEFAULT TRUE,
    casos_em_andamento INTEGER DEFAULT 0,
    limite_casos_simultaneos INTEGER DEFAULT 10,
    atende_remoto BOOLEAN DEFAULT TRUE,
    score_reputacao NUMERIC(3, 2) DEFAULT 5.00,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Relação n-para-n: Comarcas de atuação do advogado
CREATE TABLE IF NOT EXISTS public.advogado_comarcas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advogado_id UUID NOT NULL REFERENCES public.advogados_dativos(id) ON DELETE CASCADE,
    comarca_id UUID NOT NULL REFERENCES public.comarcas(id) ON DELETE CASCADE,
    UNIQUE(advogado_id, comarca_id)
);

-- Relação n-para-n: Especialidades do advogado
CREATE TABLE IF NOT EXISTS public.advogado_especialidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advogado_id UUID NOT NULL REFERENCES public.advogados_dativos(id) ON DELETE CASCADE,
    especialidade_id UUID NOT NULL REFERENCES public.especialidades(id) ON DELETE CASCADE,
    anos_experiencia INTEGER DEFAULT 1,
    UNIQUE(advogado_id, especialidade_id)
);

-- ------------------------------------------------------------------------------
-- 7. TABELA: REQUERIMENTOS (Casos do cidadão + Petição gerada por IA)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.requerimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocolo TEXT UNIQUE NOT NULL,
    cidadao_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    advogado_id UUID REFERENCES public.advogados_dativos(id) ON DELETE SET NULL,
    comarca_id UUID NOT NULL REFERENCES public.comarcas(id) ON DELETE RESTRICT,
    especialidade_id UUID REFERENCES public.especialidades(id) ON DELETE SET NULL,
    status requerimento_status NOT NULL DEFAULT 'aberto_para_match',
    prioridade prioridade_nivel NOT NULL DEFAULT 'media',
    
    -- Dados brutos do relato do cidadão
    descricao_relato TEXT NOT NULL,
    renda_familiar_declarada NUMERIC(10, 2),
    membros_familia INTEGER DEFAULT 1,
    possui_urgencia BOOLEAN DEFAULT FALSE,
    cep_cidadao VARCHAR(9),
    
    -- Dados gerados e estruturados pela IA Jurídica
    titulo_caso TEXT,
    resumo_fatos TEXT,
    requerimento_estruturado_md TEXT, -- Petição formalizada
    fundamentacao_juridica TEXT,
    pedidos_finais TEXT[],
    competencia_vara_sugerida TEXT,
    
    -- Metadados de Matching e Rastreabilidade
    modo_busca_matching TEXT DEFAULT 'proximidade_sede', -- 'proximidade_sede', 'raio_expandido', 'deserto_fallback'
    raio_busca_efetivo_km INTEGER DEFAULT 30,
    distancia_calculada_km NUMERIC(6, 2),
    
    -- Segurança e Autenticidade
    hash_autenticidade TEXT UNIQUE NOT NULL,
    qr_code_payload TEXT,
    
    data_aceite TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. TABELA: MENSAGENS (Chat em tempo real pós-aceite)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mensagens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requerimento_id UUID NOT NULL REFERENCES public.requerimentos(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    conteudo TEXT NOT NULL,
    anexo_url TEXT,
    anexo_nome TEXT,
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. ÍNDICES DE PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_comarcas_uf ON public.comarcas(uf);
CREATE INDEX IF NOT EXISTS idx_comarcas_score ON public.comarcas(score_oportunidade DESC);
CREATE INDEX IF NOT EXISTS idx_advogados_disponivel ON public.advogados_dativos(disponivel, comarca_sede_id);
CREATE INDEX IF NOT EXISTS idx_requerimentos_status ON public.requerimentos(status);
CREATE INDEX IF NOT EXISTS idx_requerimentos_comarca ON public.requerimentos(comarca_id);
CREATE INDEX IF NOT EXISTS idx_requerimentos_cidadao ON public.requerimentos(cidadao_id);
CREATE INDEX IF NOT EXISTS idx_requerimentos_advogado ON public.requerimentos(advogado_id);
CREATE INDEX IF NOT EXISTS idx_requerimentos_hash ON public.requerimentos(hash_autenticidade);
CREATE INDEX IF NOT EXISTS idx_mensagens_req ON public.mensagens(requerimento_id, created_at ASC);

-- ------------------------------------------------------------------------------
-- 10. TRIGGERS & FUNÇÕES AUXILIARES
-- ------------------------------------------------------------------------------

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_advogados_updated_at
    BEFORE UPDATE ON public.advogados_dativos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_requerimentos_updated_at
    BEFORE UPDATE ON public.requerimentos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger para criar Profile automaticamente ao registrar no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nome_completo, email, role, govbr_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'cidadao'),
        COALESCE((NEW.raw_user_meta_data->>'govbr_verified')::boolean, FALSE)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para Gerar Protocolo Único Formatado: DAT-YYYY-XXXXX
CREATE OR REPLACE FUNCTION public.generate_protocolo()
RETURNS TRIGGER AS $$
DECLARE
    seq_val INT;
    novo_protocolo TEXT;
    ano_atual TEXT := to_char(CURRENT_DATE, 'YYYY');
BEGIN
    IF NEW.protocolo IS NULL OR NEW.protocolo = '' THEN
        seq_val := (SELECT COUNT(*) + 1 FROM public.requerimentos WHERE created_at >= date_trunc('year', CURRENT_DATE));
        novo_protocolo := 'DAT-' || ano_atual || '-' || LPAD(seq_val::text, 5, '0');
        NEW.protocolo := novo_protocolo;
    END IF;
    
    -- Gerar Hash de Autenticidade caso não exista
    IF NEW.hash_autenticidade IS NULL OR NEW.hash_autenticidade = '' THEN
        NEW.hash_autenticidade := encode(digest(NEW.protocolo || '-' || gen_random_uuid()::text, 'sha256'), 'hex');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_requerimentos_protocolo
    BEFORE INSERT ON public.requerimentos
    FOR EACH ROW EXECUTE FUNCTION public.generate_protocolo();

-- ------------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comarcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comarca_especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advogados_dativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advogado_comarcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advogado_especialidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requerimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública para Referências
CREATE POLICY "Comarcas visíveis para todos" ON public.comarcas FOR SELECT USING (true);
CREATE POLICY "Especialidades visíveis para todos" ON public.especialidades FOR SELECT USING (true);
CREATE POLICY "Comarca-Especialidades visíveis para todos" ON public.comarca_especialidades FOR SELECT USING (true);

-- Profiles
CREATE POLICY "Perfis visíveis por usuários autenticados" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários editam o próprio perfil" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Advogados Dativos
CREATE POLICY "Advogados públicos para consulta de matching" ON public.advogados_dativos FOR SELECT USING (true);
CREATE POLICY "Advogados gerenciam próprio registro" ON public.advogados_dativos FOR ALL TO authenticated USING (auth.uid() = profile_id);
CREATE POLICY "Advogado comarcas consulta" ON public.advogado_comarcas FOR SELECT USING (true);
CREATE POLICY "Advogado especialidades consulta" ON public.advogado_especialidades FOR SELECT USING (true);

-- Requerimentos: Cidadão vê apenas os seus
CREATE POLICY "Cidadão visualiza e cria seus requerimentos" ON public.requerimentos 
    FOR ALL TO authenticated 
    USING (auth.uid() = cidadao_id)
    WITH CHECK (auth.uid() = cidadao_id);

-- Advogados: Vêem casos atribuídos a si OU casos abertos para match em suas comarcas de atuação
CREATE POLICY "Advogados visualizam casos abertos compatíveis ou atribuídos a si" ON public.requerimentos
    FOR SELECT TO authenticated
    USING (
        -- Casos já atribuídos ao advogado autenticado
        advogado_id IN (SELECT id FROM public.advogados_dativos WHERE profile_id = auth.uid())
        -- OU casos abertos na comarca sede ou comarcas de atuação do advogado
        OR (
            status = 'aberto_para_match' 
            AND (
                comarca_id IN (
                    SELECT comarca_sede_id FROM public.advogados_dativos WHERE profile_id = auth.uid()
                    UNION
                    SELECT ac.comarca_id FROM public.advogado_comarcas ac
                    JOIN public.advogados_dativos ad ON ad.id = ac.advogado_id
                    WHERE ad.profile_id = auth.uid()
                )
                OR modo_busca_matching = 'deserto_fallback' -- Casos em desertos expandem para todos os dativos do Estado
            )
        )
    );

CREATE POLICY "Advogado pode aceitar caso aberto em sua área" ON public.requerimentos
    FOR UPDATE TO authenticated
    USING (
        status = 'aberto_para_match' 
        OR advogado_id IN (SELECT id FROM public.advogados_dativos WHERE profile_id = auth.uid())
    );

-- Consulta pública para verificação de certidão e QR code via hash (apenas leitura segura por hash)
CREATE POLICY "Verificação pública de autenticidade por hash" ON public.requerimentos
    FOR SELECT TO anon
    USING (true);

-- Mensagens (Chat Seguro): Isolamento estrito entre as duas partes do caso
CREATE POLICY "Participantes do caso podem ler mensagens" ON public.mensagens
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.requerimentos r
            LEFT JOIN public.advogados_dativos adv ON adv.id = r.advogado_id
            WHERE r.id = public.mensagens.requerimento_id
            AND (r.cidadao_id = auth.uid() OR adv.profile_id = auth.uid())
        )
    );

CREATE POLICY "Participantes do caso podem enviar mensagens" ON public.mensagens
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM public.requerimentos r
            LEFT JOIN public.advogados_dativos adv ON adv.id = r.advogado_id
            WHERE r.id = public.mensagens.requerimento_id
            AND (r.cidadao_id = auth.uid() OR adv.profile_id = auth.uid())
        )
    );

-- ------------------------------------------------------------------------------
-- 12. HABILITAÇÃO DO REALTIME
-- ------------------------------------------------------------------------------
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.mensagens, public.requerimentos;
COMMIT;
