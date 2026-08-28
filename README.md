# Match Jurídico ⚖️

> **Conexão Inteligente para Assistência Judiciária Gratuita e Combate a Desertos Jurídicos**

O **Match Jurídico** é uma plataforma desenvolvida para modernizar a triagem e distribuição da advocacia dativa no Paraná e em todo o Brasil. Utilizando Inteligência Artificial Generativa e algoritmos de alocação geodésica, o sistema converte o relato em linguagem simples do cidadão em uma minuta de petição jurídica estruturada, conectando defensores dativos por proximidade e priorizando comarcas com escassez de profissionais (desertos jurídicos).

---

## 🌟 Funcionalidades Principais

1. **Triagem Cidadã & Minuta com IA:**
   - O cidadão relata seu caso em linguagem natural (texto ou voz).
   - O motor de IA jurídica gera automaticamente uma minuta estruturada com qualificação das partes, fatos, fundamentos legais (CF/88, CPC) e pedidos.
   - Detecção de hipossuficiência socioeconômica e triagem de urgência (Art. 300 do CPC).

2. **Matching Geodésico & Radar de Desertos Jurídicos:**
   - Cálculo de distância geodésica (Haversine) entre o advogado dativo e a comarca do processo.
   - Ativação automática de **raio expandido (fallback)** em comarcas classificadas como desertos jurídicos.
   - Painel com **Score de Oportunidade (0–100)** baseado em dados reais de volume processual e número de advogados inscritos.

3. **Cockpit do Advogado Dativo:**
   - Visualização de casos disponíveis em tempo real com filtros por especialidade e comarca.
   - Minuta pré-estruturada pronta para validação e protocolo.
   - Aceite digital do caso em um clique.

4. **Comunicação Segura em Tempo Real:**
   - Canal de chat direto entre o cidadão assistido e o advogado designado após o aceite.

5. **Certidão Pública de Autenticidade:**
   - Emissão de certidão oficial com hash SHA-256 e QR Code para conferência pública por magistrados, cartórios e cidadãos.

6. **Design Acessível & Modo Claro/Escuro:**
   - Suporte completo a tema Claro e Escuro com transição suave e componentes de alta legibilidade.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend / Framework:** [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com suporte a `darkMode: 'class'` e Glassmorphism
- **Gerenciamento de Tema:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Criptografia & QR Code:** SHA-256 e biblioteca `qrcode`
- **Persistência / Backend Mock:** LocalStorage resiliente com compatibilidade para Supabase

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` ou `yarn`

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gabrielphilipus/TestePrograma.git
cd TestePrograma
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

---

## 📁 Estrutura de Pastas

```text
src/
├── app/
│   ├── layout.tsx             # Layout global com ThemeProvider e Navbar
│   ├── page.tsx               # Landing Page com Simulador de Matching
│   ├── globals.css            # Variáveis de tema claro/escuro e estilos
│   ├── auth/login/            # Acesso e Simulação GOV.br
│   ├── cidadao/
│   │   ├── novo-caso/         # Assistente de IA para criação do pedido
│   │   └── meus-casos/        # Acompanhamento do cidadão
│   ├── advogado/
│   │   └── dashboard/         # Cockpit e Radar de Oportunidades
│   ├── radar-comarcas/        # Tabela do Observatório de Desertos Jurídicos
│   ├── verificar/[hash]/      # Certidão Pública e Validação QR Code
│   └── chat/[id]/             # Chat em tempo real assistido-defensor
├── components/
│   ├── navbar.tsx             # Navegação e alternador de tema
│   ├── footer.tsx             # Rodapé institucional
│   ├── theme-provider.tsx     # Provedor next-themes
│   └── theme-toggle.tsx       # Botão de alternância Sol/Lua
├── lib/
│   ├── ai/                    # Motor de estruturação de petições
│   ├── matching/              # Algoritmo de distância e score
│   ├── storage/               # Store local de mock para dados
│   ├── data/                  # Dados de comarcas e advogados
│   └── qr/                    # Gerador de hash SHA-256 e QR Code
└── types/                     # Tipagens TypeScript do banco e entidades
```

---

## ⚖️ Conformidade Ética e Legal

O projeto observa estritamente os preceitos da **Lei Federal nº 8.906/94 (Estatuto da OAB)** e da **LGPD (Lei Geral de Proteção de Dados)**. Todas as minutas geradas pela Inteligência Artificial são instrumentos preliminares de apoio ao cidadão, cabendo exclusivamente ao advogado regularmente inscrito na OAB a análise técnica, validação de mérito e protocolo dos atos processuais perante o Poder Judiciário.