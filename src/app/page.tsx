'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  QrCode, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  Compass,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import { COMARCAS_DATA, ESPECIALIDADES_DATA, MOCK_ADVOGADOS } from '@/lib/data/mock-seed-data';
import { findMatchingAdvogados } from '@/lib/matching/engine';

export default function HomePage() {
  const [selectedComarcaId, setSelectedComarcaId] = useState(COMARCAS_DATA[0].id); // Reserva (deserto jurídico)
  const [selectedEspecialidadeId, setSelectedEspecialidadeId] = useState(ESPECIALIDADES_DATA[0].id);

  const selectedComarca = COMARCAS_DATA.find(c => c.id === selectedComarcaId) || COMARCAS_DATA[0];
  const selectedEspecialidade = ESPECIALIDADES_DATA.find(e => e.id === selectedEspecialidadeId);

  // Simulação instantânea do algoritmo de matching
  const matchingResult = findMatchingAdvogados({
    comarcaOrigem: selectedComarca,
    especialidade: selectedEspecialidade,
    advogadosDisponiveis: MOCK_ADVOGADOS
  });

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Glows & Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/15 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-full max-w-2xl h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        
        {/* Badge Superior */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 text-blue-700 dark:text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 animate-pulse" />
          <span>IA Generativa Jurídica + Alocação Geográfica de Dativos</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.1]">
          Conexão Inteligente para a <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 bg-clip-text text-transparent">
            Assistência Judiciária Gratuita
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Transformamos o relato do cidadão em requerimentos jurídicos estruturados com IA e conectamos advogados dativos por proximidade, solucionando os desertos judiciais do interior.
        </p>

        {/* Botoes de Ação Principais */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cidadao/novo-caso"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-base shadow-xl shadow-blue-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>Sou Cidadão e Preciso de Ajuda</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/advogado/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 dark:bg-navy-800/90 dark:hover:bg-navy-700/90 border border-slate-300 dark:border-blue-500/30 text-slate-800 dark:text-slate-100 font-bold text-base shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Sou Advogado Dativo</span>
          </Link>
        </div>

        {/* Micro-Features Rápidas */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-navy-850/60 border border-slate-200 dark:border-blue-900/40 backdrop-blur-md shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-cyan-400 font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>IA de Petição</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Gera a peça inicial formal a partir de texto livre.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-navy-850/60 border border-slate-200 dark:border-blue-900/40 backdrop-blur-md shadow-sm">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-xs mb-1">
              <MapPin className="w-4 h-4" />
              <span>Desertos Jurídicos</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Expansão de raio em comarcas com carência de OABs.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-navy-850/60 border border-slate-200 dark:border-blue-900/40 backdrop-blur-md shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
              <MessageSquare className="w-4 h-4" />
              <span>Chat em Tempo Real</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Canal direto após o aceite formal do dativo.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-navy-850/60 border border-slate-200 dark:border-blue-900/40 backdrop-blur-md shadow-sm">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
              <QrCode className="w-4 h-4" />
              <span>Validação Oficial</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Hash SHA-256 e QR code para consulta pública.</p>
          </div>
        </div>

      </section>

      {/* Seção Interativa: Simulador do Algoritmo de Matching */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-blue-500/20 shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-blue-900/40">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" />
                <span>Simulador de Matching ao Vivo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Como o Algoritmo Combate os Desertos Jurídicos
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Escolha uma comarca do Paraná e veja a IA calculando o score de oportunidade, detectando carência e acionando o raio de fallback.
              </p>
            </div>

            <Link
              href="/radar-comarcas"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-700 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-cyan-500/30 px-4 py-2.5 rounded-xl transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ver Mapa Completo de Oportunidades</span>
            </Link>
          </div>

          {/* Controles de Simulação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            
            {/* Seletor de Comarca */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Selecione a Comarca do Processo:
              </label>
              <select
                value={selectedComarcaId}
                onChange={(e) => setSelectedComarcaId(e.target.value)}
                className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-blue-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors shadow-sm"
              >
                {COMARCAS_DATA.map((c) => (
                  <option key={c.id} value={c.id} className="text-slate-900 dark:text-white bg-white dark:bg-navy-900">
                    {c.nome} ({c.regiao}) — {c.is_deserto_juridico ? 'Deserto Jurídico (Score: ' + c.score_oportunidade + ')' : 'OABs: ' + c.num_advogados_ativos}
                  </option>
                ))}
              </select>
            </div>

            {/* Seletor de Especialidade */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Área do Direito:
              </label>
              <select
                value={selectedEspecialidadeId}
                onChange={(e) => setSelectedEspecialidadeId(e.target.value)}
                className="w-full bg-white dark:bg-navy-900 border border-slate-300 dark:border-blue-700/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 transition-colors shadow-sm"
              >
                {ESPECIALIDADES_DATA.map((esp) => (
                  <option key={esp.id} value={esp.id} className="text-slate-900 dark:text-white bg-white dark:bg-navy-900">
                    {esp.nome}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Resultado do Diagnóstico da Comarca */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Diagnóstico da Comarca */}
            <div className={`p-5 rounded-2xl border transition-colors ${selectedComarca.is_deserto_juridico ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/40' : 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-500/30'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Diagnóstico Regional</span>
                {selectedComarca.is_deserto_juridico ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-500/30">
                    <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    <span>Deserto Jurídico</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Comarca Coberta</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedComarca.nome} - {selectedComarca.uf}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Região: {selectedComarca.regiao} • População: {selectedComarca.populacao.toLocaleString('pt-BR')}</p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Advogados Dativos Ativos:</span>
                  <span className={`font-bold ${selectedComarca.num_advogados_ativos <= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {selectedComarca.num_advogados_ativos} advogados
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">Score de Oportunidade:</span>
                  <span className="font-extrabold text-blue-600 dark:text-cyan-400">{selectedComarca.score_oportunidade} / 100</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">Modo de Matching:</span>
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300 uppercase text-[11px]">
                    {matchingResult.modoExpansao === 'deserto_fallback' ? 'Raio Expandido (Fallback)' : 'Proximidade Sede'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2 & 3: Lista de Advogados Compatíveis Encontrados */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-50/80 dark:bg-navy-900/80 border border-slate-200 dark:border-blue-900/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dativos Disponíveis no Raio Efetivo ({matchingResult.raioFinalKm} km)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ordenados por proximidade geodésica e afinidade com {selectedEspecialidade?.nome}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-cyan-300 border border-blue-200 dark:border-blue-500/30">
                  {matchingResult.totalEncontrados} advogados encontrados
                </span>
              </div>

              <div className="space-y-3">
                {matchingResult.matches.map((match, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-navy-850/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-600/30 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-700 dark:text-cyan-300 font-bold text-sm shrink-0">
                        {match.advogado.profile?.nome_completo.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white">{match.advogado.profile?.nome_completo}</h5>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-medium">
                            OAB/PR {match.advogado.numero_oab}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{match.motivoMatch}</p>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-blue-600 dark:text-cyan-300">Match {match.scoreMatch}%</span>
                        <div className="w-12 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full" style={{ width: `${match.scoreMatch}%` }}></div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Distância: <strong className="text-slate-800 dark:text-white">{match.distanciaKm} km</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Seção 3 Passos da Jornada */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Fluxo Transparente</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Como Funciona a Jornada do Cidadão ao Aceite</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Eliminamos a burocracia das filas e dos deslocamentos desnecessários em comarcas desprovidas de Defensoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Passo 1 */}
          <div className="glass-panel p-8 rounded-3xl relative group hover:border-blue-400 dark:hover:border-cyan-500/40 transition-all shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400 font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Relato do Problema em Linguagem Simples</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              O cidadão explica sua situação com suas próprias palavras, anexa documentos básicos e seleciona sua comarca.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-blue-600 dark:text-cyan-400 font-medium flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>IA estrutura os fatos e fundamentos</span>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="glass-panel p-8 rounded-3xl relative group hover:border-indigo-400 dark:hover:border-cyan-500/40 transition-all shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Matching de Proximidade & Desertos</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              O caso é disponibilizado instantaneamente no cockpit de advogados dativos credenciados na região ou no raio expandido.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Priorização por distância geodésica</span>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="glass-panel p-8 rounded-3xl relative group hover:border-emerald-400 dark:hover:border-cyan-500/40 transition-all shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aceite, Chat em Tempo Real & QR Code</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Com o aceite formal, o chat é liberado entre o cidadão e o advogado para alinhamento e o requerimento ganha selo de autenticidade.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certidão Pública com QR Code</span>
            </div>
          </div>

        </div>

        {/* CTA Banner Final */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 dark:from-blue-900/60 dark:via-navy-850 dark:to-indigo-900/60 p-8 sm:p-12 border border-blue-300 dark:border-cyan-500/30 text-center relative overflow-hidden shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pronto para testar a experiência completa?
          </h3>
          <p className="text-sm text-blue-100 dark:text-slate-300 max-w-2xl mx-auto mt-2 mb-6">
            Inicie um atendimento como cidadão ou explore o cockpit de gestão de casos como advogado dativo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cidadao/novo-caso"
              className="px-6 py-3 rounded-xl bg-white dark:bg-cyan-500 hover:bg-slate-100 dark:hover:bg-cyan-400 text-blue-900 dark:text-navy-900 font-bold text-sm shadow-lg transition-all"
            >
              Criar Novo Requerimento com IA →
            </Link>
            <Link
              href="/advogado/dashboard"
              className="px-6 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-800 dark:bg-navy-800 dark:hover:bg-navy-700 text-white font-bold text-sm border border-blue-400/40 dark:border-slate-700 transition-all"
            >
              Abrir Cockpit do Advogado
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
