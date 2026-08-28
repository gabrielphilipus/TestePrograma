import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nomeCidadao, comarcaNome, uf, descricaoLivre, rendaFamiliar, membrosFamilia, possuiUrgencia } = body;

    // Sanitização e Detecção de Prompt Injection
    const sanitizeInput = (text: string): { cleanText: string; isInjectionAttempt: boolean } => {
      if (!text) return { cleanText: '', isInjectionAttempt: false };
      
      const suspiciousPatterns = [
        /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
        /system\s+prompt/i,
        /you\s+are\s+now/i,
        /jailbreak/i,
        /forget\s+all\s+rules/i,
        /bypass\s+security/i,
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ];

      const isInjectionAttempt = suspiciousPatterns.some(pattern => pattern.test(text));
      
      // Remover caracteres de escape maliciosos mantendo pontuação válida
      const cleanText = text
        .replace(/[{}[\]\\]/g, '')
        .replace(/<[^>]*>/g, '')
        .trim();

      return { cleanText, isInjectionAttempt };
    };

    const { cleanText: safeDescricao, isInjectionAttempt } = sanitizeInput(descricaoLivre || '');

    if (isInjectionAttempt) {
      return NextResponse.json({
        source: 'guardrail-security',
        especialidade_slug: 'civel-consumidor',
        titulo_caso: 'Requerimento de Assistência Judiciária Gratuita',
        resumo_fatos: 'Relato submetido pelo cidadão contendo termos não padronizados. O caso requer triagem direta e entrevista preliminar com o advogado dativo designado.',
        fundamentacao_juridica: 'Art. 5º, LXXIV da Constituição Federal de 1988.',
        pedidos_finais: ['Concessão de Assistência Judiciária Gratuita', 'Designação de Defensor Dativo'],
        competencia_vara: `Vara da Comarca de ${comarcaNome}/${uf}`,
        requerimento_estruturado_md: `### AVISO DE SEGURANÇA E TRIAGEM
O relato do assistido passou pelo filtro de segurança e foi encaminhado para análise humana direta do advogado dativo credenciado.`,
      });
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Integração com Anthropic Claude (se chave fornecida)
    if (anthropicKey && anthropicKey.trim() !== '') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1500,
          system: `Você é um assistente de IA jurídica especializado no sistema de defensoria dativa do Brasil (OAB/PR e Lei Estadual 18.664/2015).
Sua tarefa é converter o relato livre do cidadão em um REQUERIMENTO INICIAL DE NOMEAÇÃO DE DEFENSOR DATIVO / ASSISTÊNCIA JUDICIÁRIA GRATUITA formalizado em Markdown.
Retorne um JSON com os campos:
- especialidade_slug: (familia-sucessoes | criminal-penal | civel-consumidor | previdenciario | trabalhista | fazenda-publica | infancia-juventude)
- titulo_caso: string
- resumo_fatos: string
- fundamentacao_juridica: string (com artigos de lei CPC/15, CF/88, CC/02, etc.)
- pedidos_finais: array de strings
- competencia_vara: string
- requerimento_estruturado_md: texto completo da petição formal em Markdown com Endereçamento, Qualificação, Fatos, Fundamentação e Pedidos.`,
          messages: [
            {
              role: 'user',
              content: `Nome: ${nomeCidadao}
Comarca: ${comarcaNome}/${uf}
Renda declarada: R$ ${rendaFamiliar} (para ${membrosFamilia} pessoas)
Urgência declarada: ${possuiUrgencia ? 'SIM' : 'NÃO'}
Relato livre do cidadão: "${descricaoLivre}"`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.content?.[0]?.text;
        try {
          const parsed = JSON.parse(content);
          return NextResponse.json({ source: 'anthropic-claude', ...parsed });
        } catch {
          // Se retornou texto markdown direto
          return NextResponse.json({ source: 'anthropic-claude-raw', requerimentoEstruturadoMd: content });
        }
      }
    }

    // 2. Integração com OpenAI (se chave fornecida)
    if (openAiKey && openAiKey.trim() !== '') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'Estruture o relato do cidadão em um requerimento inicial para advogado dativo. Retorne JSON com: especialidade_slug, titulo_caso, resumo_fatos, fundamentacao_juridica, pedidos_finais, competencia_vara, requerimento_estruturado_md.',
            },
            {
              role: 'user',
              content: `Nome: ${nomeCidadao}, Comarca: ${comarcaNome}/${uf}, Renda: ${rendaFamiliar}, Relato: "${descricaoLivre}"`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        const parsed = JSON.parse(content);
        return NextResponse.json({ source: 'openai-gpt', ...parsed });
      }
    }

    // 5. Fallback Deterministico com Classificação Semântica Precisa
    const t = (safeDescricao || '').toLowerCase();
    
    let especialidadeSlug = 'c-vel';
    let tituloCaso = 'Requerimento de Assistência Judiciária Gratuita';
    let fundamentacao = 'Art. 5º, LXXIV da CF/88; Arts. 98 do CPC/15.';
    let competenciaVara = `Vara Cível da Comarca de ${comarcaNome}/${uf}`;
    let pedidos = ['Concessão da Justiça Gratuita', 'Nomeação de Defensor Dativo'];

    if (t.includes('pensão') || t.includes('pensao') || t.includes('alimentos') || t.includes('guarda') || t.includes('filho') || t.includes('divórcio')) {
      especialidadeSlug = 'fam-lia-e-sucess-es';
      tituloCaso = 'Requerimento de Ação de Alimentos c/c Fixação de Alimentos Provisórios de Urgência';
      competenciaVara = `Vara de Família e Sucessões da Comarca de ${comarcaNome}/${uf}`;
      fundamentacao = 'Art. 227 da CF/88; Arts. 1.694 do Código Civil; Lei nº 5.478/68; Art. 300 do CPC.';
      pedidos = ['Justiça Gratuita Integral', 'Designação prioritária de Dativo', 'Alimentos Provisórios de Urgência'];
    } else if (t.includes('inss') || t.includes('trator') || t.includes('lavoura') || t.includes('auxílio') || t.includes('rural') || t.includes('incapacidade')) {
      especialidadeSlug = 'acidentes-do-trabalho-compet-ncia-estadual';
      tituloCaso = 'Requerimento de Assistência para Ação Previdenciária por Incapacidade c/c Tutela de Urgência';
      competenciaVara = `Vara Cível (Competência Delegada Federal) de ${comarcaNome}/${uf}`;
      fundamentacao = 'Art. 201, I da CF/88; Lei Federal nº 8.213/91; Art. 300 do CPC.';
      pedidos = ['Justiça Gratuita', 'Designação de Dativo', 'Perícia Médica Judicial Prioritária', 'Tutela Provisória de Benefício'];
    } else if (t.includes('remédio') || t.includes('remedio') || t.includes('medicamento') || t.includes('sus') || t.includes('farmácia') || t.includes('saúde') || t.includes('hospital')) {
      especialidadeSlug = 'c-vel';
      tituloCaso = 'Requerimento de Ação de Obrigação de Fazer para Fornecimento de Medicamento de Alto Custo (SUS)';
      competenciaVara = `Vara da Fazenda Pública da Comarca de ${comarcaNome}/${uf}`;
      fundamentacao = 'Arts. 6º e 196 da CF/88; Lei Federal nº 8.080/90; Tema 106 do STJ.';
      pedidos = ['Justiça Gratuita', 'Nomeação de Dativo', 'Fornecimento Ininterrupto do Fármaco sob pena de sequestro de verbas'];
    } else if (t.includes('preso') || t.includes('delegacia') || t.includes('flagrante') || t.includes('crime') || t.includes('furto') || t.includes('tráfico')) {
      especialidadeSlug = 'criminal';
      tituloCaso = 'Requerimento de Defesa Dativa em Matéria Criminal e Garantia Constitucional do Contraditório';
      competenciaVara = `Vara Criminal da Comarca de ${comarcaNome}/${uf}`;
      fundamentacao = 'Art. 5º, LV e LXXIV da CF/88; Arts. 261 e 263 do CPP; Lei Estadual 18.664/15.';
      pedidos = ['Gratuidade da Justiça', 'Abertura de Prazo Defensivo para Dativo', 'Acesso aos Autos'];
    }

    return NextResponse.json({
      source: 'local-deterministic',
      especialidade_slug: especialidadeSlug,
      titulo_caso: tituloCaso,
      resumo_fatos: safeDescricao,
      fundamentacao_juridica: fundamentacao,
      pedidos_finais: pedidos,
      competencia_vara: competenciaVara,
      requerimento_estruturado_md: `### EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ${competenciaVara.toUpperCase()}

**PROTOCOLO ELETRÔNICO DE ATENDIMENTO DATIVO - PLATAFORMA MATCH JURÍDICO**

**REQUERENTE:** ${nomeCidadao.toUpperCase()}, brasileiro(a), hipossuficiente.
**OBJETO:** ${tituloCaso.toUpperCase()}
**GRAU DE PRIORIDADE:** ${possuiUrgencia ? 'URGENTE (Art. 300 CPC)' : 'REGULAR'}

---

#### I. DA HIPOSSUFICIÊNCIA E DO DIREITO À ASSISTÊNCIA DATIVA
O(A) Requerente não possui condições econômicas de arcar com as custas do processo sem prejuízo do sustento próprio ou de sua família, fazendo jus à concessão de Assistência Judiciária Gratuita (Art. 5º, LXXIV da CF/88 e Art. 98 do CPC).

---

#### II. DOS FATOS CONCRETOS
${safeDescricao}

---

#### III. DOS FUNDAMENTOS JURÍDICOS
${fundamentacao}

---

#### IV. DOS PEDIDOS E REQUERIMENTOS
${pedidos.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Termos em que, autuado este protocolo e formalizado o aceite pelo defensor,
Pede Deferimento.

**Comarca de ${comarcaNome}/${uf}**, ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.

---

> **AVISO DE RESPONSABILIDADE ÉTICA E TÉCNICA (LEI FEDERAL Nº 8.906/94):**  
> *Esta minuta constitui documento preliminar de apoio estruturado por Inteligência Artificial a partir do relato do cidadão. A análise de admissibilidade, adequação probatória, fundamentação processual e protocolo formal perante o Poder Judiciário são de responsabilidade e prerrogativa técnica exclusiva do(a) Advogado(a) Dativo(a) que aceitar o caso.*`,
    });

  } catch (error: any) {
    console.error('Erro na rota de IA:', error);
    return NextResponse.json({ source: 'local-deterministic', useFallback: true, error: error.message });
  }
}
