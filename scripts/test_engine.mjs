import fs from 'fs';

const seedData = JSON.parse(fs.readFileSync('scripts/extracted_data.json', 'utf-8'));
const especialidades = seedData.especialidades;

function findSpecialtyByText(texto) {
  const t = texto.toLowerCase();

  // 1. Família e Sucessões
  if (t.includes('pensão') || t.includes('pensao') || t.includes('alimentos') || t.includes('guarda') || t.includes('divórcio') || t.includes('divorcio') || t.includes('filho') || t.includes('paternidade') || t.includes('visita') || t.includes('inventário') || t.includes('inventario') || t.includes('herança') || t.includes('heranca')) {
    return (
      especialidades.find(e => e.nome.toLowerCase().includes('família') || e.slug.includes('fam')) ||
      especialidades[1] ||
      especialidades[0]
    );
  }

  // 2. Previdenciário / Acidentes do Trabalho (Rural / INSS / Incapacidade)
  if (t.includes('inss') || t.includes('trator') || t.includes('lavoura') || t.includes('auxílio-doença') || t.includes('auxilio-doenca') || t.includes('auxílio') || t.includes('auxilio') || t.includes('aposentadoria') || t.includes('bpc') || t.includes('loas') || t.includes('incapacidade') || t.includes('rural') || t.includes('acidente')) {
    return (
      especialidades.find(e => e.nome.toLowerCase().includes('acidentes') || e.slug.includes('acidentes')) ||
      especialidades.find(e => e.nome.toLowerCase().includes('cível') || e.slug.includes('c-vel') || e.slug.includes('civel')) ||
      especialidades[2]
    );
  }

  // 3. Saúde Pública / Medicamentos / SUS
  if (t.includes('remédio') || t.includes('remedio') || t.includes('medicamento') || t.includes('sus') || t.includes('farmácia') || t.includes('farmacia') || t.includes('hospital') || t.includes('uti') || t.includes('prefeitura') || t.includes('saúde') || t.includes('saude') || t.includes('cirurgia')) {
    return (
      especialidades.find(e => e.nome.toLowerCase().includes('cível') || e.slug.includes('c-vel') || e.slug.includes('civel')) ||
      especialidades[2]
    );
  }

  // 4. Violência Doméstica específica
  if (t.includes('maria da penha') || t.includes('medida protetiva') || t.includes('agressão conjugal')) {
    return (
      especialidades.find(e => e.nome.toLowerCase().includes('violência doméstica') || e.slug.includes('viol-ncia')) ||
      especialidades[3]
    );
  }

  // 5. Criminal / Penal Geral
  if (t.includes('preso') || t.includes('delegacia') || t.includes('flagrante') || t.includes('crime') || t.includes('tráfico') || t.includes('trafico') || t.includes('furto') || t.includes('roubo') || t.includes('custódia') || t.includes('custodia')) {
    return (
      especialidades.find(e => e.id === 'esp-criminal' || e.nome === 'Criminal') ||
      especialidades[0]
    );
  }

  // 6. Cível Geral / Consumidor
  return (
    especialidades.find(e => e.nome.toLowerCase().includes('cível') || e.slug.includes('c-vel') || e.slug.includes('civel')) ||
    especialidades[2] ||
    especialidades[0]
  );
}

const relatos = [
  { nome: 'Pensão', text: 'Preciso que o pai dos meus filhos pague a pensão corretamente' },
  { nome: 'INSS', text: 'Trabalhei a vida toda na lavoura e caí do trator, machucando a coluna seriamente. O INSS negou meu auxílio-doença rural dizendo que não comprovei atividade, mesmo eu tendo notas de produtor.' },
  { nome: 'SUS', text: 'Minha mãe tem doença pulmonar grave e o médico do posto receitou um remédio de R$ 3.800 por mês. A Farmácia Especial do Estado e a Prefeitura negaram o fornecimento.' },
  { nome: 'Criminal', text: 'Meu irmão foi preso em flagrante e está na delegacia sem advogado.' }
];

console.log('Classificação dos 4 Relatos:');
for (const r of relatos) {
  const esp = findSpecialtyByText(r.text);
  console.log(`- ${r.nome}: Especialidade -> "${esp.nome}" (ID: ${esp.id})`);
}
