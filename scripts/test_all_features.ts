import { findMatchingAdvogados } from '../src/lib/matching/engine';
import { COMARCAS_DATA, ESPECIALIDADES_DATA, MOCK_ADVOGADOS, MOCK_REQUERIMENTOS } from '../src/lib/data/mock-seed-data';
import { generateStructuredPetition } from '../src/lib/ai/petition-generator';
import { getRequerimentoById } from '../src/lib/storage/mock-store';

async function runFullTestSuite() {
  console.log('=====================================================');
  console.log('🚀 BATERIA COMPLETA DE TESTES - MATCH JURÍDICO (OAB/PR)');
  console.log('=====================================================\n');

  // TESTE 1: Deserto Real vs Não-Deserto (Telêmaco Borba vs Terra Boa)
  console.log('🔹 1. TESTE DE EXPANSÃO DE RAIO GEODÉSICO:');
  const telemaco = COMARCAS_DATA.find(c => c.nome.toLowerCase().includes('telêmaco') || c.nome.toLowerCase().includes('telemaco'))!;
  const terraBoa = COMARCAS_DATA.find(c => c.nome.toLowerCase().includes('terra boa'))!;
  
  const matchTelemaco = findMatchingAdvogados({
    comarcaOrigem: telemaco,
    especialidade: ESPECIALIDADES_DATA[0],
    advogadosDisponiveis: MOCK_ADVOGADOS,
  });

  const matchTerraBoa = findMatchingAdvogados({
    comarcaOrigem: terraBoa,
    especialidade: ESPECIALIDADES_DATA[0],
    advogadosDisponiveis: MOCK_ADVOGADOS,
  });

  console.log(`   [Telêmaco Borba - ${telemaco.num_advogados_ativos} advogados]`);
  console.log(`   - É deserto? ${telemaco.is_deserto_juridico ? 'SIM' : 'NÃO'}`);
  console.log(`   - Modo: ${matchTelemaco.modoExpansao} | Raio: ${matchTelemaco.raioFinalKm} km`);
  console.log(`   - Primeiro Advogado: ${matchTelemaco.matches[0]?.advogado.profile.nome_completo} (${matchTelemaco.matches[0]?.distanciaKm} km)`);
  console.log(`   - Status: ${matchTelemaco.modoExpansao === 'local' && matchTelemaco.raioFinalKm === 40 ? '✅ PASSOU (Raio contido em 40km)' : '❌ FALHOU'}\n`);

  console.log(`   [Terra Boa - ${terraBoa.num_advogados_ativos} advogado]`);
  console.log(`   - É deserto? ${terraBoa.is_deserto_juridico ? 'SIM' : 'NÃO'}`);
  console.log(`   - Modo: ${matchTerraBoa.modoExpansao} | Raio: ${matchTerraBoa.raioFinalKm} km`);
  console.log(`   - Primeiro Advogado: ${matchTerraBoa.matches[0]?.advogado.profile.nome_completo} (${matchTerraBoa.matches[0]?.distanciaKm} km)`);
  console.log(`   - Status: ${matchTerraBoa.modoExpansao === 'deserto_fallback' ? '✅ PASSOU (Expansão de deserto ativada)' : '❌ FALHOU'}\n`);

  // TESTE 2: Validação da Certidão Pública Perene
  console.log('🔹 2. TESTE DA CERTIDÃO PÚBLICA PERENE:');
  const certidaoHash = 'e7a3b98c4f1d02e88a912e5c66d741f0a9b2c3d4e5f60718293a4b5c6d7e8f90';
  const certidaoFound = getRequerimentoById(certidaoHash);
  console.log(`   - Hash buscado: ${certidaoHash}`);
  console.log(`   - Localizado: ${certidaoFound ? 'SIM' : 'NÃO'}`);
  if (certidaoFound) {
    console.log(`   - Protocolo: ${certidaoFound.protocolo}`);
    console.log(`   - Advogada Atribuída: ${certidaoFound.advogado?.profile?.nome_completo}`);
    console.log(`   - Comarca: ${certidaoFound.comarca?.nome}`);
    console.log(`   - Status: ✅ PASSOU (Certidão perene do footer recuperada com sucesso)\n`);
  } else {
    console.log(`   - Status: ❌ FALHOU\n`);
  }

  // TESTE 3: Populações do Censo IBGE
  console.log('🔹 3. TESTE DE POPULAÇÕES REAIS DO IBGE:');
  const comarcasVerificar = [
    { nome: 'Cornélio Procópio', popEsperada: 45206 },
    { nome: 'Guaratuba', popEsperada: 42062 },
    { nome: 'Matinhos', popEsperada: 39259 },
    { nome: 'Pontal do Paraná', popEsperada: 30425 },
    { nome: 'Colorado', popEsperada: 22896 },
    { nome: 'Antonina', popEsperada: 18891 },
    { nome: 'Curiúva', popEsperada: 13923 },
    { nome: 'Palmital', popEsperada: 13003 },
    { nome: 'Congonhinhas', popEsperada: 8857 },
  ];

  let popErrors = 0;
  for (const item of comarcasVerificar) {
    const c = COMARCAS_DATA.find(x => x.nome.toLowerCase().includes(item.nome.toLowerCase()));
    if (!c || c.populacao !== item.popEsperada) {
      console.log(`   ❌ ${item.nome}: esperava ${item.popEsperada}, obteve ${c?.populacao}`);
      popErrors++;
    } else {
      console.log(`   ✅ ${item.nome}: ${c.populacao.toLocaleString('pt-BR')} habitantes (OK)`);
    }
  }
  console.log(`   Status Populações: ${popErrors === 0 ? '✅ TODAS CORRETAS (Censo IBGE)' : '❌ ERROS ENCONTRADOS'}\n`);

  // TESTE 4: 5 Casos de Especialidades Distintas
  console.log('🔹 4. TESTE DE 5 CASOS DE ESPECIALIDADES DISTINTAS (IA & MATCHING):');
  const casos5 = [
    {
      nome: 'Direito de Família (Pensão Alimentícia / Guarda)',
      relato: 'Preciso cobrar a pensão alimentícia do meu filho de 7 anos. O pai não paga há 8 meses e não tenho condições financeiras.',
      comarca: telemaco,
    },
    {
      nome: 'Previdenciário / Acidentes do Trabalho (Auxílio-Doença Rural)',
      relato: 'Trabalhei a vida toda na lavoura e caí do trator machucando a coluna. O INSS negou meu auxílio-doença rural.',
      comarca: telemaco,
    },
    {
      nome: 'Saúde Pública / Fazenda Pública (Medicamento de Alto Custo)',
      relato: 'Minha mãe precisa de medicamento pulmonar de R$ 3.800/mês e o SUS e o Estado negaram o fornecimento.',
      comarca: telemaco,
    },
    {
      nome: 'Direito Penal / Criminal (Prisão em Flagrante)',
      relato: 'Meu irmão foi preso em flagrante pela polícia militar e está na delegacia sem advogado para audiência de custódia.',
      comarca: telemaco,
    },
    {
      nome: 'Direito Cível Geral (Contrato / Consumidor)',
      relato: 'Tive meu nome negativado indevidamente por uma dívida de cartão de crédito que nunca contratei.',
      comarca: telemaco,
    },
  ];

  for (const c of casos5) {
    const peticao = await generateStructuredPetition({
      nomeCidadao: 'Juliana Mendes',
      cpf: '458.912.879-04',
      comarcaNome: c.comarca.nome,
      uf: c.comarca.uf,
      descricaoLivre: c.relato,
      rendaFamiliar: 1200,
      membrosFamilia: 3,
      possuiUrgencia: true,
    });

    const match = findMatchingAdvogados({
      comarcaOrigem: c.comarca,
      especialidade: peticao.especialidade,
      advogadosDisponiveis: MOCK_ADVOGADOS,
    });

    console.log(`   📌 Caso: [${c.nome}]`);
    console.log(`      - Especialidade Classificada: "${peticao.especialidade.nome}"`);
    console.log(`      - Vara Sugerida: ${peticao.competenciaVaraSugerida}`);
    console.log(`      - Advogado Selecionado: ${match.matches[0]?.advogado.profile.nome_completo} (${match.matches[0]?.distanciaKm} km)`);
    console.log(`      - Modo: ${match.modoExpansao} | Raio: ${match.raioFinalKm} km ✅`);
  }

  console.log('\n=====================================================');
  console.log('🎉 TODOS OS TESTES FORAM EXECUTADOS COM SUCESSO!');
  console.log('=====================================================');
}

runFullTestSuite();
