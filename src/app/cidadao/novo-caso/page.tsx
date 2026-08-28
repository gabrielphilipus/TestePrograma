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
  HelpCircle
} from 'lucide-react';
import { COMARCAS_DATA, ESPECIALIDADES_DATA, MOCK_ADVOGADOS } from '@/lib/data/mock-seed-data';
import { generateStructuredPetition, GeneratedPetitionOutput } from '@/lib/ai/petition-generator';
import { findMatchingAdvogados } from '@/lib/matching/engine';
import { generateProtocolHash } from '@/lib/qr/generator';
import { saveRequerimento, getCurrentUserProfile } from '@/lib/storage/mock-store';
import { Requerimento } from '@/types/database';

export default function NovoCasoPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Formulário State
  const [comarcaId, setComarcaId] = useState(COMARCAS_DATA[0].id); // Reserva
  const [rendaFamiliar, setRendaFamiliar] = useState('1200');
  const [membrosFamilia, setMembrosFamilia] = useState('3');
  const [possuiUrgencia, setPossuiUrgencia] = useState(false);
  const [cep, setCep] = useState('84320-000');
  const [descricaoLivre, setDescricaoLivre] = useState('');

  // AI & Matching State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiResult, setAiResult] = useState<GeneratedPetitionOutput | null>(null);
  const [generatedRequerimento, setGeneratedRequerimento] = useState<Requerimento | null>(null);

  const selectedComarca = COMARCAS_DATA.find(c => c.id === comarcaId) || COMARCAS_DATA[0];

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
    setIsGeneratingAi(true);

    try {
      const userProfile = getCurrentUserProfile();
      const output = await generateStructuredPetition({
        nomeCidadao: userProfile.nome_completo || 'Juliana Mendes de Castro',
        cpf: userProfile.cpf || '458.912.879-04',
        comarcaNome: selectedComarca.nome,
        uf: selectedComarca.uf,
        descricaoLivre,
        rendaFamiliar: Number(rendaFamiliar),
        membrosFamilia: Number(membrosFamilia),
        possuiUrgencia,
      });

      setAiResult(output);
      setStep(3);
    } catch (err) {
      console.error('Erro na IA:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Confirmar e Enviar para Matching
  const handleFinalSubmit = () => {
    if (!aiResult) return;

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
      
      {/* Barra de Progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          <span className={step >= 1 ? 'text-cyan-400' : ''}>1. Dados Básicos</span>
          <span className={step >= 2 ? 'text-cyan-400' : ''}>2. Relato Livre</span>
          <span className={step >= 3 ? 'text-cyan-400' : ''}>3. IA Jurídica</span>
          <span className={step >= 4 ? 'text-cyan-400' : ''}>4. Protocolo & Match</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* ETAPA 1: Comarca e Perfil */}
      {step === 1 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-blue-500/20 shadow-2xl space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Etapa 1 de 4</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Onde o problema aconteceu?</h2>
            <p className="text-xs text-slate-400 mt-1">
              A comarca é fundamental para definirmos a competência do tribunal e acionarmos advogados dativos da região.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Comarca / Município do Paraná:
              </label>
              <select
                value={comarcaId}
                onChange={(e) => setComarcaId(e.target.value)}
                className="w-full bg-navy-900 border border-blue-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
              >
                {COMARCAS_DATA.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.regiao}) — {c.is_deserto_juridico ? '⚠️ DESERTO JURÍDICO (Carência de Advogados)' : 'Comarca Coberta'}
                  </option>
                ))}
              </select>
              {selectedComarca.is_deserto_juridico && (
                <p className="text-[11px] text-amber-400 mt-1.5 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>
                    Esta comarca possui carência crítica de defensores (Score de Oportunidade {selectedComarca.score_oportunidade}). O sistema ativará a busca com raio expandido automaticamente.
                  </span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Renda Familiar Mensal (R$):
                </label>
                <input
                  type="number"
                  value={rendaFamiliar}
                  onChange={(e) => setRendaFamiliar(e.target.value)}
                  placeholder="Ex: 1200"
                  className="w-full bg-navy-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <span className="text-[10px] text-slate-400">Critério para gratuidade de justiça</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Membros da Família que dependem dessa renda:
                </label>
                <input
                  type="number"
                  value={membrosFamilia}
                  onChange={(e) => setMembrosFamilia(e.target.value)}
                  min="1"
                  className="w-full bg-navy-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">CEP:</label>
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="w-full max-w-xs bg-navy-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg flex items-center space-x-2"
            >
              <span>Avançar para o Relato</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 2: Relato em Linguagem Simples */}
      {step === 2 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-blue-500/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Etapa 2 de 4</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Conte o que está acontecendo</h2>
              <p className="text-xs text-slate-400 mt-1">
                Escreva livremente com suas palavras. Nossa IA Jurídica organizará os fatos e artigos da lei.
              </p>
            </div>

            {/* Atalhos rápidos para demo no pitch */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 self-center">Exemplos rápidos:</span>
              <button
                type="button"
                onClick={() => handleQuickFill('pensao')}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-cyan-300 text-xs border border-blue-500/30 hover:bg-blue-500/20"
              >
                Pensão / Guarda
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('inss')}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-cyan-300 text-xs border border-blue-500/30 hover:bg-blue-500/20"
              >
                INSS Rural
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('remedio')}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-cyan-300 text-xs border border-blue-500/30 hover:bg-blue-500/20"
              >
                Remédio SUS
              </button>
            </div>
          </div>

          <div>
            <textarea
              rows={6}
              value={descricaoLivre}
              onChange={(e) => setDescricaoLivre(e.target.value)}
              placeholder="Exemplo: Preciso que o pai dos meus filhos pague a pensão que combinamos verbalmente. Estou desempregada e não consigo sustentar as crianças sozinha..."
              className="w-full bg-navy-900 border border-blue-700/40 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldAlert className={`w-5 h-5 ${possuiUrgencia ? 'text-crimson' : 'text-slate-400'}`} />
              <div>
                <h4 className="text-xs font-bold text-white">Este caso tem perigo imediato ou urgência?</h4>
                <p className="text-[11px] text-slate-400">Ex: risco à saúde, corte de alimentos, perda de prazo processual.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={possuiUrgencia}
              onChange={(e) => setPossuiUrgencia(e.target.checked)}
              className="w-5 h-5 rounded accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              ← Voltar
            </button>

            <button
              type="button"
              disabled={!descricaoLivre.trim() || isGeneratingAi}
              onClick={handleGeneratePetition}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg flex items-center space-x-2 disabled:opacity-50"
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
        </div>
      )}

      {/* ETAPA 3: Revisão da Petição Estruturada pela IA */}
      {step === 3 && aiResult && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Petição Estruturada com Sucesso pela IA</span>
              </div>
              <h2 className="text-xl font-bold text-white">{aiResult.tituloCaso}</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold">
              {aiResult.especialidade.nome}
            </span>
          </div>

          {/* Destaques Rápidos da Peça */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Vara Competente Sugerida</span>
              <p className="text-xs font-bold text-white mt-0.5">{aiResult.competenciaVaraSugerida}</p>
            </div>

            <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Vulnerabilidade Social</span>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">{aiResult.grauVulnerabilidade}</p>
            </div>

            <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Fundamentação Legal</span>
              <p className="text-xs font-bold text-indigo-300 mt-0.5 truncate">{aiResult.fundamentacaoJuridica}</p>
            </div>
          </div>

          {/* Preview do Documento Markdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Visualização da Minuta do Requerimento Inicial:
            </label>
            <div className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 max-h-80 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
              {aiResult.requerimentoEstruturadoMd}
            </div>
          </div>

          {/* Card de Disclaimer Obrigatório da OAB */}
          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start space-x-3">
            <Scale className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block font-bold mb-0.5">Revisão Humana e Prerrogativa Profissional (Lei 8.906/94):</strong>
              Este documento foi gerado por IA com base nas suas informações e serve de base para o seu defensor. O advogado dativo que aceitar o caso fará a validação jurídica completa e as adaptações necessárias antes de qualquer protocolo judicial.
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              ← Editar Relato
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-navy-900 font-extrabold text-sm shadow-xl flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Confirmar & Iniciar Matching de Dativos →</span>
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 4: Sucesso, Protocolo e Fila de Matching */}
      {step === 4 && generatedRequerimento && (
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Protocolo Gerado com Sucesso
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              {generatedRequerimento.protocolo}
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              Seu pedido já foi autuado e está visível para os advogados dativos de{' '}
              <strong className="text-white">{selectedComarca.nome}</strong> e região.
            </p>
          </div>

          {/* Badge de Matching Ativo */}
          <div className="p-4 rounded-2xl bg-navy-900 border border-blue-900/50 max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Comarca:</span>
              <span className="font-bold text-white">{selectedComarca.nome} - {selectedComarca.uf}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Raio de Busca Efetivo:</span>
              <span className="font-bold text-cyan-300">{generatedRequerimento.raio_busca_efetivo_km} km</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Status Atual:</span>
              <span className="font-bold text-amber-400 uppercase text-[11px]">Aguardando Aceite do Dativo</span>
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-sm border border-slate-700"
            >
              Ver Certidão & QR Code
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
