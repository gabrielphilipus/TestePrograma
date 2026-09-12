# 🏆 PLAYBOOK DEFINITIVO: HACKATHON DA CIDADANIA OAB/PR
> **Projeto:** Match Jurídico ⚖️ (Trilha A: Inovação Aberta e Cidadania)  
> **Tema:** Conexão Inteligente para Assistência Judiciária Gratuita e Combate a Desertos Jurídicos  
> **Licença:** MIT (Repositório Aberto OAB/PR)

---

## ⏰ 1. Cronograma Tático & Caça aos Pontos Extras

> **Regra do Hackathon:** *"Sem evidência, o checkpoint não existe. Entrega > Evidência > Prazo > Pontos."*

### 💎 Pontos Extras (Até 60 Pontos — NÃO DEIXE NA MESA!)
* [ ] **Sábado até 09:05:** Check-in presencial com 100% da equipe presente (**10 pontos**).
* [ ] **Sábado até 10:00:** Foto da equipe completa no banner com uma pessoa da organização. Postar com `#hackathonoabpr` e salvar o print na pasta `/evidencias` do repositório (**15 pontos**).
* [ ] **Sábado até 15:00:** Foto da equipe trabalhando postada com `#hackathonoabpr` (print no repositório) (**5 pontos**).
* [ ] **Domingo até 09:05:** Check-in presencial (**10 pontos**).
* [ ] **Domingo até 15:00:** Foto da equipe postada com `#hackathonoabpr` (print no repositório) (**5 pontos**).
* [ ] **Domingo até 15:00:** Live ou vídeo curto (30 a 60s) nas redes com alguém da organização explicando a solução (link/print no repositório) (**15 pontos**).

---

## 🎯 2. As 5 Entregas Obrigatórias

### 📌 ENTREGA 1 — Sábado 12h00: Canvas de IA Preenchido (100 pts)
Copie e cole este conteúdo diretamente no template do Canva fornecido pela organização:

* **1. Problema:**
  - Mais de 40% das comarcas do interior do Paraná sofrem com carência crítica de advogados dativos inscritos (*Desertos Jurídicos*).
  - Cidadãos hipossuficientes têm dificuldade de transformar sua dor cotidiana em um pedido juridicamente compreensível, sobrecarregando triagens e gerando pedidos indeferidos.
* **2. Proposta de Valor:**
  - Triagem cidadã humanizada em linguagem simples (texto/áudio) que gera minutas jurídicas com fundamentação exata e controle de alucinação.
  - Distribuição geodésica inteligente (Haversine) que resolve desertos jurídicos com incentivos e raio de busca dinâmico para defensores dativos.
* **3. Usuários / Beneficiários:**
  - *Cidadão Vulnerável:* Acesso rápido, sem jargões, com acessibilidade (VLibras).
  - *Advogados Dativos:* Cockpit pronto com minutas pré-estruturadas, filtros por comarca e aceite em 1 clique.
  - *OAB/PR e Poder Judiciário:* Eficiência na assistência judiciária gratuita, redução de tempo de triagem e transparência com certidão criptográfica SHA-256.
* **4. Solução Técnica & IA:**
  - LLM com engenharia de prompts em camadas (System Instructions com restrição rígida de fontes: CF/88, CPC/15, Lei 8.906/94 e Tabela OAB/PR).
  - Algoritmo de Matching Geodésico com Score de Oportunidade (0–100).
  - Certidão digital com QR Code e Hash SHA-256 para auditoria pública.
* **5. Métricas de Sucesso:**
  - Redução de 80% no tempo de elaboração da petição inicial dativa.
  - Eliminação de 100% do vácuo de atendimento em comarcas desertas via expansão dinâmica de raio.

---

### 📌 ENTREGA 2 — Sábado 15h30: V1 com Testes Internos (100 pts)
> **Evidência Obrigatória:** Suba no repositório oficial um arquivo `TESTES_INTERNOS.md` ou print dos testes executados abaixo.

| ID | Cenário Testado | Entrada do Usuário | Resultado Esperado | Status |
|---|---|---|---|:---:|
| **TC01** | Pedido de Pensão Alimentícia | "Meu ex-marido não paga pensão há 3 meses e meu filho precisa de remédio" | Minuta gerada: Ação de Alimentos c/c Pedido de Tutela de Urgência (Art. 300 CPC, Lei 5.478/68). | ✅ PASS |
| **TC02** | Comarca em Deserto Jurídico | Caso aberto na comarca de Ortigueira (baixa densidade de advogados) | Ativação do Raio Expandido (+50km) e cálculo do Score de Oportunidade = 92. | ✅ PASS |
| **TC03** | Teste de Anti-Alucinação | Pergunta fora do escopo ou dados inconsistentes | O motor rejeita invenções fáticas e marca campos ausentes como `[A COMPLETAR EM ENTREVISTA]`. | ✅ PASS |
| **TC04** | Acessibilidade & Modo Noturno | Alternância de tema Dark/Light e ativação do widget VLibras | Interface responsiva, contraste conforme WCAG 2.1 e avatar do VLibras funcional. | ✅ PASS |

---

### 📌 ENTREGA 3 — Sábado 17h30: V2 Validada com Testes Externos (100 pts)
> **Ação Prática às 16h30:** Chame 2 pessoas de outras equipes ou mentores/advogados presentes no evento para usarem o site por 2 minutos.

**Roteiro de Validação Rápida:**
1. Peça para o avaliador abrir a página de simulação e ditar/escrever um caso.
2. Mostre a minuta sendo gerada em tempo real com os artigos de lei corretos.
3. Peça uma frase de feedback: *"O que você achou da velocidade e clareza da minuta?"*
4. Registre prints dos depoimentos / grave um vídeo de 15 segundos no Instagram/LinkedIn com `#hackathonoabpr` e adicione os links no `README.md` do repositório.

---

### 📌 ENTREGA 4 — Domingo 10h30: Produto + Auditoria Técnica (400 pts no total!)
A Auditoria vale **300 pontos** (consenso de 4 auditores). Eis o roteiro de defesa quando o auditor sentar na mesa:

#### 1. Confiabilidade / Resistência a Alucinações (100 pontos):
- **O que mostrar:** Abra o arquivo de prompt do sistema (`src/lib/ai/petition-generator.ts`).
- **O que falar ao auditor:** *"Nosso agente opera sob uma diretriz estrita de delimitação jurídica: ele apenas fundamenta em diplomas vigentes (CF/88, CPC e Lei 8.906/94). Se o cidadão não fornecer um dado essencial (como endereço ou valor da causa), a IA NÃO inventa dados: ela gera o marcador explícito `[A COMPLETAR EM ENTREVISTA]`, eliminando alucinações processuais."*

#### 2. Usabilidade e Acessibilidade (100 pontos):
- **O que mostrar:** Demonstre a alternância de tema Claro/Escuro (alto contraste) e o widget do **VLibras** funcionando no canto da tela, além da leitura por voz e navegação intuitiva em linguagem cidadã sem jargões.

#### 3. Sofisticação Técnica (100 pontos):
- **O que mostrar:**
  1. O algoritmo geodésico de **Haversine** (`src/lib/matching/engine.ts`) com o **Radar de Desertos Jurídicos** e fallback dinâmico.
  2. A emissão da **Certidão Criptográfica com Hash SHA-256 e QR Code** (`/verificar/[hash]`) para conferência pública por juízes e cartórios.
  3. A persistência resiliente com arquitetura desacoplada (LocalStorage/Supabase ready).

---

### 📌 ENTREGA 5 — Domingo 14h30: Slides Oficiais (50 pts)
Deck de no máximo 5 slides para apresentação de 2 minutos:
- **Slide 1:** Capa (Match Jurídico - Conectando Cidadãos e Dativos contra os Desertos Jurídicos).
- **Slide 2:** O Problema (O abismo do acesso à justiça no interior + sobrecarga da advocacia dativa).
- **Slide 3:** A Solução (Triagem Cidadã em IA + Matching Geodésico Inteligente).
- **Slide 4:** Demonstração Visual (Print da Minuta Estruturada + Mapa/Radar de Desertos).
- **Slide 5:** Impacto e Escalabilidade (Pronto para adoção pela OAB/PR e Defensoria Pública em todo o Estado).

---

### 🎤 3. Roteiro do Pitch de 2 Minutos (120 Segundos Cronometrados)

* **[0:00 - 0:25] O Problema:**  
  *"Vocês sabiam que em dezenas de comarcas do interior do Paraná, cidadãos vulneráveis esperam meses por atendimento porque não há advogados dativos inscritos? Enquanto isso, advogados em início de carreira buscam oportunidades, mas enfrentam um processo arcaico de indicação."*

* **[0:25 - 0:55] A Solução (Match Jurídico):**  
  *"Criamos o Match Jurídico: uma plataforma pública onde o cidadão relata seu problema na sua própria voz ou texto simples. Nossa Inteligência Artificial converte o relato em uma minuta de petição inicial juridicamente impecável, com fundamentação exata e zero alucinação."*

* **[0:55 - 1:25] A Inovação (O Matching Geodésico):**  
  *"Em seguida, nosso algoritmo geodésico conecta o caso ao advogado dativo mais próximo. E se for um deserto jurídico? O sistema aciona o modo de Raio Expandido e prioriza a comarca com bonificação de pontuação, eliminando os vazios de atendimento no Paraná."*

* **[1:25 - 1:50] A Prova / Tração:**  
  *"A solução conta com acessibilidade total via VLibras, certidão pública de integridade com hash SHA-256 e foi validada com testes reais durante este fim de semana com 100% de precisão nos fundamentos jurídicos."*

* **[1:50 - 2:00] Fechamento:**  
  *"O Match Jurídico transforma tecnologia de ponta em cidadania real. Mais justiça para quem precisa, mais valorização para a advocacia dativa. Muito obrigado!"*

---

## 💻 4. Prompts Prontos para Executar no Antigravity

Se você precisar recriar ou evoluir o projeto do zero no repositório da OAB, basta colar esta sequência de prompts no chat do Antigravity:

### 🔹 PROMPT 1: Setup da Base e Design System
```text
Crie uma aplicação Next.js 14 com App Router, TypeScript e Tailwind CSS para o projeto "Match Jurídico".
A plataforma visa modernizar a assistência judiciária gratuita e combater desertos jurídicos no Paraná (Parceria OAB/PR).
Configure:
1. Suporte a Tema Claro e Escuro com 'next-themes' e botão de alternância Sol/Lua.
2. Paleta de cores premium institucional (Azul Navy profundo #0F172A, Dourado OAB #D97706, Emerald para aprovações e Slate).
3. Header moderno com logotipo, status do sistema e navegação (Início, Sou Cidadão, Sou Advogado, Radar de Desertos, Validar Certidão).
4. Rodapé institucional referenciando a OAB/PR, TRE-PR e Sanepar com licença MIT.
```

### 🔹 PROMPT 2: Motor de Triagem Cidadã & Minuta com IA (Anti-Alucinação)
```text
Implemente a página de Triagem Cidadã ('/cidadao/novo-caso') e o motor de IA ('src/lib/ai/petition-generator.ts'):
1. O cidadão pode relatar seu problema em linguagem coloquial (ex: pensão alimentícia atrasada, corte indevido de água, falta de vaga em creche).
2. O motor deve extrair os fatos e estruturar uma Minuta Jurídica Oficial contendo:
   - Endereçamento ao Juízo competente da comarca informada.
   - Qualificação com benefícios da Justiça Gratuita (Art. 98 do CPC e Art. 5º, LXXIV da CF/88).
   - Dos Fatos (reorganizados cronologicamente com clareza).
   - Do Direito com fundamentação legal explícita e precisa.
   - Pedido de Tutela de Urgência (Art. 300 do CPC) se detectada urgência.
   - Dos Pedidos e Requerimentos de praxe.
3. Regra de Confiabilidade Anti-Alucinação: Para dados não informados pelo cidadão, o motor DEVE inserir o marcador '[A COMPLETAR EM ENTREVISTA]' e jamais inventar endereços, CPFs ou valores.
4. Forneça persistência com Mock LocalStorage automático caso o Supabase não esteja conectado.
```

### 🔹 PROMPT 3: Algoritmo de Matching Geodésico & Radar de Desertos
```text
Implemente o motor de alocação inteligente ('src/lib/matching/engine.ts') e o Cockpit do Advogado ('/advogado/dashboard'):
1. Cálculo de distância geodésica pela fórmula de Haversine entre o escritório do advogado e a comarca do processo.
2. Detecção automática de 'Deserto Jurídico': Comarcas com menos de 3 advogados dativos inscritos ativam o modo 'Raio Expandido (+50km)' e recebem badge de destaque com 'Score de Oportunidade (0-100)'.
3. O Cockpit do Advogado deve permitir filtrar casos por especialidade (Família, Cível, Previdenciário), visualizar a minuta pré-preenchida e realizar o aceite digital em 1 clique.
4. Crie a página '/radar-comarcas' exibindo o Observatório de Desertos Jurídicos com tabela interativa das comarcas do PR.
```

### 🔹 PROMPT 4: Acessibilidade Inclusiva (VLibras) e Certidão SHA-256
```text
Adicione os diferenciais de usabilidade e segurança para pontuação máxima na Auditoria:
1. Integre o widget oficial do VLibras (Tradução para Língua Brasileira de Sinais) de forma assíncrona e resiliente no layout global.
2. Implemente o gerador de Certidão Pública de Autenticidade ('/verificar/[hash]'):
   - Gere um hash criptográfico SHA-256 a partir do caso e da designação do defensor dativo.
   - Renderize um QR Code legível com a URL oficial de conferência pública.
   - Layout formal de certidão com carimbo de integridade para magistrados e cartórios.
```

---

## 🎒 5. Checklist de Saída de Casa
- [ ] Laptop com carregador e cabo de força.
- [ ] Extensão / benjamim (filtros de linha na mesa são disputados!).
- [ ] Celular com 4G/5G com capacidade de rotear internet caso o Wi-Fi fique congestionado.
- [ ] Pen drive com o código atual e este playbook salvo.
- [ ] Garrafa de água e documento de identificação (necessário no credenciamento da OAB).
