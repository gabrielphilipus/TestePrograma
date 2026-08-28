'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Scale, 
  QrCode, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  User, 
  Briefcase,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import { getRequerimentoById } from '@/lib/storage/mock-store';
import { generateQrCodeDataUrl } from '@/lib/qr/generator';
import { Requerimento } from '@/types/database';

export default function VerificarDocumentoPage() {
  const params = useParams();
  const hash = params.hash as string;

  const [requerimento, setRequerimento] = useState<Requerimento | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const req = getRequerimentoById(hash);
    if (req) {
      setRequerimento(req);
      generateQrCodeDataUrl(req.hash_autenticidade).then(setQrCodeUrl);
    }
  }, [hash]);

  const handleCopyHash = () => {
    if (!requerimento) return;
    navigator.clipboard.writeText(requerimento.hash_autenticidade);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!requerimento) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 flex items-center justify-center mx-auto text-red-600 dark:text-red-400 mb-4">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Documento Não Localizado</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto mb-6">
          O código hash informado não corresponde a nenhum protocolo registrado no sistema oficial do Match Jurídico.
        </p>
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md">
          Ir para Página Inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Botões de Ação Topo (Ocultos na impressão) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Página Inicial</span>
        </Link>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition-all shadow-sm"
        >
          <Printer className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Imprimir / Salvar PDF</span>
        </button>
      </div>

      {/* Certidão Oficial (Estilo Documento Jurídico) */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-blue-900/60 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:p-0">
        
        {/* Cabeçalho Oficial */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 print:bg-slate-100 print:text-black shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-300 dark:border-emerald-500/30 uppercase tracking-wider print:border-slate-400 print:text-slate-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Autenticidade e Rastreabilidade Certificadas</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white print:text-black mt-1">
                Certidão de Requerimento Dativo
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                Sistema Oficial de Assistência Judiciária • Match Jurídico
              </p>
            </div>
          </div>

          {/* QR Code Imagem */}
          {qrCodeUrl && (
            <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-200 shrink-0 flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={qrCodeUrl} 
                alt="QR Code de Verificação" 
                className="w-24 h-24"
              />
              <span className="text-[8px] font-mono text-slate-800 font-bold mt-1">CONSULTA PÚBLICA</span>
            </div>
          )}
        </div>

        {/* Grade de Metadados Oficiais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-600">Número do Protocolo</span>
            <p className="text-sm font-extrabold text-blue-600 dark:text-cyan-400 font-mono mt-0.5 print:text-black">
              {requerimento.protocolo}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-600">Comarca Competente</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 print:text-black">
              {requerimento.comarca?.nome} - {requerimento.comarca?.uf || 'PR'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-600">Especialidade / Ramo</span>
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 mt-0.5 print:text-black">
              {requerimento.especialidade?.nome}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-slate-50">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 print:text-slate-600">Data de Autuação</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 print:text-black">
              {new Date(requerimento.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Qualificação das Partes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-transparent">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-cyan-400 print:text-black uppercase mb-3">
              <User className="w-4 h-4" />
              <span>Parte Requerente (Cidadão)</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
              {requerimento.cidadao?.nome_completo || 'Maria Aparecida dos Santos'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1">
              CPF: {requerimento.cidadao?.cpf || '***.***.***-**'} • Autenticado via GOV.br
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200 dark:border-slate-800 print:border-slate-300 print:bg-transparent">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 print:text-black uppercase mb-3">
              <Briefcase className="w-4 h-4" />
              <span>Advogado(a) Dativo(a) Designado(a)</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black">
              {requerimento.advogado?.profile?.nome_completo || 'Dra. Camila Vasconcelos de Oliveira'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1">
              Inscrição: OAB/PR {requerimento.advogado?.numero_oab || '94.812'} • Status: Aceito Formalmente
            </p>
          </div>

        </div>

        {/* Teor do Documento Estruturado */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black mb-3">
            Teor Integral do Requerimento Inicial Formalizado pela IA:
          </h3>
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-950 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap border border-slate-200 dark:border-slate-800 print:bg-white print:text-black print:border-slate-300 shadow-inner">
            {requerimento.requerimento_estruturado_md || requerimento.descricao_relato}
          </div>
        </div>

        {/* Nota de Conformidade com o Estatuto da OAB */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed print:text-slate-700 print:border-slate-300">
          <strong className="text-slate-800 dark:text-slate-200 print:text-black block mb-0.5">Nota Ética e Jurídica:</strong>
          A presente certidão atesta a autenticidade do protocolo inicial originado no sistema de triagem. Conforme os ditames da Lei Federal nº 8.906/94, os atos postulatórios e a condução judicial subsequente são de responsabilidade do profissional da advocacia regularmente habilitado.
        </div>

        {/* Assinatura Digital & Hash SHA-256 */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 print:text-slate-600 uppercase">
                Assinatura Digital Criptográfica (SHA-256 Hash):
              </span>
              <p className="font-mono text-[11px] text-blue-600 dark:text-cyan-300 print:text-black break-all select-all font-semibold">
                {requerimento.hash_autenticidade}
              </p>
            </div>

            <button
              onClick={handleCopyHash}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 text-xs flex items-center space-x-1.5 self-start border border-slate-200 dark:border-slate-700 print:hidden"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Hash'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
