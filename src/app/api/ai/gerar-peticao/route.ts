import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nomeCidadao, comarcaNome, uf, descricaoLivre, rendaFamiliar, membrosFamilia, possuiUrgencia } = body;

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

    // Caso não haja chave externa configurada, informa para usar o gerador processual determinístico
    return NextResponse.json({ source: 'local-deterministic', useFallback: true });

  } catch (error: any) {
    console.error('Erro na rota de IA:', error);
    return NextResponse.json({ source: 'local-deterministic', useFallback: true, error: error.message });
  }
}
