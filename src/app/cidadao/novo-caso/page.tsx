'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  MapPin, 
  Scale, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  Send,
  AlertCircle,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { COMARCAS_DATA, ESPECIALIDADES_DATA, MOCK_ADVOGADOS } from '@/lib/data/mock-seed-data';
import { generateStructuredPetition, GeneratedPetitionOutput } from '@/lib/ai/petition-generator';
import { findMatchingAdvogados } from '@/lib/matching/engine';
import { generateProtocolHash } from '@/lib/qr/generator';
import { saveRequerimento, getCurrentUserProfile } from '@/lib/storage/mock-store';
import { Requerimento } from '@/types/database';
import { useTextToSpeech, useSpeechRecognition } from '@/hooks/use-speech';

export default function NovoCasoPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Formulário State
  const [comarcaId, setComarcaId] = useState(COMARCAS_DATA[0].id); // Goioerê / Reserva
  const [rendaFamiliar, setRendaFamiliar] = useState('1200');
  const [membrosFamilia, setMembrosFamilia] = useState('3');
  const [possuiUrgencia, setPossuiUrgencia] = useState(false);
  const [cep, setCep] = useState('84320-000');
  const [descricaoLivre, setDescricaoLivre] = useState('');

  // AI & Matching State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiResult, setAiResult] = useState<GeneratedPetitionOutput | null>(null);
  const [generatedRequerimento, setGeneratedRequerimento] = useState<Requerimento | null>(null);

  // Acessibilidade: Web Speech TTS e STT
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  const { startListening, stopListening, isListening, isSupported: isSttSupported } = useSpeechRecognition((text) => {
    setDescricaoLivre((prev) => {
      const base = prev.trim();
      return base ? `${base} ${text}` : text;
    });
  });

  const selectedComarca = COMARCAS_DATA.find(c => c.id === comarcaId) || COMARCAS_DATA[0];

  // Alternar Ditado por Voz
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Alternar Leitura do Relato
  const toggleReadRelato = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(descricaoLivre || 'Nenhum relato digitado ainda. Escreva ou dite o que está acontecendo.');
    }
  };

  // Alternar Leitura da Minuta
  const toggleReadMinuta = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (aiResult) {
      speak(`Título do caso: ${aiResult.tituloCaso}. Vara sugerida: ${aiResult.competenciaVaraSugerida}. Fundamentação: ${aiResult.fundamentacaoJuridica}. ${aiResult.requerimentoEstruturadoMd}`);
    }
  };

  // Exemplos rápidos para demonstração no pitch
  const handleQuickFill = (tipo: 'pensao' | 'inss' | 'remedio') => {
    if (tipo === 'pensao') {
      setDescricaoLivre(
        'Preciso cobrar a pensão alimentícia do meu filho de 7 anos. O pai dele não ajuda com nada há 8 meses, trocou de telefone e não tenho dinheiro para pagar advogado.'
      );
      setPossuiUrgencia(true);
      setRendaFamiliar('800');
    } else if (tipo === 'inss') {
      setDescricaoLivre(
        'Trabalhei a vida toda na lavoura e caí do trator, machucando a coluna seriamente. O INSS negou meu auxílio-doença rural dizendo que não comprovei atividade, mesmo eu tendo notas de produtor.'
      );
      setPossuiUrgencia(true);
      setRendaFamiliar('1100');
    } else {
      setDescricaoLivre(
        'Minha mãe tem doença pulmonar grave e o médico do posto receitou um remédio de R$ 3.800 por mês. A Farmácia Especial do Estado e a Prefeitura negaram o fornecimento.'
      );
      setPossuiUrgencia(true);
      setRendaFamiliar('1400');
    }
  };

  // Gerar Petição com IA
  const handleGeneratePetition = async () => {
    if (!descricaoLivre.trim()) return;
    if (isSpeaking) stopSpeaking();
    if (isListening) stopListening();
    setIsGeneratingAi(true);

    try {
      const userProfile = getCurrentUserProfile();
      const output = await generateStructuredPetition({
        nomeCidadao: userProfile?.nome_completo || 'Juliana Mendes de Castro',
        cpf: userProfile?.cpf || '458.912.879-04',
        comarcaNome: selectedComarca?.nome || 'Maringá',
        uf: selectedComarca?.uf || 'PR',
        descricaoLivre,
        rendaFamiliar: Number(rendaFamiliar) || 1200,
        membrosFamilia: Number(membrosFamilia) || 3,
        possuiUrgencia,
      });

      setAiResult(output);
      setStep(3);
    } catch (err) {
      console.error('Erro na IA:', err);
      // Fallback garantido caso ocorra qualquer erro
      const fallbackOutput: GeneratedPetitionOutput = {
        especialidade: ESPECIALIDADES_DATA[0],
        tituloCaso: 'Requerimento de Assistência Judiciária Gratuita',
        resumoFatos: descricaoLivre,
        requerimentoEstruturadoMd: `### EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA COMARCA DE ${selectedComarca.nome.toUpperCase()}/${selectedComarca.uf}

**PROTOCOLO ELETRÔNICO DE ATENDIMENTO DATIVO - PLATAFORMA MATCH JURÍDICO**

**REQUERENTE:** JULIANA MENDES DE CASTRO, brasileira, hipossuficiente.
**OBJETO:** REQUERIMENTO DE NOMEAÇÃO DE DEFENSOR DATIVO

#### I. DOS FATOS
${descricaoLivre}

#### II. DOS PEDIDOS
1. A concessão dos benefícios da Justiça Gratuita;
2. A designação formal de Advogado Dativo para acompanhamento do feito.`,
        fundamentacaoJuridica: 'Art. 5º, LXXIV da CF/88; Art. 98 do CPC/15.',
        pedidosFinais: ['Justiça Gratuita', 'Nomeação de Defensor Dativo'],
        competenciaVaraSugerida: `Vara da Comarca de ${selectedComarca.nome}/${selectedComarca.uf}`,
        grauVulnerabilidade: 'Alta',
        provedorIa: 'fallback-resiliente',
      };
      setAiResult(fallbackOutput);
      setStep(3);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Confirmar e Enviar para Matching
  const handleFinalSubmit = () => {
    if (!aiResult) return;
    if (isSpeaking) stopSpeaking();

    const userProfile = getCurrentUserProfile();
    const matching = findMatchingAdvogados({
      comarcaOrigem: selectedComarca,
      especialidade: aiResult.especialidade,
      advogadosDisponiveis: MOCK_ADVOGADOS,
    });

    const seqProtocol = `DAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const hash = generateProtocolHash(seqProtocol, userProfile.id);

    const novoReq: Requerimento = {
      id: `req-${Date.now()}`,
      protocolo: seqProtocol,
      cidadao_id: userProfile.id,
      cidadao: userProfile,
      comarca_id: selectedComarca.id,
      comarca: selectedComarca,
      especialidade_id: aiResult.especialidade.id,
      especialidade: aiResult.especialidade,
      status: 'aberto_para_match',
      prioridade: possuiUrgencia ? 'urgente' : 'media',
      descricao_relato: descricaoLivre,
      renda_familiar_declarada: Number(rendaFamiliar),
      membros_familia: Number(membrosFamilia),
      possui_urgencia: possuiUrgencia,
      cep_cidadao: cep,
      titulo_caso: aiResult.tituloCaso,
      resumo_fatos: aiResult.resumoFatos,
      requerimento_estruturado_md: aiResult.requerimentoEstruturadoMd,
      fundamentacao_juridica: aiResult.fundamentacaoJuridica,
      pedidos_finais: aiResult.pedidosFinais,
      competencia_vara_sugerida: aiResult.competenciaVaraSugerida,
      modo_busca_matching: matching.modoExpansao === 'deserto_fallback' ? 'deserto_fallback' : 'proximidade_sede',
      raio_busca_efetivo_km: matching.raioFinalKm,
      hash_autenticidade: hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveRequerimento(novoReq);
    setGeneratedRequerimento(novoReq);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Barra de Progresso com Acessibilidade */}
      <nav aria-label="Progresso do Requerimento" className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          <span className={step >= 1 ? 'text-blue-600 dark:text-cyan-400 font-extrabold' : ''}>1. Dados Básicos</span>
          <span className={step >= 2 ? 'text-blue-600 dark:text-cyan-400 font-extrabold' : ''}>2. Relato Livre</span>
          <span className={step >= 3 ? 'text-blue-600 dark:text-cyan-400 font-extrabold' : ''}>3. IA Jurídica</span>
          <span className={step >= 4 ? 'text-blue-600 dark:text-cyan-400 font-extrabold' : ''}>4. Protocolo & Match</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
          <div 
            className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </nav>

      {/* ETAPA 1: Comarca e Perfil */}
      {step === 1 && (
        <section aria-labelledby="etapa1-titulo" className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Etapa 1 de 4 • Local e Família</span>
            </div>
            <h2 id="etapa1-titulo" className="text-2xl font-bold text-slate-900 dark:text-white">Onde o problema aconteceu?</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              A comarca é a cidade responsável pela Justiça na sua região e nos ajuda a encontrar o advogado dativo mais próximo.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="select-comarca" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Comarca / Município do Paraná:
              </label>
              <select
                id="select-comarca"
                value={comarcaId}
                onChange={(e) => setComarcaId(e.target.value)}
                className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-blue-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-400 shadow-sm"
              >
                {COMARCAS_DATA.map((c) => (
                  <option key={c.id} value={c.id} className="text-slate-900 dark:text-white bg-white dark:bg-navy-900">
                    {c.nome} ({c.regiao}) — {c.is_deserto_juridico ? 'Deserto Jurídico (≤25 advogados locais)' : `Comarca Coberta (${c.num_advogados_ativos} advogados)`}
                  </option>
                ))}
              </select>
              {selectedComarca.is_deserto_juridico && (
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1.5 flex items-center space-x-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>
                    Esta comarca é classificada como Deserto Jurídico ({selectedComarca.num_advogados_ativos} advogados ativos locais). O sistema ativará a busca com raio ampliado automaticamente.
                  </span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="input-renda" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Renda Familiar Mensal (R$):
                </label>
                <input
                  id="input-renda"
                  type="number"
                  value={rendaFamiliar}
                  onChange={(e) => setRendaFamiliar(e.target.value)}
                  placeholder="Ex: 1200"
                  className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-400 shadow-sm"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Usado para comprovar direito ao atendimento 100% gratuito</span>
              </div>

              <div>
                <label htmlFor="input-membros" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Quantas pessoas vivem com essa renda:
                </label>
                <input
                  id="input-membros"
                  type="number"
                  value={membrosFamilia}
                  onChange={(e) => setMembrosFamilia(e.target.value)}
                  min="1"
                  className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-400 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="input-cep" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">CEP do seu endereço:</label>
              <input
                id="input-cep"
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="w-full max-w-xs bg-white dark:bg-navy-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-400 shadow-sm"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Avançar para a etapa de relato do caso"
            >
              <span>Avançar para o Relato</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ETAPA 2: Relato em Linguagem Simples com Voz e Ditado */}
      {step === 2 && (
        <section aria-labelledby="etapa2-titulo" className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-blue-500/20 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Etapa 2 de 4 • Seu Relato</span>
              </div>
              <h2 id="etapa2-titulo" className="text-2xl font-bold text-slate-900 dark:text-white">Conte o que está acontecendo</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Escreva ou dite com suas próprias palavras. Nossa IA Jurídica organizará tudo nos termos da lei.
              </p>
            </div>

            {/* Atalhos rápidos para demo no pitch */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 self-center">Exemplos rápidos:</span>
              <button
                type="button"
                onClick={() => handleQuickFill('pensao')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300 text-xs border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Pensão / Guarda
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('inss')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300 text-xs border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                INSS Rural
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('remedio')}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-300 text-xs border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Remédio SUS
              </button>
            </div>
          </div>

          {/* Barra de Ferramentas de Acessibilidade (Voz e Leitura) */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-100 dark:bg-navy-950/80 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1">
              Ferramentas de Inclusão e Voz:
            </span>

            {/* Botão Ditar Relato (STT) */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              aria-label={isListening ? 'Parar gravação de voz' : 'Ditar relato por voz usando microfone'}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-500/30' 
                  : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />}
              <span>{isListening ? 'Gravando... Clique para Parar' : 'Ditar por Voz'}</span>
            </button>

            {/* Botão Ouvir Relato (TTS) */}
            <button
              type="button"
              onClick={toggleReadRelato}
              aria-label={isSpeaking ? 'Parar leitura em voz alta' : 'Ouvir relato digitado em voz alta'}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isSpeaking 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              <span>{isSpeaking ? 'Parar Áudio' : 'Ouvir Relato'}</span>
            </button>

            {isListening && (
              <span className="text-[11px] text-red-600 dark:text-red-400 font-medium animate-pulse ml-auto flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Ouvindo sua voz... Fale normalmente</span>
              </span>
            )}
          </div>

          <div>
            <label htmlFor="textarea-relato" className="sr-only">
              Descreva sua situação
            </label>
            <textarea
              id="textarea-relato"
              rows={6}
              value={descricaoLivre}
              onChange={(e) => setDescricaoLivre(e.target.value)}
              placeholder="Exemplo: Preciso que o pai dos meus filhos pague a pensão que combinamos verbalmente. Estou desempregada e não consigo sustentar as crianças sozinha..."
              className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-blue-700/40 rounded-2xl p-4 text-slate-900 dark:text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-400 transition-colors shadow-sm"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldAlert className={`w-5 h-5 ${possuiUrgencia ? 'text-red-500' : 'text-slate-400'}`} />
              <div>
                <label htmlFor="checkbox-urgencia" className="text-xs font-bold text-slate-900 dark:text-white block cursor-pointer">
                  Este caso tem perigo imediato ou urgência?
                </label>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Ex: risco à saúde, corte de alimentos, perda de prazo processual.</p>
              </div>
            </div>
            <input
              id="checkbox-urgencia"
              type="checkbox"
              checked={possuiUrgencia}
              onChange={(e) => setPossuiUrgencia(e.target.checked)}
              className="w-5 h-5 rounded accent-blue-600 dark:accent-cyan-400 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              ← Voltar
            </button>

            <button
              type="button"
              disabled={!descricaoLivre.trim() || isGeneratingAi}
              onClick={handleGeneratePetition}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg flex items-center space-x-2 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Estruturar petição inicial com inteligência artificial"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>IA Formatando Petição...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Estruturar Requerimento com IA →</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* ETAPA 3: Revisão da Petição Estruturada pela IA */}
      {step === 3 && aiResult && (
        <section aria-labelledby="etapa3-titulo" className="glass-panel rounded-3xl p-6 sm:p-8 border border-blue-200 dark:border-cyan-500/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Petição Estruturada com Sucesso pela IA</span>
              </div>
              <h2 id="etapa3-titulo" className="text-xl font-bold text-slate-900 dark:text-white">{aiResult.tituloCaso}</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleReadMinuta}
                aria-label={isSpeaking ? 'Parar leitura em voz alta da petição' : 'Ouvir toda a petição em voz alta'}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSpeaking 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-navy-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                <span>{isSpeaking ? 'Parar Leitura' : 'Ouvir Minuta Completa'}</span>
              </button>

              <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-cyan-400/30 text-blue-800 dark:text-cyan-300 text-xs font-bold">
                {aiResult.especialidade.nome}
              </span>
            </div>
          </div>

          {/* Destaques Rápidos da Peça */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Vara Competente Sugerida</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{aiResult.competenciaVaraSugerida}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Vulnerabilidade Social</span>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{aiResult.grauVulnerabilidade}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Fundamentação Legal</span>
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mt-0.5 truncate">{aiResult.fundamentacaoJuridica}</p>
            </div>
          </div>

          {/* Preview do Documento Markdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Visualização da Minuta do Requerimento Inicial:
            </label>
            <div 
              tabIndex={0}
              aria-label="Texto integral da petição inicial formatada"
              className="p-5 rounded-2xl bg-white dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 max-h-80 overflow-y-auto font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {aiResult.requerimentoEstruturadoMd}
            </div>
          </div>

          {/* Card de Disclaimer Obrigatório da OAB */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 flex items-start space-x-3">
            <Scale className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white block font-bold mb-0.5">Revisão Humana e Prerrogativa Profissional (Lei 8.906/94):</strong>
              Este documento foi gerado por IA com base nas suas informações e serve de base para o seu defensor. O advogado dativo que aceitar o caso fará a validação jurídica completa e as adaptações necessárias antes de qualquer protocolo judicial.
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              ← Editar Relato
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-extrabold text-sm shadow-xl flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label="Confirmar envio do caso e iniciar matching de advogados dativos"
            >
              <Send className="w-4 h-4" />
              <span>Confirmar & Iniciar Matching de Dativos →</span>
            </button>
          </div>
        </section>
      )}

      {/* ETAPA 4: Sucesso, Protocolo e Fila de Matching */}
      {step === 4 && generatedRequerimento && (
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-emerald-300 dark:border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Protocolo Gerado com Sucesso
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {generatedRequerimento.protocolo}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
              Seu pedido já foi autuado e está visível para os advogados dativos de{' '}
              <strong className="text-slate-900 dark:text-white">{selectedComarca.nome}</strong> e região.
            </p>
          </div>

          {/* Badge de Matching Ativo */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-blue-900/50 max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Comarca:</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedComarca.nome} - {selectedComarca.uf}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Raio de Busca Efetivo:</span>
              <span className="font-bold text-blue-600 dark:text-cyan-300">{generatedRequerimento.raio_busca_efetivo_km} km</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Status Atual:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[11px]">Aguardando Aceite do Dativo</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/cidadao/meus-casos')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md"
            >
              Acompanhar no Painel do Cidadão →
            </button>
            <button
              onClick={() => router.push(`/verificar/${generatedRequerimento.hash_autenticidade}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700"
            >
              Ver Certidão & QR Code
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
