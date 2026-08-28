async function testClassifier() {
  const casos = [
    {
      nome: 'Pensão / Guarda',
      relato: 'Preciso que o pai dos meus filhos pague a pensão alimentícia corretamente.',
      esperado: 'Família',
    },
    {
      nome: 'INSS / Rural / Trator',
      relato: 'Trabalhei a vida toda na lavoura e caí do trator, machucando a coluna seriamente. O INSS negou meu auxílio-doença rural dizendo que não comprovei atividade, mesmo eu tendo notas de produtor.',
      esperado: 'Previdenciário / Acidentes do Trabalho / Cível',
    },
    {
      nome: 'Remédio SUS / Farmácia Especial',
      relato: 'Minha mãe tem doença pulmonar grave e o médico do posto receitou um remédio de R$ 3.800 por mês. A Farmácia Especial do Estado e a Prefeitura negaram o fornecimento.',
      esperado: 'Saúde Pública / Cível (Fazenda)',
    },
    {
      nome: 'Prisão em Flagrante / Delegacia',
      relato: 'Meu irmão foi preso em flagrante pela polícia militar e levado para a delegacia central.',
      esperado: 'Criminal',
    },
  ];

  console.log('🧪 Testando Classificação Semântica dos 4 Casos...\n');

  for (const c of casos) {
    try {
      const res = await fetch('http://localhost:3000/api/ai/gerar-peticao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCidadao: 'Juliana Mendes',
          comarcaNome: 'Maringá',
          uf: 'PR',
          descricaoLivre: c.relato,
          rendaFamiliar: 850,
          membrosFamilia: 3,
          possuiUrgencia: true,
        }),
      });

      const data = await res.json();
      console.log(`📌 Caso: [${c.nome}]`);
      console.log(`   Esperado: ${c.esperado}`);
      console.log(`   Resultado: Especialidade = "${data.especialidade_slug || 'Determinado pelo Motor'}"`);
      console.log(`   Título = "${data.titulo_caso || 'N/A'}"`);
      console.log(`   Vara = "${data.competencia_vara || 'N/A'}"\n`);
    } catch (err) {
      console.error(`❌ Erro no caso ${c.nome}:`, err.message);
    }
  }
}

testClassifier();
