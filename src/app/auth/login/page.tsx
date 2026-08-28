'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Scale, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { setCurrentUserProfile, INITIAL_CITIZEN_PROFILE, INITIAL_LAWYER_PROFILE } from '@/lib/storage/mock-store';
import { UserRole } from '@/types/database';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('cidadao');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [oab, setOab] = useState('');
  const [isSimulatingGovBr, setIsSimulatingGovBr] = useState(false);

  const handleGovBrLogin = () => {
    setIsSimulatingGovBr(true);
    setTimeout(() => {
      if (role === 'cidadao') {
        setCurrentUserProfile({
          ...INITIAL_CITIZEN_PROFILE,
          govbr_verified: true,
          govbr_nivel: 'OURO',
        });
        router.push('/cidadao/meus-casos');
      } else {
        setCurrentUserProfile({
          ...INITIAL_LAWYER_PROFILE,
          govbr_verified: true,
          govbr_nivel: 'OURO',
        });
        router.push('/advogado/dashboard');
      }
    }, 1200);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'cidadao') {
      setCurrentUserProfile({
        id: `prof-cid-${Date.now()}`,
        role: 'cidadao',
        nome_completo: nome || 'Cidadão Usuário',
        cpf: cpf || '123.456.789-00',
        email: email || 'cidadao@exemplo.com',
        govbr_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      router.push('/cidadao/meus-casos');
    } else {
      setCurrentUserProfile({
        id: `prof-adv-${Date.now()}`,
        role: 'advogado',
        nome_completo: nome || 'Dr(a). Advogado(a) Dativo(a)',
        cpf: cpf || '987.654.321-99',
        email: email || 'advogado@oabpr.org.br',
        govbr_verified: true,
        govbr_nivel: 'PRATA',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      router.push('/advogado/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Card Principal */}
        <div className="glass-panel rounded-3xl p-8 border border-blue-500/20 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 mx-auto mb-3 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center">
                <Scale className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Acesse o Match Jurídico</h1>
            <p className="text-xs text-slate-400 mt-1">
              Assistência judiciária simplificada com IA e alocação por proximidade
            </p>
          </div>

          {/* Seletor de Perfil (Cidadão vs Advogado) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Escolha seu tipo de perfil:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-navy-900 border border-blue-900/50">
              <button
                type="button"
                onClick={() => setRole('cidadao')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'cidadao'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sou Cidadão</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('advogado')}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  role === 'advogado'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Sou Advogado</span>
              </button>
            </div>
          </div>

          {/* Botão GOV.BR Oficial / Simulado */}
          <div className="mb-6">
            <button
              onClick={handleGovBrLogin}
              disabled={isSimulatingGovBr}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1351B4] hover:bg-[#0c3c88] text-white font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-75"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
              <span>
                {isSimulatingGovBr ? 'Autenticando no GOV.br...' : 'Entrar com GOV.br (Recomendado)'}
              </span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              Identificação rápida via conta Ouro/Prata do Cidadão ou Certificado OAB
            </p>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative bg-navy-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              ou acesso direto com e-mail
            </span>
          </div>

          {/* Formulário Manual */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={role === 'cidadao' ? 'Ex: Maria Aparecida dos Santos' : 'Ex: Dra. Camila Vasconcelos'}
                required
                className="w-full bg-navy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full bg-navy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {role === 'advogado' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Número de Inscrição na OAB</label>
                <div className="flex space-x-2">
                  <span className="px-3 py-2.5 bg-navy-800 border border-slate-800 rounded-xl text-xs text-slate-400 font-bold">
                    OAB/PR
                  </span>
                  <input
                    type="text"
                    value={oab}
                    onChange={(e) => setOab(e.target.value)}
                    placeholder="Ex: 94.812"
                    required
                    className="flex-1 bg-navy-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all mt-2"
            >
              Continuar como {role === 'cidadao' ? 'Cidadão' : 'Advogado Dativo'} →
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
