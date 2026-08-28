-- ==============================================================================
-- MATCH JURÍDICO - SCRIPT DE SEED (DADOS REAIS / ANÁLISE POR COMARCA)
-- Popula as tabelas de referência comarcas, especialidades e matriz de demanda
-- ==============================================================================

-- 1. Inserir Especialidades Jurídicas
INSERT INTO public.especialidades (id, nome, slug, icone, descricao)
VALUES
    ('11111111-1111-1111-1111-111111111101', 'Direito de Família e Sucessões', 'familia-sucessoes', 'Users', 'Ações de alimentos, guarda, divórcio, reconhecimento de paternidade e inventários.')
ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;

INSERT INTO public.especialidades (id, nome, slug, icone, descricao)
VALUES
    ('11111111-1111-1111-1111-111111111102', 'Direito Cível e Consumidor', 'civel-consumidor', 'Scale', 'Contratos, indenizações por danos morais/materiais, posse, despejo e relações de consumo.')
ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;

INSERT INTO public.especialidades (id, nome, slug, icone, descricao)
VALUES
    ('11111111-1111-1111-1111-111111111103', 'Defesa Criminal e Execução Penal', 'criminal-penal', 'ShieldAlert', 'Defesa em inquéritos policiais, audiências de custódia, tribunal do júri e recursos criminais.')
ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;

INSERT INTO public.especialidades (id, nome, slug, icone, descricao)
VALUES
    ('11111111-1111-1111-1111-111111111104', 'Direito Previdenciário (INSS)', 'previdenciario', 'HeartPulse', 'Aposentadorias por idade/tempo, auxílio-doença, BPC/LOAS e pensão por morte.')
ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;

INSERT INTO public.especialidades (id, nome, slug, icone, descricao)
VALUES
    ('11111111-1111-1111-1111-111111111105', 'Direito do Trabalho', 'trabalhista', 'Briefcase', 'Verbas rescisórias, vínculo empregatício, horas extras e acidentes de trabalho.')
ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;

INSERT INTO public.especialidades (id, nome, slug, icone, descricao)
VALUES
    ('11111111-1111-1111-1111-111111111106', 'Fazenda Pública e Saúde', 'fazenda-publica', 'Building2', 'Fornecimento de medicamentos de alto custo pelo SUS, leitos de UTI e ações contra entes públicos.')
ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;

INSERT INTO public.especialidades (id, nome, slug, icone, descricao)
VALUES
    ('11111111-1111-1111-1111-111111111107', 'Infância e Juventude', 'infancia-juventude', 'Baby', 'Medidas protetivas, acolhimento institucional, adoção e atos infracionais.')
ON CONFLICT (nome) DO UPDATE SET slug = EXCLUDED.slug;


-- 2. Inserir Comarcas com Dados de Oportunidade e Densidade de Advogados
INSERT INTO public.comarcas (id, nome, uf, regiao, populacao, num_advogados_ativos, total_processos_ano, score_oportunidade, latitude, longitude, raio_atendimento_sugerido_km)
VALUES
    ('22222222-2222-2222-2222-222222222201', 'Reserva', 'PR', 'Campos Gerais', 26825, 2, 1840, 9.80, -24.6506, -50.8508, 75),
    ('22222222-2222-2222-2222-222222222202', 'Capanema', 'PR', 'Sudoeste', 19131, 3, 1420, 9.20, -25.6697, -53.8081, 60),
    ('22222222-2222-2222-2222-222222222203', 'Ivaiporã', 'PR', 'Centro-Norte', 32304, 5, 2980, 8.50, -24.2486, -51.6836, 60),
    ('22222222-2222-2222-2222-222222222204', 'União da Vitória', 'PR', 'Sul', 57987, 11, 5400, 7.80, -26.2269, -51.0872, 50),
    ('22222222-2222-2222-2222-222222222205', 'Telêmaco Borba', 'PR', 'Campos Gerais', 79792, 16, 7200, 7.10, -24.3239, -50.6156, 45),
    ('22222222-2222-2222-2222-222222222206', 'Guarapuava', 'PR', 'Centro-Sul', 182644, 38, 16500, 6.40, -25.3953, -51.4625, 40),
    ('22222222-2222-2222-2222-222222222207', 'Paranaguá', 'PR', 'Litoral', 156058, 42, 14800, 5.90, -25.5205, -48.5095, 35),
    ('22222222-2222-2222-2222-222222222208', 'Ponta Grossa', 'PR', 'Campos Gerais', 358838, 94, 32000, 4.80, -25.0994, -50.1583, 30),
    ('22222222-2222-2222-2222-222222222209', 'Cascavel', 'PR', 'Oeste', 348051, 112, 34500, 4.20, -24.9578, -53.4595, 30),
    ('22222222-2222-2222-2222-222222222210', 'Foz do Iguaçu', 'PR', 'Oeste', 258248, 88, 27900, 4.50, -25.5163, -54.5854, 30),
    ('22222222-2222-2222-2222-222222222211', 'Londrina', 'PR', 'Norte', 575377, 220, 58000, 3.10, -23.3045, -51.1696, 25),
    ('22222222-2222-2222-2222-222222222212', 'Maringá', 'PR', 'Norte-Noroeste', 436472, 185, 46000, 2.90, -23.4205, -51.9331, 25),
    ('22222222-2222-2222-2222-222222222213', 'Curitiba (Foro Central)', 'PR', 'Metropolitana de Curitiba', 1963726, 680, 195000, 1.80, -25.4284, -49.2733, 20)
ON CONFLICT (id) DO NOTHING;


-- 3. Inserir Matriz de Demanda (Comarca × Especialidade)
INSERT INTO public.comarca_especialidades (comarca_id, especialidade_id, volume_demanda, percentual_dominante)
VALUES
    -- Reserva (Alta demanda em Família e Previdenciário)
    ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 740, 40.22),
    ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111104', 620, 33.70),
    
    -- Capanema (Alta demanda em Previdenciário Rural e Cível)
    ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111104', 680, 47.89),
    ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 390, 27.46),
    
    -- Ponta Grossa (Demanda diversificada)
    ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111101', 11200, 35.00),
    ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111103', 8900, 27.81),
    ('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111104', 7400, 23.13)
ON CONFLICT DO NOTHING;
