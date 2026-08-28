import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('exemplo')) {
  console.log('⚠️  Configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no seu .env.local para executar o seed via API.');
  console.log('ℹ️  Como alternativa, você pode copiar e colar o conteúdo de supabase/seed.sql diretamente no SQL Editor do Supabase.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('🌱 Iniciando seed no Supabase...');

  const especialidades = [
    { nome: 'Direito de Família e Sucessões', slug: 'familia-sucessoes', icone: 'Users', descricao: 'Ações de alimentos, guarda, divórcio e inventários.' },
    { nome: 'Direito Cível e Consumidor', slug: 'civel-consumidor', icone: 'Scale', descricao: 'Contratos, indenizações, posse e relações de consumo.' },
    { nome: 'Defesa Criminal e Execução Penal', slug: 'criminal-penal', icone: 'ShieldAlert', descricao: 'Defesa criminal, audiências de custódia e recursos.' },
    { nome: 'Direito Previdenciário (INSS)', slug: 'previdenciario', icone: 'HeartPulse', descricao: 'Aposentadorias, auxílio-doença, BPC/LOAS.' },
    { nome: 'Direito do Trabalho', slug: 'trabalhista', icone: 'Briefcase', descricao: 'Verbas rescisórias e vínculo empregatício.' },
    { nome: 'Fazenda Pública e Saúde', slug: 'fazenda-publica', icone: 'Building2', descricao: 'Medicamentos SUS, leitos de UTI e ações públicas.' },
    { nome: 'Infância e Juventude', slug: 'infancia-juventude', icone: 'Baby', descricao: 'Medidas protetivas e adoção.' },
  ];

  const { data: espData, error: espError } = await supabase
    .from('especialidades')
    .upsert(especialidades, { onConflict: 'nome' })
    .select();

  if (espError) {
    console.error('Erro ao inserir especialidades:', espError);
  } else {
    console.log(`✅ ${espData.length} especialidades inseridas/atualizadas.`);
  }

  const comarcas = [
    { nome: 'Reserva', uf: 'PR', regiao: 'Campos Gerais', populacao: 26825, num_advogados_ativos: 2, total_processos_ano: 1840, score_oportunidade: 9.8, latitude: -24.6506, longitude: -50.8508, raio_atendimento_sugerido_km: 75 },
    { nome: 'Capanema', uf: 'PR', regiao: 'Sudoeste', populacao: 19131, num_advogados_ativos: 3, total_processos_ano: 1420, score_oportunidade: 9.2, latitude: -25.6697, longitude: -53.8081, raio_atendimento_sugerido_km: 60 },
    { nome: 'Ivaiporã', uf: 'PR', regiao: 'Centro-Norte', populacao: 32304, num_advogados_ativos: 5, total_processos_ano: 2980, score_oportunidade: 8.5, latitude: -24.2486, longitude: -51.6836, raio_atendimento_sugerido_km: 60 },
    { nome: 'União da Vitória', uf: 'PR', regiao: 'Sul', populacao: 57987, num_advogados_ativos: 11, total_processos_ano: 5400, score_oportunidade: 7.8, latitude: -26.2269, longitude: -51.0872, raio_atendimento_sugerido_km: 50 },
    { nome: 'Telêmaco Borba', uf: 'PR', regiao: 'Campos Gerais', populacao: 79792, num_advogados_ativos: 16, total_processos_ano: 7200, score_oportunidade: 7.1, latitude: -24.3239, longitude: -50.6156, raio_atendimento_sugerido_km: 45 },
    { nome: 'Guarapuava', uf: 'PR', regiao: 'Centro-Sul', populacao: 182644, num_advogados_ativos: 38, total_processos_ano: 16500, score_oportunidade: 6.4, latitude: -25.3953, longitude: -51.4625, raio_atendimento_sugerido_km: 40 },
    { nome: 'Paranaguá', uf: 'PR', regiao: 'Litoral', populacao: 156058, num_advogados_ativos: 42, total_processos_ano: 14800, score_oportunidade: 5.9, latitude: -25.5205, longitude: -48.5095, raio_atendimento_sugerido_km: 35 },
    { nome: 'Ponta Grossa', uf: 'PR', regiao: 'Campos Gerais', populacao: 358838, num_advogados_ativos: 94, total_processos_ano: 32000, score_oportunidade: 4.8, latitude: -25.0994, longitude: -50.1583, raio_atendimento_sugerido_km: 30 },
    { nome: 'Cascavel', uf: 'PR', regiao: 'Oeste', populacao: 348051, num_advogados_ativos: 112, total_processos_ano: 34500, score_oportunidade: 4.2, latitude: -24.9578, longitude: -53.4595, raio_atendimento_sugerido_km: 30 },
    { nome: 'Foz do Iguaçu', uf: 'PR', regiao: 'Oeste', populacao: 258248, num_advogados_ativos: 88, total_processos_ano: 27900, score_oportunidade: 4.5, latitude: -25.5163, longitude: -54.5854, raio_atendimento_sugerido_km: 30 },
    { nome: 'Londrina', uf: 'PR', regiao: 'Norte', populacao: 575377, num_advogados_ativos: 220, total_processos_ano: 58000, score_oportunidade: 3.1, latitude: -23.3045, longitude: -51.1696, raio_atendimento_sugerido_km: 25 },
    { nome: 'Maringá', uf: 'PR', regiao: 'Norte-Noroeste', populacao: 436472, num_advogados_ativos: 185, total_processos_ano: 46000, score_oportunidade: 2.9, latitude: -23.4205, longitude: -51.9331, raio_atendimento_sugerido_km: 25 },
    { nome: 'Curitiba (Foro Central)', uf: 'PR', regiao: 'Metropolitana de Curitiba', populacao: 1963726, num_advogados_ativos: 680, total_processos_ano: 195000, score_oportunidade: 1.8, latitude: -25.4284, longitude: -49.2733, raio_atendimento_sugerido_km: 20 },
  ];

  const { data: comData, error: comError } = await supabase
    .from('comarcas')
    .upsert(comarcas, { onConflict: 'nome' })
    .select();

  if (comError) {
    console.error('Erro ao inserir comarcas:', comError);
  } else {
    console.log(`✅ ${comData.length} comarcas inseridas/atualizadas com Score de Oportunidade.`);
  }

  console.log('🎉 Seed finalizado com sucesso!');
}

seed();
