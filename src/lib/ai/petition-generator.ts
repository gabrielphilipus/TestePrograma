import { Especialidade } from '@/types/database';
import { ESPECIALIDADES_DATA } from '@/lib/data/mock-seed-data';

export interface GeneratePetitionInput {
  nomeCidadao: string;
  cpf?: string;
  comarcaNome: string;
  uf: string;
  descricaoLivre: string;
  rendaFamiliar?: number;
  membrosFamilia?: number;
  possuiUrgencia: boolean;
  especialidadeSugeridaId?: string;
}

export interface GeneratedPetitionOutput {
  especialidade: Especialidade;
  tituloCaso: string;
  resumoFatos: string;
  requerimentoEstruturadoMd: string;
  fundamentacaoJuridica: string;
  pedidosFinais: string[];
  competenciaVaraSugerida: string;
  grauVulnerabilidade: 'Baixa' | 'Media' | 'Alta' | 'Extrema';
}

/**
 * Classificador e Estruturador de Petições e Requerimentos de Assistência Dativa
 */
export async function generateStructuredPetition(
  input: GeneratePetitionInput
): Promise<GeneratedPetitionOutput> {
  const textoMinusculo = input.descricaoLivre.toLowerCase();

  // 1. Identificar Especialidade por Processamento de Linguagem Natural
  let especialidade = ESPECIALIDADES_DATA.find(e => e.id === input.especialidadeSugeridaId);

  if (!especialidade) {
    if (textoMinusculo.includes('pensão') || textoMinusculo.includes('guarda') || textoMinusculo.includes('divórcio') || textoMinusculo.includes('filho') || textoMinusculo.includes('paternidade')) {
      especialidade = ESPECIALIDADES_DATA.find(e => e.id === 'esp-familia')!;
    } else if (textoMinusculo.includes('inss') || textoMinusculo.includes('aposentadoria') || textoMinusculo.includes('auxílio-doença') || textoMinusculo.includes('bpc') || textoMinusculo.includes('loas') || textoMinusculo.includes('incapacidade')) {
      especialidade = ESPECIALIDADES_DATA.find(e => e.id === 'esp-previdenciario')!;
    } else if (textoMinusculo.includes('preso') || textoMinusculo.includes('delegacia') || textoMinusculo.includes('crime') || textoMinusculo.includes('polícia') || textoMinusculo.includes('audiência de custódia')) {
      especialidade = ESPECIALIDADES_DATA.find(e => e.id === 'esp-criminal')!;
    } else if (textoMinusculo.includes('remédio') || textoMinusculo.includes('sus') || textoMinusculo.includes('hospital') || textoMinusculo.includes('uti') || textoMinusculo.includes('prefeitura') || textoMinusculo.includes('estado')) {
      especialidade = ESPECIALIDADES_DATA.find(e => e.id === 'esp-fazenda')!;
    } else if (textoMinusculo.includes('demissão') || textoMinusculo.includes('salário') || textoMinusculo.includes('carteira') || textoMinusculo.includes('patrão') || textoMinusculo.includes('trabalho')) {
      especialidade = ESPECIALIDADES_DATA.find(e => e.id === 'esp-trabalhista')!;
    } else {
      especialidade = ESPECIALIDADES_DATA.find(e => e.id === 'esp-civel')!;
    }
  }

  // 2. Classificar Grau de Vulnerabilidade
  let grauVulnerabilidade: 'Baixa' | 'Media' | 'Alta' | 'Extrema' = 'Media';
  const renda = input.rendaFamiliar || 0;
  const membros = Math.max(1, input.membrosFamilia || 1);
  const rendaPerCapita = renda / membros;

  if (rendaPerCapita <= 700 || renda === 0) {
    grauVulnerabilidade = 'Extrema';
  } else if (rendaPerCapita <= 1412) {
    grauVulnerabilidade = 'Alta';
  } else if (rendaPerCapita <= 2824) {
    grauVulnerabilidade = 'Media';
  } else {
    grauVulnerabilidade = 'Baixa';
  }

  // 3. Gerar Título e Competência da Vara
  let tituloCaso = '';
  let competenciaVara = '';
  let fundamentacao = '';
  let pedidos: string[] = [];

  switch (especialidade.id) {
    case 'esp-familia':
      tituloCaso = input.descricaoLivre.includes('pensão') 
        ? 'Requerimento de Ação de Fixação e Execução de Alimentos com Pedido Liminar'
        : 'Requerimento de Assistência Jurídica em Direito de Família e Tutela de Menor';
      competenciaVara = `Vara de Família e Sucessões da Comarca de ${input.comarcaNome}/${input.uf}`;
      fundamentacao = 'Art. 227 da Constituição Federal/88; Arts. 1.694 e seguintes do Código Civil; Lei Federal nº 5.478/1968 (Lei de Alimentos); Arts. 98 e seguintes do Código de Processo Civil.';
      pedidos = [
        'Concessão dos benefícios da Gratuidade da Justiça Integral;',
        'Designação prioritária de Defensor Dativo credenciado para propositura da ação;',
        input.possuiUrgencia ? 'Fixação liminar inaudita altera parte de alimentos provisórios / tutela de urgência;' : 'Citação da parte contrária para audiência de mediação e conciliação;',
        'Intimação do Ilustre Representante do Ministério Público.'
      ];
      break;

    case 'esp-previdenciario':
      tituloCaso = 'Requerimento de Assistência para Ação Previdenciária de Concessão de Benefício c/c Tutela de Urgência';
      competenciaVara = `Vara Cível / Juizado Especial Federal / Competência Delegada de ${input.comarcaNome}/${input.uf}`;
      fundamentacao = 'Art. 201, I da Constituição Federal/88; Arts. 42, 59 e 86 da Lei Federal nº 8.213/1991; Lei nº 10.259/2001.';
      pedidos = [
        'Deferimento da Justiça Gratuita;',
        'Designação e aceitação formal de Defensor Dativo;',
        'Determinação de perícia médica judicial prioritária;',
        'Concessão de tutela antecipada para implantação imediata do benefício previdenciário devido.'
      ];
      break;

    case 'esp-criminal':
      tituloCaso = 'Requerimento de Defesa Dativa em Matéria Criminal e Garantia do Contraditório';
      competenciaVara = `Vara Criminal e Tribunal do Júri da Comarca de ${input.comarcaNome}/${input.uf}`;
      fundamentacao = 'Art. 5º, incisos LV e LXXIV da CF/88; Arts. 261 e seguintes do Código de Processo Penal; Pacto de San José da Costa Rica.';
      pedidos = [
        'Nomeação formal de defensor dativo para apresentação de resposta à acusação e acompanhamento processual;',
        'Garantia do acesso integral aos autos de inquérito/processo criminal;',
        'Apreciação de pedido de liberdade provisória / revogação de cautelares se aplicável.'
      ];
      break;

    case 'esp-fazenda':
      tituloCaso = 'Requerimento de Assistência para Ação de Obrigação de Fazer (Fornecimento de Tratamento/Medicamento de Saúde)';
      competenciaVara = `Vara da Fazenda Pública da Comarca de ${input.comarcaNome}/${input.uf}`;
      fundamentacao = 'Arts. 6º e 196 da Constituição Federal/88; Lei Federal nº 8.080/1990 (Lei do SUS); Tema 106 do Superior Tribunal de Justiça.';
      pedidos = [
        'Gratuidade de Justiça;',
        'Concessão de Tutela de Urgência para fornecimento imediato sob pena de bloqueio de verbas públicas;',
        'Designação célere de advogado dativo.'
      ];
      break;

    default:
      tituloCaso = 'Requerimento de Assistência Judiciária Gratuita e Nomeação de Defensor Dativo';
      competenciaVara = `Juízo da Comarca de ${input.comarcaNome}/${input.uf}`;
      fundamentacao = 'Art. 5º, LXXIV da CF/88; Arts. 98 a 102 do Código de Processo Civil; Lei Estadual de Assistência Judiciária.';
      pedidos = [
        'Deferimento da Assistência Judiciária Gratuita;',
        'Atribuição a advogado dativo comarca local / regional;',
        'Medidas cabíveis para proteção do direito violado.'
      ];
      break;
  }

  // 4. Estruturar Resumo Fático
  const resumoFatos = `O(A) cidadão(ã) ${input.nomeCidadao}, residente na comarca de ${input.comarcaNome}/${input.uf}, relata a seguinte situação de vulnerabilidade e necessidade de provimento jurisdicional: "${input.descricaoLivre.trim()}". Diante do perfil socioeconômico de vulnerabilidade declarada (${grauVulnerabilidade}) e ausência de condições financeiras para contratação de advogado particular sem prejuízo do próprio sustento, postula a intervenção célere do sistema de advocacia dativa.`;

  // 5. Compilar Petição em Markdown
  const requerimentoEstruturadoMd = `### EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ${competenciaVara.toUpperCase()}

**PROTOCOLO ELETRÔNICO DE ATENDIMENTO DATIVO - PLATAFORMA MATCH JURÍDICO**

**REQUERENTE:** ${input.nomeCidadao.toUpperCase()}, brasileiro(a), hipossuficiente na acepção jurídica do termo, inscrito(a) no CPF sob o nº ${input.cpf || '***.***.***-**'}, domiciliado(a) na Comarca de ${input.comarcaNome} - ${input.uf}.
**OBJETO:** ${tituloCaso.toUpperCase()}
**GRAU DE PRIORIDADE:** ${input.possuiUrgencia ? '🔴 URGENTE (Art. 300 CPC)' : '🟡 REGULAR'}
**GRAU DE VULNERABILIDADE SOCIAL:** ${grauVulnerabilidade.toUpperCase()}

---

#### I. DA HIPOSSUFICIÊNCIA E DO DIREITO À ASSISTÊNCIA DATIVA
O(A) Requerente não possui recursos financeiros suficientes para suportar as custas judiciais e honorários advocatícios convencionais sem privar a si e seus familiares dos meios básicos de subsistência, consoante preceitua o **Art. 5º, inciso LXXIV da Constituição Federal de 1988** e os **Arts. 98 e seguintes do Código de Processo Civil**.

Em razão da carência e distribuição regional de defensores públicos na localidade, faz-se imperiosa a nomeação e aceitação pelo respectivo **Advogado Dativo** através do sistema inteligente de alocação por proximidade.

---

#### II. DOS FATOS CONCRETOS
${resumoFatos}

${input.possuiUrgencia ? `> ⚠️ **DA URGÊNCIA QUALIFICADA:** A demora na prestação jurisdicional e designação defensiva acarreta perigo de dano irreparável ou risco ao resultado útil do processo, justificando tramitação prioritária nos termos do Art. 300 do CPC.` : ''}

---

#### III. DOS FUNDAMENTOS JURÍDICOS
A pretensão encontra esteio no ordenamento jurídico pátrio, notadamente:
- ${fundamentacao}

---

#### IV. DOS PEDIDOS E REQUERIMENTOS
Ante o exposto, respeitosamente requer:

${pedidos.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}

Termos em que, autuado este protocolo e formalizado o aceite pelo defensor,
Pede Deferimento.

**Comarca de ${input.comarcaNome}/${input.uf}**, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.`;

  return {
    especialidade,
    tituloCaso,
    resumoFatos,
    requerimentoEstruturadoMd,
    fundamentacaoJuridica: fundamentacao,
    pedidosFinais: pedidos,
    competenciaVaraSugerida: competenciaVara,
    grauVulnerabilidade
  };
}
