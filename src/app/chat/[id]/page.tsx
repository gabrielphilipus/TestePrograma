'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Scale, 
  User, 
  Briefcase, 
  QrCode, 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Phone, 
  Video, 
  CheckCheck
} from 'lucide-react';
import { 
  getRequerimentoById, 
  getStoredMensagens, 
  sendMensagem, 
  getCurrentUserProfile 
} from '@/lib/storage/mock-store';
import { Requerimento, Mensagem, Profile } from '@/types/database';

export default function ChatCasoPage() {
  const params = useParams();
  const reqId = params.id as string;

  const [requerimento, setRequerimento] = useState<Requerimento | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState('');
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getCurrentUserProfile();
    setCurrentUser(user);

    const req = getRequerimentoById(reqId);
    if (req) {
      setRequerimento(req);
      const msgs = getStoredMensagens(req.id);
      setMensagens(msgs);
    }
  }, [reqId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() || !requerimento || !currentUser) return;

    const novaMensagem = sendMensagem({
      requerimento_id: requerimento.id,
      sender_id: currentUser.id,
      sender: currentUser,
      conteudo: texto.trim(),
    });

    setMensagens((prev) => [...prev, novaMensagem]);
    setTexto('');

    // Resposta automática simulada caso o outro lado responda
    if (currentUser.role === 'cidadao') {
      setTimeout(() => {
        const respostaAdv = sendMensagem({
          requerimento_id: requerimento.id,
          sender_id: requerimento.advogado?.profile_id || 'adv-01',
          conteudo: 'Olá! Recebi seu relato e a minuta inicial. Já estou analisando os documentos e vou protocolar a petição na Vara competente.',
        });
        setMensagens((prev) => [...prev, respostaAdv]);
      }, 1500);
    }
  };

  if (!requerimento) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Scale className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Caso não encontrado</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
          Não foi possível carregar os dados deste atendimento.
        </p>
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  const isAdvogado = currentUser?.role === 'advogado';
  const interlocutorNome = isAdvogado 
    ? (requerimento.cidadao?.nome_completo || 'Maria Aparecida dos Santos')
    : (requerimento.advogado?.profile?.nome_completo || 'Dra. Camila Vasconcelos');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Botão de Retorno */}
      <div className="mb-4">
        <Link 
          href={isAdvogado ? '/advogado/dashboard' : '/cidadao/meus-casos'}
          className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Painel</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[78vh]">
        
        {/* Painel Central do Chat (2 Colunas) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl border border-slate-200 dark:border-blue-900/40 flex flex-col overflow-hidden shadow-2xl">
          
          {/* Header do Chat */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-navy-900/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-sm">
                <div className="w-full h-full bg-white dark:bg-navy-900 rounded-full flex items-center justify-center text-blue-600 dark:text-cyan-300 font-bold text-xs">
                  {interlocutorNome.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{interlocutorNome}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAdvogado ? 'Assistido(a) Hipossuficiente' : `Defensor(a) Dativo(a) • OAB ${requerimento.advogado?.numero_oab || 'PR'}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] border border-emerald-200 dark:border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Canal Criptografado</span>
              </span>
            </div>
          </div>

          {/* Área de Mensagens (Scrollable) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/60 dark:bg-navy-950/40">
            {mensagens.map((msg) => {
              const isMine = currentUser && msg.sender_id === currentUser.id;
              const isSystem = msg.sender_id === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-4">
                    <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/40 text-[11px] text-blue-800 dark:text-cyan-300 shadow-sm">
                      {msg.conteudo}
                    </span>
                  </div>
                );
              }

              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md ${
                      isMine 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-none' 
                        : 'bg-white dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.conteudo}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 flex items-center space-x-1">
                    <span>{new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMine && <CheckCheck className="w-3 h-3 text-blue-600 dark:text-cyan-400" />}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Envio de Mensagem */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#071321]/95 flex items-center space-x-2">
            <button
              type="button"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0c2444] dark:hover:bg-[#133560] text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-blue-900/50 transition-colors"
              title="Anexar Comprovante ou Documento"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Digite sua mensagem para o atendimento..."
              className="flex-1 bg-slate-50 dark:bg-[#09182d] text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-300 dark:border-blue-800/60 focus:border-blue-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-[#061224] focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-400 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all shadow-sm"
            />

            <button
              type="submit"
              disabled={!texto.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md disabled:opacity-40 transition-all flex items-center justify-center"
              title="Enviar Mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Sidebar Direita: Dados Oficiais do Caso (1 Coluna) */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-blue-900/40 flex flex-col justify-between shadow-xl overflow-y-auto">
          <div className="space-y-4">
            
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">Protocolo Vinculado</span>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">{requerimento.protocolo}</h4>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Comarca:</span>
                <span className="font-bold text-slate-900 dark:text-white">{requerimento.comarca?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Especialidade:</span>
                <span className="font-bold text-indigo-700 dark:text-indigo-300">{requerimento.especialidade?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Em Atendimento</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Assunto / Título:</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {requerimento.titulo_caso}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Relato do Cidadão:</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-4 bg-slate-50 dark:bg-navy-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80">
                {requerimento.descricao_relato}
              </p>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              href={`/verificar/${requerimento.hash_autenticidade}`}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Ver Certidão & QR Code</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
