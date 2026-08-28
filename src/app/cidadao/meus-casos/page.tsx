'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  MessageSquare, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PlusCircle, 
  User, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { getStoredRequerimentos, getCurrentUserProfile, clearAllRequerimentos } from '@/lib/storage/mock-store';
import { Requerimento, Profile } from '@/types/database';
import { Trash2 } from 'lucide-react';

export default function MeusCasosCidadaoPage() {
  const [requerimentos, setRequerimentos] = useState<Requerimento[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setProfile(getCurrentUserProfile());
    setRequerimentos(getStoredRequerimentos());
  }, []);

  const handleClearAll = () => {
    clearAllRequerimentos();
    setRequerimentos([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Header do Painel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-blue-900/30">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>Área do Cidadão</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Meus Requerimentos de Assistência
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe o andamento dos seus pedidos, aceite dos defensores dativos e conversas ativas.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {requerimentos.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/40 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Limpar todos os casos e mensagens de teste"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Histórico</span>
            </button>
          )}

          <Link
            href="/cidadao/novo-caso"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Requerimento</span>
          </Link>
        </div>
      </div>

      {/* Lista de Requerimentos */}
      <div className="mt-8 space-y-6">
        {requerimentos.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center">
            <Scale className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Nenhum requerimento cadastrado ainda</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
              Você ainda não enviou nenhum relato para a defensoria dativa.
            </p>
            <Link
              href="/cidadao/novo-caso"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Criar Primeiro Requerimento
            </Link>
          </div>
        ) : (
          requerimentos.map((req) => (
            <div 
              key={req.id}
              className="glass-panel rounded-2xl p-6 border border-blue-900/40 hover:border-cyan-500/30 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800/60">
                    {req.protocolo}
                  </span>
                  <span className="text-xs text-slate-400">
                    Comarca: <strong className="text-white">{req.comarca?.nome || 'Paraná'}</strong>
                  </span>
                  {req.prioridade === 'urgente' && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                      Urgente
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {req.status === 'aceito' || req.status === 'em_andamento' ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aceito por Advogado Dativo</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Em Fila de Matching ({req.raio_busca_efetivo_km} km)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Título & Resumo */}
              <div>
                <h3 className="text-base font-bold text-white">{req.titulo_caso || 'Requerimento de Assistência Judiciária'}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {req.descricao_relato}
                </p>
              </div>

              {/* Advogado Atribuído (se houver) */}
              {req.advogado && (
                <div className="p-3 rounded-xl bg-navy-850/80 border border-emerald-900/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs">
                      {req.advogado.profile?.nome_completo.substring(0, 2).toUpperCase() || 'DR'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{req.advogado.profile?.nome_completo}</h4>
                      <p className="text-[11px] text-slate-400">
                        OAB/PR {req.advogado.numero_oab} • Sede: {req.advogado.comarca_sede?.nome || 'Paraná'}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/chat/${req.id}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center space-x-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Abrir Chat Seguro</span>
                  </Link>
                </div>
              )}

              {/* Ações do Rodapé */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-[11px] text-slate-500">
                  Cadastrado em {new Date(req.created_at).toLocaleDateString('pt-BR')}
                </span>

                <div className="flex items-center space-x-3">
                  <Link
                    href={`/verificar/${req.hash_autenticidade}`}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 text-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Ver Certidão Oficial</span>
                  </Link>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
