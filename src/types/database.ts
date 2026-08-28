export type UserRole = 'cidadao' | 'advogado' | 'admin';

export type RequerimentoStatus = 
  | 'rascunho'
  | 'aguardando_analise'
  | 'aberto_para_match'
  | 'em_processamento'
  | 'aceito'
  | 'em_andamento'
  | 'concluido'
  | 'cancelado';

export type PrioridadeNivel = 'baixa' | 'media' | 'alta' | 'urgente';

export interface Profile {
  id: string;
  role: UserRole;
  nome_completo: string;
  cpf?: string;
  telefone?: string;
  email: string;
  avatar_url?: string;
  govbr_verified: boolean;
  govbr_nivel?: 'BRONZE' | 'PRATA' | 'OURO';
  created_at: string;
  updated_at: string;
}

export interface Comarca {
  id: string;
  nome: string;
  uf: string;
  regiao: string;
  populacao: number;
  num_advogados_ativos: number;
  total_processos_ano: number;
  score_oportunidade: number; // 0 a 10 (quanto maior, mais carente/maior oportunidade)
  is_deserto_juridico: boolean;
  latitude: number;
  longitude: number;
  raio_atendimento_sugerido_km: number;
  created_at?: string;
}

export interface Especialidade {
  id: string;
  nome: string;
  slug: string;
  icone: string;
  descricao: string;
}

export interface ComarcaEspecialidade {
  id: string;
  comarca_id: string;
  especialidade_id: string;
  volume_demanda: number;
  percentual_dominante: number;
}

export interface AdvogadoDativo {
  id: string;
  profile_id: string;
  numero_oab: string;
  uf_oab: string;
  comarca_sede_id?: string;
  comarca_sede?: Comarca;
  raio_maximo_km: number;
  disponivel: boolean;
  casos_em_andamento: number;
  limite_casos_simultaneos: number;
  atende_remoto: boolean;
  score_reputacao: number;
  bio?: string;
  profile?: Profile;
  comarcas_atuacao?: Comarca[];
  especialidades?: Especialidade[];
  created_at?: string;
}

export interface Requerimento {
  id: string;
  protocolo: string;
  cidadao_id: string;
  cidadao?: Profile;
  advogado_id?: string;
  advogado?: AdvogadoDativo;
  comarca_id: string;
  comarca?: Comarca;
  especialidade_id?: string;
  especialidade?: Especialidade;
  status: RequerimentoStatus;
  prioridade: PrioridadeNivel;
  
  // Dados brutos
  descricao_relato: string;
  renda_familiar_declarada?: number;
  membros_familia?: number;
  possui_urgencia: boolean;
  cep_cidadao?: string;
  
  // IA Jurídica
  titulo_caso?: string;
  resumo_fatos?: string;
  requerimento_estruturado_md?: string;
  fundamentacao_juridica?: string;
  pedidos_finais?: string[];
  competencia_vara_sugerida?: string;
  
  // Matching & Geometria
  modo_busca_matching: 'proximidade_sede' | 'raio_expandido' | 'deserto_fallback';
  raio_busca_efetivo_km: number;
  distancia_calculada_km?: number;
  
  // Rastreabilidade e Autenticidade
  hash_autenticidade: string;
  qr_code_payload?: string;
  
  data_aceite?: string;
  data_conclusao?: string;
  created_at: string;
  updated_at: string;
}

export interface Mensagem {
  id: string;
  requerimento_id: string;
  sender_id: string;
  sender?: Profile;
  conteudo: string;
  anexo_url?: string;
  anexo_nome?: string;
  lida: boolean;
  created_at: string;
}
