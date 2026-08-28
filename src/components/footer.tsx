import React from 'react';
import Link from 'next/link';
import { Scale, Shield, Sparkles, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-blue-900/30 bg-navy-900/90 text-slate-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Coluna 1: Marca & Missão */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Scale className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="font-bold text-base text-white">Match Jurídico</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            Democratizando o acesso à justiça através de inteligência artificial generativa e alocação geográfica otimizada de advogados dativos para combater desertos jurídicos.
          </p>
          <div className="flex items-center space-x-4 pt-2 text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conformidade LGPD</span>
            </span>
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>IA Jurídica Validada</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Matching Geodésico</span>
            </span>
          </div>
        </div>

        {/* Coluna 2: Acesso Rápido */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Acesso Rápido</h4>
          <ul className="space-y-1.5">
            <li>
              <Link href="/cidadao/novo-caso" className="hover:text-cyan-300 transition-colors">
                Solicitar Defensor Dativo
              </Link>
            </li>
            <li>
              <Link href="/cidadao/meus-casos" className="hover:text-cyan-300 transition-colors">
                Acompanhar Requerimento
              </Link>
            </li>
            <li>
              <Link href="/advogado/dashboard" className="hover:text-cyan-300 transition-colors">
                Cockpit do Advogado Dativo
              </Link>
            </li>
            <li>
              <Link href="/radar-comarcas" className="hover:text-cyan-300 transition-colors">
                Radar de Desertos Jurídicos
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3: Validação & Autenticidade */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Verificação Oficial</h4>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Qualquer cidadão ou autoridade judiciária pode verificar a autenticidade de um requerimento emitido escaneando o QR Code ou consultando pelo hash único.
          </p>
          <Link
            href="/verificar/e7a3b98c4f1d02e88a912e5c66d741f0a9b2c3d4e5f60718293a4b5c6d7e8f90"
            className="inline-block text-[11px] font-medium text-cyan-400 hover:text-cyan-300 underline"
          >
            Exemplo de Certidão Pública →
          </Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
        <p>© 2026 Match Jurídico • Projeto Desenvolvido para o Hackathon</p>
        <p className="mt-2 sm:mt-0 flex items-center space-x-1">
          <span>Inovação no Acesso à Justiça</span>
        </p>
      </div>
    </footer>
  );
}
