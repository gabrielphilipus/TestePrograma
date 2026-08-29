import { Comarca, AdvogadoDativo, Especialidade } from '@/types/database';
import { MOCK_ADVOGADOS, COMARCAS_DATA } from '@/lib/data/mock-seed-data';

export interface MatchingResult {
  advogado: AdvogadoDativo;
  distanciaKm: number;
  scoreMatch: number; // 0 a 100
  raioUtilizadoKm: number;
  isDesertoFallback: boolean;
  motivoMatch: string;
}

/**
 * Calcula a distância em quilômetros entre duas coordenadas geográficas (Fórmula de Haversine)
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Algoritmo de Matching Inteligente por Proximidade e Expansão Progressiva de Raio
 */
export function findMatchingAdvogados(params: {
  comarcaOrigem: Comarca;
  especialidade?: Especialidade;
  advogadosDisponiveis?: AdvogadoDativo[];
}): {
  matches: MatchingResult[];
  modoExpansao: 'local' | 'raio_expandido' | 'deserto_fallback';
  raioFinalKm: number;
  totalEncontrados: number;
} {
  const { comarcaOrigem, especialidade } = params;
  const advogados = params.advogadosDisponiveis || MOCK_ADVOGADOS;

  // Critério estrito e auditável de Deserto Jurídico (escassez real de advogados ativos: <= 25)
  // Independente do score_oportunidade, o modo deserto só é acionado com escassez de advogados
  const isRealDeserto = Boolean(
    comarcaOrigem.is_deserto_juridico ||
    (typeof comarcaOrigem.num_advogados_ativos === 'number' && comarcaOrigem.num_advogados_ativos <= 25)
  );

  let raioAtual = isRealDeserto ? 100 : 40;
  let modoExpansao: 'local' | 'raio_expandido' | 'deserto_fallback' = isRealDeserto ? 'deserto_fallback' : 'local';
  let matchedAdvogados: MatchingResult[] = [];

  // Etapa 1: Busca no raio base (40km para comarcas normais, 100km para deserto)
  matchedAdvogados = avaliarAdvogados(advogados, comarcaOrigem, especialidade, raioAtual);

  // Etapa 2: Se não houver advogado na especialidade no raio imediato, expandir progressivamente
  if (matchedAdvogados.length === 0) {
    raioAtual = isRealDeserto ? 160 : 80;
    modoExpansao = isRealDeserto ? 'deserto_fallback' : 'raio_expandido';
    matchedAdvogados = avaliarAdvogados(advogados, comarcaOrigem, especialidade, raioAtual);
  }

  // Etapa 3: Modo Deserto Fallback (expansão em todo o Estado/Macrorregião até 250km)
  // SOMENTE permitido se a comarca for de fato um DESERTO JURÍDICO REAL (<= 25 advogados)
  if (matchedAdvogados.length === 0 && isRealDeserto) {
    raioAtual = 250;
    modoExpansao = 'deserto_fallback';
    matchedAdvogados = avaliarAdvogados(advogados, comarcaOrigem, especialidade, raioAtual);
  }

  // Ordenar por score de match (maior score primeiro)
  matchedAdvogados.sort((a, b) => b.scoreMatch - a.scoreMatch);

  return {
    matches: matchedAdvogados,
    modoExpansao,
    raioFinalKm: raioAtual,
    totalEncontrados: matchedAdvogados.length,
  };
}

function avaliarAdvogados(
  advogados: AdvogadoDativo[],
  comarcaOrigem: Comarca,
  especialidade: Especialidade | undefined,
  raioMaximoKm: number
): MatchingResult[] {
  const isRealDeserto = Boolean(
    comarcaOrigem.is_deserto_juridico ||
    (typeof comarcaOrigem.num_advogados_ativos === 'number' && comarcaOrigem.num_advogados_ativos <= 25)
  );

  const resultados: MatchingResult[] = [];

  for (const adv of advogados) {
    if (!adv.disponivel) continue;
    if (adv.casos_em_andamento >= adv.limite_casos_simultaneos) continue;

    // Calcular distância da sede do advogado até a comarca do processo
    const comarcaSede = adv.comarca_sede || COMARCAS_DATA.find(c => 
      c.id === adv.comarca_sede_id || 
      c.nome.toLowerCase() === adv.comarca_sede?.nome?.toLowerCase() ||
      (adv.comarca_sede_id && c.id.replace(/-/g, '').includes(adv.comarca_sede_id.replace(/^com-/, '').replace(/-/g, '')))
    );
    
    let distancia = 0;

    if (comarcaSede) {
      distancia = calculateHaversineDistanceKm(
        comarcaOrigem.latitude,
        comarcaOrigem.longitude,
        comarcaSede.latitude,
        comarcaSede.longitude
      );
    }

    // Verificar se está dentro do raio permitido e do limite que o próprio advogado aceita
    if (distancia > raioMaximoKm || (distancia > adv.raio_maximo_km && !isRealDeserto)) {
      continue;
    }

    // Verificar compatibilidade de especialidade
    let atendeEspecialidade = true;
    if (especialidade && adv.especialidades && adv.especialidades.length > 0) {
      atendeEspecialidade = adv.especialidades.some(e => e.id === especialidade.id || e.slug === especialidade.slug);
    }

    // Cálculo do Score de Matching (0 a 100)
    // - Proximidade (até 45 pontos): quanto mais perto, melhor
    // - Especialidade (30 pontos): correspondência direta de área
    // - Disponibilidade/Carga (15 pontos): menos casos em andamento = mais pontos
    // - Reputação (10 pontos)
    const scoreProximidade = Math.max(0, 45 - (distancia / Math.max(raioMaximoKm, 1)) * 45);
    const scoreEspecialidade = atendeEspecialidade ? 30 : 5;
    const scoreCarga = Math.max(0, 15 - (adv.casos_em_andamento / Math.max(adv.limite_casos_simultaneos, 1)) * 15);
    const scoreReputacao = (adv.score_reputacao / 5.0) * 10;

    const scoreMatch = Math.min(100, Math.round(scoreProximidade + scoreEspecialidade + scoreCarga + scoreReputacao));

    let motivo = `Sede a ${distancia} km`;
    if (distancia === 0) motivo = 'Atuação na mesma comarca local';
    if (atendeEspecialidade) motivo += ' • Especialista na área';

    resultados.push({
      advogado: adv,
      distanciaKm: distancia,
      scoreMatch,
      raioUtilizadoKm: raioMaximoKm,
      isDesertoFallback: isRealDeserto && (distancia > 40 || raioMaximoKm > 40),
      motivoMatch: motivo,
    });
  }

  return resultados;
}
