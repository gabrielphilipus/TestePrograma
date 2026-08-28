'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Scale, 
  Users, 
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { COMARCAS_DATA, ESPECIALIDADES_DATA } from '@/lib/data/mock-seed-data';

export default function RadarComarcasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'desertos' | 'cobertas'>('todos');

  const filteredComarcas = COMARCAS_DATA.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.regiao.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'desertos') return c.is_deserto_juridico;
    if (filterType === 'cobertas') return !c.is_deserto_juridico;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header do Radar */}
      <div className="pb-8 border-b border-blue-900/30">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
          <MapPin className="w-4 h-4" />
          <span>Observatório de Acesso à Justiça • Dados Reais OAB/PR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Radar de Comarcas & Desertos Jurídicos
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
          Monitoramento inteligente com base em dois pilares complementares: o <strong>Score de Oportunidade (0–100)</strong> (para atração e alocação estratégica de advogados) e a detecção de <strong>Desertos Jurídicos</strong> (comarcas com escassez crítica absoluta de advogados no local, ativando a expansão de raio geodésico para garantir atendimento ao cidadão).
        </p>
      </div>

      {/* Destaques de Impacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Comarcas em Alerta</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-300">
            {COMARCAS_DATA.filter(c => c.is_deserto_juridico).length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Comarcas com 3 ou menos advogados dativos inscritos (Desertos Jurídicos).
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Maior Score de Oportunidade</span>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-300">92.47 / 100</p>
          <p className="text-xs text-slate-400 mt-1">
            Comarca de Goioerê/PR • 1.060 nomeações para 365 advogados cadastrados (Alta Carência).
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Algoritmo de Expansão</span>
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-300">100% Automático</p>
          <p className="text-xs text-slate-400 mt-1">
            Amplia o raio de 40 km até 250 km conforme a carência da comarca.
          </p>
        </div>

      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6">
        
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por comarca (ex: Reserva, Londrina, Curitiba...)"
            className="w-full bg-navy-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'todos' ? 'bg-blue-600 text-white' : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas ({COMARCAS_DATA.length})
          </button>
          <button
            onClick={() => setFilterType('desertos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'desertos' ? 'bg-amber-600 text-white' : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ⚠️ Apenas Desertos
          </button>
          <button
            onClick={() => setFilterType('cobertas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'cobertas' ? 'bg-emerald-600 text-white' : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ✓ Comarcas Cobertas
          </button>
        </div>

      </div>

      {/* Tabela Interativa de Comarcas */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-blue-900/40 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            <thead className="bg-navy-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold">Comarca / Região</th>
                <th className="px-6 py-4 font-bold">População Estimada</th>
                <th className="px-6 py-4 font-bold">Dativos Ativos</th>
                <th className="px-6 py-4 font-bold">Processos / Ano</th>
                <th className="px-6 py-4 font-bold">Score de Oportunidade</th>
                <th className="px-6 py-4 font-bold text-right">Ação</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {filteredComarcas.map((comarca) => (
                <tr key={comarca.id} className="hover:bg-navy-850/60 transition-colors">
                  
                  {/* Nome & Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        comarca.is_deserto_juridico ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-cyan-300'
                      }`}>
                        {comarca.uf}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{comarca.nome}</span>
                          {comarca.is_deserto_juridico && (
                            <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                              Deserto
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{comarca.regiao}</span>
                      </div>
                    </div>
                  </td>

                  {/* População */}
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {comarca.populacao.toLocaleString('pt-BR')} hab.
                  </td>

                  {/* Advogados Ativos */}
                  <td className="px-6 py-4">
                    <span className={`font-bold ${comarca.num_advogados_ativos <= 3 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {comarca.num_advogados_ativos} advogados
                    </span>
                  </td>

                  {/* Processos */}
                  <td className="px-6 py-4 text-slate-300">
                    {comarca.total_processos_ano.toLocaleString('pt-BR')}
                  </td>

                  {/* Score de Oportunidade Bar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-extrabold text-sm ${comarca.score_oportunidade >= 85.0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {comarca.score_oportunidade}
                      </span>
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${comarca.score_oportunidade >= 85.0 ? 'bg-amber-500' : 'bg-cyan-400'}`}
                          style={{ width: `${comarca.score_oportunidade}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Ação */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/cidadao/novo-caso?comarca=${comarca.id}`}
                      className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold text-xs"
                    >
                      <span>Pedir Aqui</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
