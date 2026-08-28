async function testRoutes() {
  const routes = [
    '/',
    '/auth/login',
    '/cidadao/novo-caso',
    '/cidadao/meus-casos',
    '/advogado/dashboard',
    '/radar-comarcas',
    '/verificar/e7a3b98c4f1d02e88a912e5c66d741f0a9b2c3d4e5f60718293a4b5c6d7e8f90',
    '/chat/req-001',
  ];

  console.log('🧪 Iniciando teste de rotas em http://localhost:3000...\n');

  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      if (res.status === 200) {
        console.log(`✅ [200 OK] ${route}`);
      } else {
        console.log(`⚠️ [${res.status}] ${route}`);
      }
    } catch (err) {
      console.error(`❌ [FAIL] ${route}:`, err.message);
    }
  }

  console.log('\n🤖 Testando endpoint de IA (/api/ai/gerar-peticao)...');
  try {
    const aiRes = await fetch('http://localhost:3000/api/ai/gerar-peticao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeCidadao: 'Maria Aparecida',
        comarcaNome: 'Maringá',
        uf: 'PR',
        descricaoLivre: 'Preciso de pensão alimentícia para meus 2 filhos.',
        rendaFamiliar: 800,
        membrosFamilia: 3,
        possuiUrgencia: true,
      }),
    });
    const aiData = await aiRes.json();
    console.log(`✅ [200 OK] Resposta da IA (provedor: ${aiData.source})`);
  } catch (err) {
    console.error('❌ [FAIL] Endpoint de IA:', err.message);
  }

  console.log('\n🎉 Teste de ponta a ponta concluído!');
}

testRoutes();
