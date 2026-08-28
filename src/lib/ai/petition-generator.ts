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
  provedorIa?: string;
}

/**
 * Classificador e Estruturador de Petições de Assistência Dativa
 */
export async function generateStructuredPetition(
  input: GeneratePetitionInput
): Promise<GeneratedPetitionOutput> {
  // 1. Tentar chamada à API server-side
  try {
    const res = await fetch('/api/ai/gerar-peticao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.source && (data.source.includes('anthropic') || data.source.includes('openai'))) {
        const foundEsp = ESPECIALIDADES_DATA.find(
          e => e.slug === data.especialidade_slug || e.id === data.especialidade_slug || e.nome.toLowerCase().includes(String(data.especialidade_slug).toLowerCase())
        ) || ESPECIALIDADES_DATA[0];

        return {
          especialidade: foundEsp,
          tituloCaso: data.titulo_caso || 'Requerimento de Assistência Dativa',
          resumoFatos: data.resumo_fatos || input.descricaoLivre,
          requerimentoEstruturadoMd: data.requerimento_estruturado_md || data.requerimentoEstruturadoMd,
          fundamentacaoJuridica: data.fundamentacao_juridica || 'Art. 5º, LXXIV da CF/88; Arts. 98 do CPC/15.',
          pedidosFinais: data.pedidos_finais || ['Justiça Gratuita', 'Nomeação de Defensor Dativo'],
          competenciaVaraSugerida: data.competencia_vara || `Vara da Comarca de ${input.comarcaNome}/${input.uf}`,
          grauVulnerabilidade: 'Alta',
          provedorIa: data.source,
        };
      }
    }
  } catch (err) {
    console.warn('Utilizando motor estruturado local para geração de petição:', err);
  }

  // 2. Motor Processual Local de Alta Fidelidade (Garantia de 100% de Funcionamento)
  return generateDeterministicPetition(input);
}

function generateDeterministicPetition(input: GeneratePetitionInput): GeneratedPetitionOutput {
  const textoMinusculo = (input.descricaoLivre || '').toLowerCase();

  // Helper para buscar especialidade de forma resiliente
  const getEspecialidade = (keyword: string): Especialidade => {
    return (
      ESPECIALIDADES_DATA.find(e => 
        e.slug.toLowerCase().includes(keyword) || 
        e.nome.toLowerCase().includes(keyword) ||
        e.id.toLowerCase().includes(keyword)
      ) || ESPECIALIDADES_DATA[0]
    );
  };

  let especialidade = input.especialidadeSugeridaId 
    ? ESPECIALIDADES_DATA.find(e => e.id === input.especialidadeSugeridaId)
    : undefined;

  if (!especialidade) {
    if (textoMinusculo.includes('pensão') || textoMinusculo.includes('pensao') || textoMinusculo.includes('guarda') || textoMinusculo.includes('divórcio') || textoMinusculo.includes('divorcio') || textoMinusculo.includes('filho') || textoMinusculo.includes('paternidade') || textoMinusculo.includes('alimentos')) {
      especialidade = getEspecialidade('familia');
    } else if (textoMinusculo.includes('inss') || textoMinusculo.includes('aposentadoria') || textoMinusculo.includes('auxílio') || textoMinusculo.includes('auxilio') || textoMinusculo.includes('bpc') || textoMinusculo.includes('loas') || textoMinusculo.includes('incapacidade') || textoMinusculo.includes('rural')) {
      especialidade = getEspecialidade('previdenciario') || getEspecialidade('civel');
    } else if (textoMinusculo.includes('preso') || textoMinusculo.includes('delegacia') || textoMinusculo.includes('crime') || textoMinusculo.includes('polícia') || textoMinusculo.includes('policia') || textoMinusculo.includes('audiência') || textoMinusculo.includes('audiencia') || textoMinusculo.includes('custódia') || textoMinusculo.includes('violência') || textoMinusculo.includes('violencia')) {
      especialidade = getEspecialidade('criminal');
    } else if (textoMinusculo.includes('remédio') || textoMinusculo.includes('remedio') || textoMinusculo.includes('sus') || textoMinusculo.includes('hospital') || textoMinusculo.includes('uti') || textoMinusculo.includes('prefeitura') || textoMinusculo.includes('saúde') || textoMinusculo.includes('saude')) {
      especialidade = getEspecialidade('fazenda') || getEspecialidade('civel');
    } else if (textoMinusculo.includes('demissão') || textoMinusculo.includes('demissao') || textoMinusculo.includes('salário') || textoMinusculo.includes('salario') || textoMinusculo.includes('carteira') || textoMinusculo.includes('patrão') || textoMinusculo.includes('trabalho')) {
      especialidade = getEspecialidade('trabalh') || getEspecialidade('civel');
    } else {
      especialidade = getEspecialidade('civel');
    }
  }

  // Garantir que especialidade nunca é nula
  if (!especialidade) {
    especialidade = ESPECIALIDADES_DATA[0];
  }

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

  let tituloCaso = '';
  let competenciaVara = '';
  let fundamentacao = '';
  let pedidos: string[] = [];

  const espNomeLower = especialidade.nome.toLowerCase();

  if (espNomeLower.includes('família') || espNomeLower.includes('familia') || textoMinusculo.includes('pensão') || textoMinusculo.includes('alimentos')) {
    tituloCaso = 'Requerimento de Ação de Alimentos c/c Tutela Provisória de Urgência';
    competenciaVara = `Vara de Família e Sucessões da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 227 da Constituição Federal/88; Arts. 1.694 e seguintes do Código Civil; Lei Federal nº 5.478/1968 (Lei de Alimentos); Arts. 98 e 300 do Código de Processo Civil.';
    pedidos = [
      'Concessão integral dos benefícios da Justiça Gratuita (Art. 98 CPC/15);',
      'Designação prioritária de Advogado(a) Dativo(a) credenciado(a) pela OAB/PR;',
      input.possuiUrgencia ? 'Fixação liminar inaudita altera parte de alimentos provisórios em favor dos menores;' : 'Citação da parte requerida para audiência prévia de mediação;',
      'Intimação do Ilustre Representante do Ministério Público.'
    ];
  } else if (espNomeLower.includes('criminal') || textoMinusculo.includes('crime') || textoMinusculo.includes('preso')) {
    tituloCaso = 'Requerimento de Defesa Dativa em Matéria Criminal e Garantia Constitucional do Contraditório';
    competenciaVara = `Vara Criminal e do Tribunal do Júri da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 5º, incisos LV e LXXIV da CF/88; Arts. 261 e 263 do Código de Processo Penal; Lei Estadual nº 18.664/2015.';
    pedidos = [
      'Deferimento dos benefícios da Gratuidade Judiciária Integral;',
      'Nomeação formal de Defensor Dativo com abertura de vista para apresentação de peça defensiva;',
      'Garantia irrestrita de acesso aos autos e elementos de prova.'
    ];
  } else if (textoMinusculo.includes('inss') || textoMinusculo.includes('aposentadoria') || textoMinusculo.includes('auxílio') || textoMinusculo.includes('rural')) {
    tituloCaso = 'Requerimento de Assistência para Ação Previdenciária de Concessão de Benefício c/c Tutela de Urgência';
    competenciaVara = `Vara Cível / Juizado Especial Federal / Competência Delegada de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 201, I da Constituição Federal/88; Arts. 42, 59 e 86 da Lei Federal nº 8.213/1991; Lei nº 10.259/2001.';
    pedidos = [
      'Deferimento da Justiça Gratuita;',
      'Designação e aceitação formal de Defensor Dativo;',
      'Determinação de perícia médica judicial prioritária;',
      'Concessão de tutela antecipada para implantação imediata do benefício previdenciário devido.'
    ];
  } else {
    tituloCaso = 'Requerimento de Assistência Judiciária Gratuita e Nomeação de Defensor Dativo';
    competenciaVara = `Vara Cível da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 5º, LXXIV da CF/88; Arts. 98 a 102 do Código de Processo Civil; Lei Federal nº 1.060/50.';
    pedidos = [
      'Deferimento da Assistência Judiciária Gratuita;',
      'Atribuição célere a advogado dativo da comarca ou região;',
      'Adoção das medidas cabíveis para proteção e tutela do direito violado.'
    ];
  }

  const resumoFatos = `O(A) cidadão(ã) ${input.nomeCidadao}, residente na comarca de ${input.comarcaNome}/${input.uf}, relata a seguinte situação fática: "${input.descricaoLivre.trim()}". Diante da vulnerabilidade socioeconômica declarada (${grauVulnerabilidade}) e ausência de recursos para contratação de patrono particular sem desfalque ao próprio sustento, requer a nomeação de advogado dativo credenciado.`;

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

**Comarca de ${input.comarcaNome}/${input.uf}**, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.

---

> ⚖️ **AVISO DE RESPONSABILIDADE ÉTICA E TÉCNICA (LEI FEDERAL Nº 8.906/94):**  
> *Esta minuta constitui documento preliminar de apoio estruturado por Inteligência Artificial a partir do relato do cidadão. A análise de admissibilidade, adequação probatória, fundamentação processual e protocolo formal perante o Poder Judiciário são de responsabilidade e prerrogativa técnica exclusiva do(a) Advogado(a) Dativo(a) que aceitar o caso.*`;

  return {
    especialidade,
    tituloCaso,
    resumoFatos,
    requerimentoEstruturadoMd,
    fundamentacaoJuridica: fundamentacao,
    pedidosFinais: pedidos,
    competenciaVaraSugerida: competenciaVara,
    grauVulnerabilidade,
    provedorIa: 'motor-juridico-deterministico',
  };
}
