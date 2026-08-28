import { Comarca, Especialidade, AdvogadoDativo, Requerimento } from '@/types/database';

export const ESPECIALIDADES_DATA: Especialidade[] = [
  {
    id: 'esp-familia',
    nome: 'Direito de Família e Sucessões',
    slug: 'familia-sucessoes',
    icone: 'Users',
    descricao: 'Ações de alimentos, guarda, divórcio, reconhecimento de paternidade e inventários.'
  },
  {
    id: 'esp-civel',
    nome: 'Direito Cível e Consumidor',
    slug: 'civel-consumidor',
    icone: 'Scale',
    descricao: 'Contratos, indenizações por danos morais/materiais, posse, despejo e relações de consumo.'
  },
  {
    id: 'esp-criminal',
    nome: 'Defesa Criminal e Execução Penal',
    slug: 'criminal-penal',
    icone: 'ShieldAlert',
    descricao: 'Defesa em inquéritos policiais, audiências de custódia, tribunal do júri e recursos criminais.'
  },
  {
    id: 'esp-previdenciario',
    nome: 'Direito Previdenciário (INSS)',
    slug: 'previdenciario',
    icone: 'HeartPulse',
    descricao: 'Aposentadorias por idade/tempo, auxílio-doença, BPC/LOAS e pensão por morte.'
  },
  {
    id: 'esp-trabalhista',
    nome: 'Direito do Trabalho',
    slug: 'trabalhista',
    icone: 'Briefcase',
    descricao: 'Verbas rescisórias, vínculo empregatício, horas extras e acidentes de trabalho.'
  },
  {
    id: 'esp-fazenda',
    nome: 'Fazenda Pública e Saúde',
    slug: 'fazenda-publica',
    icone: 'Building2',
    descricao: 'Fornecimento de medicamentos de alto custo pelo SUS, leitos de UTI e ações contra entes públicos.'
  },
  {
    id: 'esp-infancia',
    nome: 'Infância e Juventude',
    slug: 'infancia-juventude',
    icone: 'Baby',
    descricao: 'Medidas protetivas, acolhimento institucional, adoção e atos infracionais.'
  }
];

export const COMARCAS_DATA: Comarca[] = [
  {
    id: 'com-reserva',
    nome: 'Reserva',
    uf: 'PR',
    regiao: 'Campos Gerais',
    populacao: 26825,
    num_advogados_ativos: 2,
    total_processos_ano: 1840,
    score_oportunidade: 9.8,
    is_deserto_juridico: true,
    latitude: -24.6506,
    longitude: -50.8508,
    raio_atendimento_sugerido_km: 75
  },
  {
    id: 'com-capanema',
    nome: 'Capanema',
    uf: 'PR',
    regiao: 'Sudoeste',
    populacao: 19131,
    num_advogados_ativos: 3,
    total_processos_ano: 1420,
    score_oportunidade: 9.2,
    is_deserto_juridico: true,
    latitude: -25.6697,
    longitude: -53.8081,
    raio_atendimento_sugerido_km: 60
  },
  {
    id: 'com-ivaipora',
    nome: 'Ivaiporã',
    uf: 'PR',
    regiao: 'Centro-Norte',
    populacao: 32304,
    num_advogados_ativos: 5,
    total_processos_ano: 2980,
    score_oportunidade: 8.5,
    is_deserto_juridico: true,
    latitude: -24.2486,
    longitude: -51.6836,
    raio_atendimento_sugerido_km: 60
  },
  {
    id: 'com-uniao-vitoria',
    nome: 'União da Vitória',
    uf: 'PR',
    regiao: 'Sul',
    populacao: 57987,
    num_advogados_ativos: 11,
    total_processos_ano: 5400,
    score_oportunidade: 7.8,
    is_deserto_juridico: true,
    latitude: -26.2269,
    longitude: -51.0872,
    raio_atendimento_sugerido_km: 50
  },
  {
    id: 'com-telemaco-borba',
    nome: 'Telêmaco Borba',
    uf: 'PR',
    regiao: 'Campos Gerais',
    populacao: 79792,
    num_advogados_ativos: 16,
    total_processos_ano: 7200,
    score_oportunidade: 7.1,
    is_deserto_juridico: false,
    latitude: -24.3239,
    longitude: -50.6156,
    raio_atendimento_sugerido_km: 45
  },
  {
    id: 'com-guarapuava',
    nome: 'Guarapuava',
    uf: 'PR',
    regiao: 'Centro-Sul',
    populacao: 182644,
    num_advogados_ativos: 38,
    total_processos_ano: 16500,
    score_oportunidade: 6.4,
    is_deserto_juridico: false,
    latitude: -25.3953,
    longitude: -51.4625,
    raio_atendimento_sugerido_km: 40
  },
  {
    id: 'com-paranagua',
    nome: 'Paranaguá',
    uf: 'PR',
    regiao: 'Litoral',
    populacao: 156058,
    num_advogados_ativos: 42,
    total_processos_ano: 14800,
    score_oportunidade: 5.9,
    is_deserto_juridico: false,
    latitude: -25.5205,
    longitude: -48.5095,
    raio_atendimento_sugerido_km: 35
  },
  {
    id: 'com-ponta-grossa',
    nome: 'Ponta Grossa',
    uf: 'PR',
    regiao: 'Campos Gerais',
    populacao: 358838,
    num_advogados_ativos: 94,
    total_processos_ano: 32000,
    score_oportunidade: 4.8,
    is_deserto_juridico: false,
    latitude: -25.0994,
    longitude: -50.1583,
    raio_atendimento_sugerido_km: 30
  },
  {
    id: 'com-cascavel',
    nome: 'Cascavel',
    uf: 'PR',
    regiao: 'Oeste',
    populacao: 348051,
    num_advogados_ativos: 112,
    total_processos_ano: 34500,
    score_oportunidade: 4.2,
    is_deserto_juridico: false,
    latitude: -24.9578,
    longitude: -53.4595,
    raio_atendimento_sugerido_km: 30
  },
  {
    id: 'com-foz-iguacu',
    nome: 'Foz do Iguaçu',
    uf: 'PR',
    regiao: 'Oeste',
    populacao: 258248,
    num_advogados_ativos: 88,
    total_processos_ano: 27900,
    score_oportunidade: 4.5,
    is_deserto_juridico: false,
    latitude: -25.5163,
    longitude: -54.5854,
    raio_atendimento_sugerido_km: 30
  },
  {
    id: 'com-londrina',
    nome: 'Londrina',
    uf: 'PR',
    regiao: 'Norte',
    populacao: 575377,
    num_advogados_ativos: 220,
    total_processos_ano: 58000,
    score_oportunidade: 3.1,
    is_deserto_juridico: false,
    latitude: -23.3045,
    longitude: -51.1696,
    raio_atendimento_sugerido_km: 25
  },
  {
    id: 'com-maringa',
    nome: 'Maringá',
    uf: 'PR',
    regiao: 'Norte-Noroeste',
    populacao: 436472,
    num_advogados_ativos: 185,
    total_processos_ano: 46000,
    score_oportunidade: 2.9,
    is_deserto_juridico: false,
    latitude: -23.4205,
    longitude: -51.9331,
    raio_atendimento_sugerido_km: 25
  },
  {
    id: 'com-curitiba',
    nome: 'Curitiba (Foro Central)',
    uf: 'PR',
    regiao: 'Metropolitana de Curitiba',
    populacao: 1963726,
    num_advogados_ativos: 680,
    total_processos_ano: 195000,
    score_oportunidade: 1.8,
    is_deserto_juridico: false,
    latitude: -25.4284,
    longitude: -49.2733,
    raio_atendimento_sugerido_km: 20
  }
];

export const MOCK_ADVOGADOS: AdvogadoDativo[] = [
  {
    id: 'adv-01',
    profile_id: 'prof-adv-01',
    numero_oab: '94.812',
    uf_oab: 'PR',
    comarca_sede_id: 'com-ponta-grossa',
    comarca_sede: COMARCAS_DATA.find(c => c.id === 'com-ponta-grossa'),
    raio_maximo_km: 120,
    disponivel: true,
    casos_em_andamento: 3,
    limite_casos_simultaneos: 8,
    atende_remoto: true,
    score_reputacao: 4.95,
    bio: 'Advogada especialista em Direito de Família e Defesa do Consumidor, atuando em comarcas dos Campos Gerais com foco em conciliação e celeridade processual.',
    profile: {
      id: 'prof-adv-01',
      role: 'advogado',
      nome_completo: 'Dra. Camila Vasconcelos de Oliveira',
      cpf: '***.492.109-**',
      telefone: '(42) 99124-8833',
      email: 'camila.vasconcelos.adv@oabpr.org.br',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      govbr_verified: true,
      govbr_nivel: 'OURO',
      created_at: '2025-01-10T10:00:00Z',
      updated_at: '2026-08-20T10:00:00Z'
    },
    especialidades: [
      ESPECIALIDADES_DATA[0], // Família
      ESPECIALIDADES_DATA[1], // Cível
      ESPECIALIDADES_DATA[3]  // Previdenciário
    ]
  },
  {
    id: 'adv-02',
    profile_id: 'prof-adv-02',
    numero_oab: '81.450',
    uf_oab: 'PR',
    comarca_sede_id: 'com-londrina',
    comarca_sede: COMARCAS_DATA.find(c => c.id === 'com-londrina'),
    raio_maximo_km: 150,
    disponivel: true,
    casos_em_andamento: 2,
    limite_casos_simultaneos: 10,
    atende_remoto: true,
    score_reputacao: 4.88,
    bio: 'Advogado criminalista e previdenciarista, com ampla experiência em assistência judiciária gratuita e defesas em comarcas do interior.',
    profile: {
      id: 'prof-adv-02',
      role: 'advogado',
      nome_completo: 'Dr. Lucas Henrique Mendonça',
      cpf: '***.813.449-**',
      telefone: '(43) 98841-5520',
      email: 'lucas.mendonca.dativo@oabpr.org.br',
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      govbr_verified: true,
      govbr_nivel: 'PRATA',
      created_at: '2025-02-15T10:00:00Z',
      updated_at: '2026-08-25T10:00:00Z'
    },
    especialidades: [
      ESPECIALIDADES_DATA[2], // Criminal
      ESPECIALIDADES_DATA[3], // Previdenciário
      ESPECIALIDADES_DATA[5]  // Fazenda Pública
    ]
  },
  {
    id: 'adv-03',
    profile_id: 'prof-adv-03',
    numero_oab: '102.340',
    uf_oab: 'PR',
    comarca_sede_id: 'com-guarapuava',
    comarca_sede: COMARCAS_DATA.find(c => c.id === 'com-guarapuava'),
    raio_maximo_km: 180,
    disponivel: true,
    casos_em_andamento: 1,
    limite_casos_simultaneos: 12,
    atende_remoto: true,
    score_reputacao: 5.0,
    bio: 'Defensor dativo credenciado pela OAB/PR, voluntário em projetos de ampliação de acesso à justiça no Centro-Sul e Oeste paranaense.',
    profile: {
      id: 'prof-adv-03',
      role: 'advogado',
      nome_completo: 'Dr. Roberto Santiago Brandão',
      cpf: '***.194.889-**',
      telefone: '(42) 99877-1199',
      email: 'roberto.santiago@dativos-pr.org.br',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      govbr_verified: true,
      govbr_nivel: 'OURO',
      created_at: '2025-03-01T10:00:00Z',
      updated_at: '2026-08-26T10:00:00Z'
    },
    especialidades: [
      ESPECIALIDADES_DATA[0], // Família
      ESPECIALIDADES_DATA[4], // Trabalhista
      ESPECIALIDADES_DATA[6]  // Infância
    ]
  }
];

export const MOCK_REQUERIMENTOS: Requerimento[] = [
  {
    id: 'req-001',
    protocolo: 'DAT-2026-00418',
    cidadao_id: 'prof-cid-01',
    cidadao: {
      id: 'prof-cid-01',
      role: 'cidadao',
      nome_completo: 'Maria Aparecida dos Santos',
      cpf: '***.582.309-**',
      telefone: '(42) 99812-4011',
      email: 'maria.aparecida@email.com',
      govbr_verified: true,
      govbr_nivel: 'PRATA',
      created_at: '2026-08-20T12:00:00Z',
      updated_at: '2026-08-20T12:00:00Z'
    },
    advogado_id: 'adv-01',
    advogado: MOCK_ADVOGADOS[0],
    comarca_id: 'com-reserva',
    comarca: COMARCAS_DATA.find(c => c.id === 'com-reserva'),
    especialidade_id: 'esp-familia',
    especialidade: ESPECIALIDADES_DATA[0],
    status: 'aceito',
    prioridade: 'alta',
    descricao_relato: 'Sou mãe solo de duas crianças (6 e 9 anos). O pai mudou de cidade há 7 meses e parou totalmente de pagar a pensão alimentícia que tínhamos combinado verbalmente. Não tenho renda fixa e dependo do Bolsa Família para alimentar meus filhos.',
    renda_familiar_declarada: 750,
    membros_familia: 3,
    possui_urgencia: true,
    cep_cidadao: '84320-000',
    titulo_caso: 'Ação de Alimentos c/c Fixação de Alimentos Provisórios de Urgência',
    resumo_fatos: 'Cidadã necessita de fixação e cobrança de alimentos em favor de 2 filhos menores impúberes, diante do abandono material e interrupção unilateral de auxílio pelo genitor.',
    requerimento_estruturado_md: `### EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA VARA DE FAMÍLIA DA COMARCA DE RESERVA - ESTADO DO PARANÁ

**REQUERENTE:** MARIA APARECIDA DOS SANTOS, brasileira, solteira, desempregada, inscrita no CPF sob o nº ***.582.309-**, residente e domiciliada na Comarca de Reserva/PR.  
**ASSISTÊNCIA:** NOMEAÇÃO DE ADVOGADO DATIVO / JUSTIÇA GRATUITA (Art. 5º, LXXIV da CF/88 e Lei Estadual nº 18.664/2015).

#### I. DOS FATOS
A requerente conviveu em união estável da qual advieram 2 (dois) filhos menores. Há aproximadamente 7 (sete) meses, o genitor ausentou-se do domicílio comum, cessando qualquer contribuição para o sustento dos infantes.

#### II. DO DIREITO E DA NECESSIDADE DE DEFENSOR DATIVO
Nos termos do Art. 227 da Constituição Federal e Arts. 1.694 e seguintes do Código Civil, o dever de sustento é irrenunciável e prioritário. Diante da ausência de Defensoria Pública instalada na comarca local com atuação contínua no feito, requer-se a nomeação de advogado dativo credenciado.

#### III. DOS PEDIDOS
1. A concessão dos benefícios da **Justiça Gratuita**;
2. A fixação liminar de **Alimentos Provisórios** no valor de 30% do salário mínimo nacional;
3. A citação do genitor para responder aos termos da presente demanda;
4. A homologação da designação do advogado dativo aceitante para condução dos atos processuais.

Nestes termos,  
Pede deferimento.`,
    fundamentacao_juridica: 'Art. 227 da CF/88; Arts. 1.694 e 1.696 do Código Civil; Lei nº 5.478/1968 (Lei de Alimentos).',
    pedidos_finais: ['Justiça Gratuita', 'Alimentos Provisórios Urgentes', 'Citação do Réu'],
    competencia_vara_sugerida: 'Vara de Família e Anexos da Comarca de Reserva/PR',
    modo_busca_matching: 'deserto_fallback',
    raio_busca_efetivo_km: 120,
    distancia_calculada_km: 78.4,
    hash_autenticidade: 'e7a3b98c4f1d02e88a912e5c66d741f0a9b2c3d4e5f60718293a4b5c6d7e8f90',
    data_aceite: '2026-08-25T14:30:00Z',
    created_at: '2026-08-25T11:15:00Z',
    updated_at: '2026-08-25T14:30:00Z'
  },
  {
    id: 'req-002',
    protocolo: 'DAT-2026-00419',
    cidadao_id: 'prof-cid-02',
    cidadao: {
      id: 'prof-cid-02',
      role: 'cidadao',
      nome_completo: 'João Carlos Bittencourt',
      cpf: '***.721.909-**',
      telefone: '(46) 99755-3210',
      email: 'joao.bittencourt@email.com',
      govbr_verified: true,
      govbr_nivel: 'BRONZE',
      created_at: '2026-08-27T08:00:00Z',
      updated_at: '2026-08-27T08:00:00Z'
    },
    comarca_id: 'com-capanema',
    comarca: COMARCAS_DATA.find(c => c.id === 'com-capanema'),
    especialidade_id: 'esp-previdenciario',
    especialidade: ESPECIALIDADES_DATA[3],
    status: 'aberto_para_match',
    prioridade: 'urgente',
    descricao_relato: 'Trabalhei como agricultor familiar a vida toda e sofri um acidente grave com maquinário agrícola. O INSS negou meu pedido de auxílio por incapacidade temporária alegando falta de qualidade de segurado rural, mesmo eu tendo os blocos de produtor.',
    renda_familiar_declarada: 1200,
    membros_familia: 2,
    possui_urgencia: true,
    cep_cidadao: '85760-000',
    titulo_caso: 'Ação Previdenciária de Concessão de Benefício por Incapacidade Rural (Auxílio por Incapacidade Temporária / Aposentadoria por Invalidez)',
    resumo_fatos: 'Segurado especial rural incapacitado para atividades habituais em decorrência de traumatismo, com indeferimento administrativo indevido pelo INSS.',
    requerimento_estruturado_md: `### EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) FEDERAL DA SUBSEÇÃO JUDICIÁRIA COMPETENTE / VARA CÍVEL DA COMARCA DE CAPANEMA/PR

**REQUERENTE:** JOÃO CARLOS BITTENCOURT, agricultor familiar, hipossuficiente.  
**DEMANDADO:** INSTITUTO NACIONAL DO SEGURO SOCIAL - INSS.

#### I. SÍNTESE DA SITUAÇÃO FÁTICA
O requerente é segurado especial, exercendo atividade rural em regime de economia familiar. Sofreu traumatismo funcional severo em membros superiores que inviabiliza o labor agrícola.

#### II. DO REQUERIMENTO DE NOMEAÇÃO DE DEFENSOR DATIVO
Comarca com carência de advogados dativos inscritos (Score de Oportunidade: 9.2). Requer-se o acolhimento imediato pelo sistema Match Jurídico.`,
    fundamentacao_juridica: 'Art. 201, I da CF/88; Arts. 11, VII, 42 e 59 da Lei nº 8.213/91.',
    pedidos_finais: ['Justiça Gratuita', 'Realização de Perícia Médica Judicial', 'Concessão do Benefício desde a DER'],
    competencia_vara_sugerida: 'Vara Cível / Competência Delegada Previdenciária de Capanema/PR',
    modo_busca_matching: 'deserto_fallback',
    raio_busca_efetivo_km: 150,
    hash_autenticidade: 'f8b4c09d5e2f13a99b023f6d77e852a1b0c3d4e5f6a718293b4c5d6e7f8a9b01',
    created_at: '2026-08-27T09:40:00Z',
    updated_at: '2026-08-27T09:40:00Z'
  }
];
