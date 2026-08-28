import { findMatchingAdvogados } from '../src/lib/matching/engine.ts';
import { COMARCAS_DATA, ESPECIALIDADES_DATA, MOCK_ADVOGADOS } from '../src/lib/data/mock-seed-data.ts';

const telemaco = COMARCAS_DATA.find(c => c.nome.toLowerCase().includes('telêmaco') || c.nome.toLowerCase().includes('telemaco'));
const terraBoa = COMARCAS_DATA.find(c => c.nome.toLowerCase().includes('terra boa'));
const maringa = COMARCAS_DATA.find(c => c.nome.toLowerCase().includes('maringá') || c.nome.toLowerCase().includes('maringa'));

console.log('🧪 Testando Algoritmo de Matching Geodésico Real...\n');

// Caso 1: Telêmaco Borba (395 OABs - NÃO é deserto)
const matchTelemaco = findMatchingAdvogados({
  comarcaOrigem: telemaco,
  especialidade: ESPECIALIDADES_DATA[0],
  advogadosDisponiveis: MOCK_ADVOGADOS,
});
console.log(`📌 Caso em Telêmaco Borba (395 OABs):`);
console.log(`   Modo de Expansão: ${matchTelemaco.modoExpansao}`);
console.log(`   Raio Utilizado: ${matchTelemaco.raioFinalKm} km`);
console.log(`   Primeiro Advogado: ${matchTelemaco.matches[0]?.advogado.profile.nome_completo} (${matchTelemaco.matches[0]?.distanciaKm} km - ${matchTelemaco.matches[0]?.motivoMatch})\n`);

// Caso 2: Terra Boa (1 OAB - DESERTO REAL)
const matchTerraBoa = findMatchingAdvogados({
  comarcaOrigem: terraBoa,
  especialidade: ESPECIALIDADES_DATA[1],
  advogadosDisponiveis: MOCK_ADVOGADOS,
});
console.log(`📌 Caso em Terra Boa (1 OAB - Deserto Real):`);
console.log(`   Modo de Expansão: ${matchTerraBoa.modoExpansao}`);
console.log(`   Raio Utilizado: ${matchTerraBoa.raioFinalKm} km`);
console.log(`   Primeiro Advogado: ${matchTerraBoa.matches[0]?.advogado.profile.nome_completo} (${matchTerraBoa.matches[0]?.distanciaKm} km - ${matchTerraBoa.matches[0]?.motivoMatch})\n`);
