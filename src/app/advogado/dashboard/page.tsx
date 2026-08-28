'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  MapPin, 
  Scale, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  ArrowRight, 
  Filter, 
  User, 
  FileText,
  Clock,
  Flame
} from 'lucide-react';
import { getStoredRequerimentos, saveRequerimento, getCurrentUserProfile, clearAllRequerimentos } from '@/lib/storage/mock-store';
import { MOCK_ADVOGADOS, COMARCAS_DATA, ESPECIALIDADES_DATA } from '@/lib/data/mock-seed-data';
import { calculateHaversineDistanceKm } from '@/lib/matching/engine';
import { Requerimento, AdvogadoDativo } from '@/types/database';
import { Trash2 } from 'lucide-react';

export default function AdvogadoDashboardPage() {
  const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
  const [currentAdvogado, setCurrentAdvogado] = useState<AdvogadoDativo>(MOCK_ADVOGADOS[0]);
  const [filterEspecialidade, setFilterEspecialidade] = useState<string>('todos');
  const [showOnlyDeserts, setShowOnlyDeserts] = useState(false);
  const [selectedCaseForModal, setSelectedCaseForModal] = useState<Requerimento | null>(null);

  useEffect(() => {
    setRequerimentos(getStoredRequerimentos());
  }, []);

  const handleClearAll = () => {
    clearAllRequerimentos();
    setRequerimentos([]);
  };

  const handleAceitarCaso = (req: Requerimento) => {
    const updatedReq: Requerimento = {
      ...req,
      status: 'aceito',
      advogado_id: currentAdvogado.id,
      advogado: currentAdvogado,
      data_aceite: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveRequerimento(updatedReq);
    setRequerimentos(getStoredRequerimentos());
    setSelectedCaseForModal(null);
  };

  // Filtragem de casos disponíveis
  const casosDisponiveis = requerimentos.filter((r) => {
    if (r.status !== 'aberto_para_match') return false;
    if (filterEspecialidade !== 'todos' && r.especialidade_id !== filterEspecialidade) return false;
    if (showOnlyDeserts && !r.comarca?.is_deserto_juridico) return false;
    return true;
  });

  // Casos já aceitos por este advogado
  const meusCasosAceitos = requerimentos.filter((r) => {
    return r.status === 'aceito' || r.status === 'em_andamento';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header do Cockpit */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-blue-900/30">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg shadow-lg">
            {currentAdvogado.profile?.nome_completo.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {currentAdvogado.profile?.nome_completo}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                OAB/PR {currentAdvogado.numero_oab}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comarca Sede: <strong className="text-slate-200">{currentAdvogado.comarca_sede?.nome}</strong> • Raio de Atuação: <strong className="text-cyan-400">{currentAdvogado.raio_maximo_km} km</strong>
            </p>
          </div>
        </div>

        {/* Métricas do Advogado e Ações */}
        <div className="flex items-center space-x-3">
          {requerimentos.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Limpar todos os casos e mensagens de teste"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar Casos</span>
            </button>
          )}
          <div className="p-3 rounded-xl bg-navy-850 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Casos Ativos</span>
            <p className="text-base font-extrabold text-white">{meusCasosAceitos.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-navy-850 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Reputação</span>
            <p className="text-base font-extrabold text-amber-400">★ 4.95</p>
          </div>
          <div className="p-3 rounded-xl bg-navy-850 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
            <p className="text-xs font-bold text-emerald-400">Disponível</p>
          </div>
        </div>
      </div>

      {/* Radar de Oportunidades & Desertos Judiciais */}
      <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-center space-x-3">
          <Flame className="w-8 h-8 text-amber-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Alerta de Desertos Jurídicos</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Comarcas vizinhas como Reserva e Capanema estão com alta demanda e carência de defensores.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-center space-x-3">
          <Sparkles className="w-8 h-8 text-cyan-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Petições Pré-Estruturadas</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Todos os casos chegam com qualificação, fatos e fundamentação jurídica formalizados pela IA.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Chat Instantâneo pós-aceite</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Conexão imediata com o assistido para colher documentos e alinhar a estratégia.
            </p>
          </div>
        </div>
      </div>

      {/* Seção 1: Fila de Casos Disponíveis para Aceite */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Radar de Casos Disponíveis na Região</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {casosDisponiveis.length} oportunidades
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Casos abertos aguardando designação de advogado dativo
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterEspecialidade}
              onChange={(e) => setFilterEspecialidade(e.target.value)}
              className="bg-navy-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="todos">Todas as Especialidades</option>
              {ESPECIALIDADES_DATA.map((esp) => (
                <option key={esp.id} value={esp.id}>{esp.nome}</option>
              ))}
            </select>

            <button
              onClick={() => setShowOnlyDeserts(!showOnlyDeserts)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showOnlyDeserts 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-navy-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🔥 Apenas Desertos Jurídicos
            </button>
          </div>
        </div>

        {/* Cards de Casos Disponíveis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {casosDisponiveis.length === 0 ? (
            <div className="col-span-2 glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
              Nenhum caso novo aberto no momento com os filtros selecionados.
            </div>
          ) : (
            casosDisponiveis.map((caso) => {
              const comarca = caso.comarca || COMARCAS_DATA.find(c => c.id === caso.comarca_id);
              const distancia = comarca && currentAdvogado.comarca_sede
                ? calculateHaversineDistanceKm(
                    currentAdvogado.comarca_sede.latitude,
                    currentAdvogado.comarca_sede.longitude,
                    comarca.latitude,
                    comarca.longitude
                  )
                : 0;

              return (
                <div 
                  key={caso.id}
                  className="glass-panel rounded-2xl p-5 border border-blue-900/40 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-cyan-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                        {caso.protocolo}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        {comarca?.is_deserto_juridico && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                            Deserto Jurídico
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                          {distancia} km de distância
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {caso.titulo_caso || 'Requerimento de Assistência'}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {caso.descricao_relato}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-1">
                      <span>Comarca: <strong className="text-white">{comarca?.nome}</strong></span>
                      <span>•</span>
                      <span>Área: <strong className="text-indigo-300">{caso.especialidade?.nome}</strong></span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCaseForModal(caso)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ver Minuta da Petição</span>
                    </button>

                    <button
                      onClick={() => handleAceitarCaso(caso)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aceitar Caso</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Seção 2: Meus Casos em Andamento */}
      <div className="mt-14">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <span>Meus Casos em Andamento</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {meusCasosAceitos.length} ativos
          </span>
        </h2>

        <div className="space-y-3">
          {meusCasosAceitos.map((caso) => (
            <div 
              key={caso.id}
              className="glass-panel rounded-2xl p-4 border border-emerald-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-white">{caso.cidadao?.nome_completo || 'Maria Aparecida dos Santos'}</h4>
                    <span className="text-[10px] font-mono text-cyan-300 bg-blue-950 px-1.5 py-0.5 rounded">
                      {caso.protocolo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {caso.titulo_caso} • Comarca: {caso.comarca?.nome}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <Link
                  href={`/verificar/${caso.hash_autenticidade}`}
                  className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs border border-slate-700 flex items-center space-x-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Certidão</span>
                </Link>

                <Link
                  href={`/chat/${caso.id}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat com Assistido</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Prévia da Petição */}
      {selectedCaseForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 border border-cyan-500/40 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase">Minuta Estruturada pela IA</span>
                <h3 className="text-base font-bold text-white">{selectedCaseForModal.titulo_caso}</h3>
              </div>
              <button
                onClick={() => setSelectedCaseForModal(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="my-4 p-4 rounded-xl bg-navy-900 font-mono text-xs text-slate-200 overflow-y-auto leading-relaxed whitespace-pre-wrap flex-1">
              {selectedCaseForModal.requerimento_estruturado_md || selectedCaseForModal.descricao_relato}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedCaseForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Fechar
              </button>
              <button
                onClick={() => handleAceitarCaso(selectedCaseForModal)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Aceite do Caso</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
