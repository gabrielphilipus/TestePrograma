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
        ) || findSpecialtyByText(input.descricaoLivre);

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

  // 2. Motor Processual Local de Alta Precisão (Deterministic Expert Engine)
  return generateDeterministicPetition(input);
}

// Localizador resiliente de especialidades oficiais da OAB/PR
function findSpecialtyByText(texto: string): Especialidade {
  const t = texto.toLowerCase();

  // 1. Família e Sucessões
  if (t.includes('pensão') || t.includes('pensao') || t.includes('alimentos') || t.includes('guarda') || t.includes('divórcio') || t.includes('divorcio') || t.includes('filho') || t.includes('paternidade') || t.includes('visita') || t.includes('inventário') || t.includes('inventario') || t.includes('herança') || t.includes('heranca')) {
    return (
      ESPECIALIDADES_DATA.find(e => e.nome.toLowerCase().includes('família') || e.slug.includes('fam')) ||
      ESPECIALIDADES_DATA[1] ||
      ESPECIALIDADES_DATA[0]
    );
  }

  // 2. Previdenciário / Acidentes do Trabalho (Rural / INSS / Incapacidade)
  if (t.includes('inss') || t.includes('trator') || t.includes('lavoura') || t.includes('auxílio-doença') || t.includes('auxilio-doenca') || t.includes('auxílio') || t.includes('auxilio') || t.includes('aposentadoria') || t.includes('bpc') || t.includes('loas') || t.includes('incapacidade') || t.includes('rural') || t.includes('acidente')) {
    return (
      ESPECIALIDADES_DATA.find(e => e.nome.toLowerCase().includes('acidentes') || e.slug.includes('acidentes')) ||
      ESPECIALIDADES_DATA.find(e => e.nome.toLowerCase().includes('cível') || e.slug.includes('c-vel') || e.slug.includes('civel')) ||
      ESPECIALIDADES_DATA[2]
    );
  }

  // 3. Saúde Pública / Medicamentos / SUS
  if (t.includes('remédio') || t.includes('remedio') || t.includes('medicamento') || t.includes('sus') || t.includes('farmácia') || t.includes('farmacia') || t.includes('hospital') || t.includes('uti') || t.includes('prefeitura') || t.includes('saúde') || t.includes('saude') || t.includes('cirurgia')) {
    return (
      ESPECIALIDADES_DATA.find(e => e.nome.toLowerCase().includes('cível') || e.slug.includes('c-vel') || e.slug.includes('civel')) ||
      ESPECIALIDADES_DATA[2]
    );
  }

  // 4. Violência Doméstica específica
  if (t.includes('maria da penha') || t.includes('medida protetiva') || t.includes('agressão conjugal')) {
    return (
      ESPECIALIDADES_DATA.find(e => e.nome.toLowerCase().includes('violência doméstica') || e.slug.includes('viol-ncia')) ||
      ESPECIALIDADES_DATA[3]
    );
  }

  // 5. Criminal / Penal Geral
  if (t.includes('preso') || t.includes('delegacia') || t.includes('flagrante') || t.includes('crime') || t.includes('tráfico') || t.includes('trafico') || t.includes('furto') || t.includes('roubo') || t.includes('audiência de custódia') || t.includes('audiencia de custodia')) {
    return (
      ESPECIALIDADES_DATA.find(e => e.id === 'esp-criminal' || e.nome === 'Criminal') ||
      ESPECIALIDADES_DATA[0]
    );
  }

  // 6. Cível Geral / Consumidor
  return (
    ESPECIALIDADES_DATA.find(e => e.nome.toLowerCase().includes('cível') || e.slug.includes('c-vel') || e.slug.includes('civel')) ||
    ESPECIALIDADES_DATA[2] ||
    ESPECIALIDADES_DATA[0]
  );
}

function generateDeterministicPetition(input: GeneratePetitionInput): GeneratedPetitionOutput {
  const texto = input.descricaoLivre || '';
  const t = texto.toLowerCase();

  const especialidade = input.especialidadeSugeridaId
    ? (ESPECIALIDADES_DATA.find(e => e.id === input.especialidadeSugeridaId) || findSpecialtyByText(texto))
    : findSpecialtyByText(texto);

  let grauVulnerabilidade: 'Baixa' | 'Media' | 'Alta' | 'Extrema' = 'Alta';
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

  // 1. FAMÍLIA E ALIMENTOS
  if (
    t.includes('pensão') || t.includes('pensao') || t.includes('alimentos') || 
    t.includes('guarda') || t.includes('filho') || t.includes('divórcio') || t.includes('divorcio')
  ) {
    tituloCaso = 'Requerimento de Ação de Alimentos c/c Fixação de Alimentos Provisórios de Urgência';
    competenciaVara = `Vara de Família e Sucessões da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 227 da Constituição Federal/88; Arts. 1.694 e seguintes do Código Civil; Lei Federal nº 5.478/1968 (Lei de Alimentos); Arts. 98 e 300 do Código de Processo Civil.';
    pedidos = [
      'Concessão integral dos benefícios da Assistência Judiciária Gratuita (Art. 98 do CPC/15);',
      'Designação prioritária de Advogado(a) Dativo(a) credenciado(a) pela OAB/PR;',
      input.possuiUrgencia ? 'Fixação liminar inaudita altera parte de alimentos provisórios em favor dos filhos menores;' : 'Citação da parte requerida para audiência preliminar de conciliação;',
      'Intimação do Ilustre Representante do Ministério Público Estadual (Art. 178, II do CPC).'
    ];
  }
  // 2. PREVIDENCIÁRIO / INSS / ACIDENTE RURAL
  else if (
    t.includes('inss') || t.includes('trator') || t.includes('lavoura') || 
    t.includes('auxílio-doença') || t.includes('auxilio-doenca') || t.includes('auxílio') || 
    t.includes('auxilio') || t.includes('aposentadoria') || t.includes('rural') || t.includes('incapacidade')
  ) {
    tituloCaso = 'Requerimento de Assistência para Ação Previdenciária de Concessão de Benefício por Incapacidade c/c Tutela de Urgência';
    competenciaVara = `Vara Cível e da Fazenda Pública (Competência Delegada Federal) da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 201, I da Constituição Federal/88; Arts. 42, 59 e 86 da Lei Federal nº 8.213/1991; Lei nº 10.259/2001; Art. 300 do CPC/15.';
    pedidos = [
      'Concessão dos benefícios da Justiça Gratuita em favor do(a) trabalhador(a) hipossuficiente;',
      'Nomeação formal e habilitação de Defensor Dativo credenciado;',
      'Determinação imediata de perícia médica judicial especializada;',
      'Concessão liminar de tutela de urgência para restabelecimento/implantação imediata do benefício previdenciário devido.'
    ];
  }
  // 3. SAÚDE PÚBLICA / REMÉDIO SUS / FARMÁCIA ESPECIAL
  else if (
    t.includes('remédio') || t.includes('remedio') || t.includes('medicamento') || 
    t.includes('sus') || t.includes('farmácia') || t.includes('farmacia') || 
    t.includes('hospital') || t.includes('uti') || t.includes('saúde') || t.includes('saude')
  ) {
    tituloCaso = 'Requerimento de Ação de Obrigação de Fazer para Fornecimento de Medicamento de Alto Custo c/c Tutela de Urgência (SUS)';
    competenciaVara = `Vara da Fazenda Pública da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Arts. 6º e 196 da Constituição Federal/88 (Direito Fundamental à Vida e Saúde); Lei Federal nº 8.080/90 (Lei do SUS); Tema 106 do STJ; Art. 300 do CPC/15.';
    pedidos = [
      'Deferimento dos benefícios da Justiça Gratuita;',
      'Designação urgente de Advogado(a) Dativo(a) para ajuizamento da ação cominatória;',
      'Concessão de tutela de urgência liminar para determinar ao Ente Público o fornecimento ininterrupto do fármaco prescrito, sob pena de bloqueio de verbas públicas;',
      'Intimação urgente do Ministério Público.'
    ];
  }
  // 4. CRIMINAL REAL (CRIME / PRISÃO / DELEGACIA)
  else if (
    t.includes('preso') || t.includes('delegacia') || t.includes('flagrante') || 
    t.includes('crime') || t.includes('tráfico') || t.includes('trafico') || 
    t.includes('furto') || t.includes('roubo') || t.includes('custódia') || t.includes('custodia')
  ) {
    tituloCaso = 'Requerimento de Defesa Dativa em Matéria Criminal e Garantia Constitucional da Ampla Defesa';
    competenciaVara = `Vara Criminal da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 5º, incisos LV e LXXIV da CF/88; Arts. 261 e 263 do Código de Processo Penal; Lei Estadual do Paraná nº 18.664/2015.';
    pedidos = [
      'Deferimento dos benefícios da Gratuidade da Justiça Integral;',
      'Nomeação formal de Advogado Dativo com abertura de prazo para apresentação de resposta à acusação ou pedido de liberdade provisória;',
      'Garantia de acesso aos autos e aos meios de prova pertinentes.'
    ];
  }
  // 5. CÍVEL GERAL
  else {
    tituloCaso = 'Requerimento de Assistência Judiciária Gratuita e Nomeação de Defensor Dativo';
    competenciaVara = `Vara Cível da Comarca de ${input.comarcaNome}/${input.uf}`;
    fundamentacao = 'Art. 5º, LXXIV da CF/88; Arts. 98 a 102 do Código de Processo Civil; Lei Federal nº 1.060/50.';
    pedidos = [
      'Deferimento integral da Gratuidade Judiciária;',
      'Designação formal de Advogado Dativo atuante na comarca;',
      'Adoção das medidas cabíveis para proteção e tutela do direito invocado.'
    ];
  }

  const resumoFatos = `O(A) cidadão(ã) ${input.nomeCidadao}, residente na comarca de ${input.comarcaNome}/${input.uf}, relata a seguinte situação fática: "${input.descricaoLivre.trim()}". Diante da vulnerabilidade socioeconômica declarada (${grauVulnerabilidade}) e ausência de recursos para contratação de patrono particular sem desfalque ao próprio sustento, requer a nomeação de advogado dativo credenciado.`;

  const requerimentoEstruturadoMd = `### EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ${competenciaVara.toUpperCase()}

**PROTOCOLO ELETRÔNICO DE ATENDIMENTO DATIVO - PLATAFORMA MATCH JURÍDICO**

**REQUERENTE:** ${input.nomeCidadao.toUpperCase()}, brasileiro(a), hipossuficiente na acepção jurídica do termo, inscrito(a) no CPF sob o nº ${input.cpf || '***.***.***-**'}, domiciliado(a) na Comarca de ${input.comarcaNome} - ${input.uf}.
**OBJETO:** ${tituloCaso.toUpperCase()}
**ESPECIALIDADE:** ${especialidade.nome.toUpperCase()}
**GRAU DE PRIORIDADE:** ${input.possuiUrgencia ? 'URGENTE (Art. 300 CPC)' : 'REGULAR'}
**GRAU DE VULNERABILIDADE SOCIAL:** ${grauVulnerabilidade.toUpperCase()}

---

#### I. DA HIPOSSUFICIÊNCIA E DO DIREITO À ASSISTÊNCIA DATIVA
O(A) Requerente não possui recursos financeiros suficientes para suportar as custas judiciais e honorários advocatícios convencionais sem privar a si e seus familiares dos meios básicos de subsistência, consoante preceitua o **Art. 5º, inciso LXXIV da Constituição Federal de 1988** e os **Arts. 98 e seguintes do Código de Processo Civil**.

Em razão da carência e distribuição regional de defensores públicos na localidade, faz-se imperiosa a nomeação e aceitação pelo respectivo **Advogado Dativo** através do sistema inteligente de alocação por proximidade.

---

#### II. DOS FATOS CONCRETOS
${resumoFatos}

${input.possuiUrgencia ? `> **DA URGÊNCIA QUALIFICADA:** A demora na prestação jurisdicional e designação defensiva acarreta perigo de dano irreparável ou risco ao resultado útil do processo, justificando tramitação prioritária nos termos do Art. 300 do CPC.` : ''}

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

> **AVISO DE RESPONSABILIDADE ÉTICA E TÉCNICA (LEI FEDERAL Nº 8.906/94):**  
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
