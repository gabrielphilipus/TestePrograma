'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scale, 
  User, 
  Briefcase, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  PlusCircle, 
  Sparkles, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { getCurrentUserProfile, setCurrentUserProfile, INITIAL_CITIZEN_PROFILE, INITIAL_LAWYER_PROFILE } from '@/lib/storage/mock-store';
import { Profile } from '@/types/database';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile>(INITIAL_CITIZEN_PROFILE);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setProfile(getCurrentUserProfile());
  }, [pathname]);

  const handleSwitchRole = (role: 'cidadao' | 'advogado') => {
    const newProfile = role === 'cidadao' ? INITIAL_CITIZEN_PROFILE : INITIAL_LAWYER_PROFILE;
    setCurrentUserProfile(newProfile);
    setProfile(newProfile);
    if (role === 'cidadao') {
      window.location.href = '/cidadao/meus-casos';
    } else {
      window.location.href = '/advogado/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-blue-900/30 bg-white/85 dark:bg-navy-900/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Marca */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:shadow-cyan-500/30 transition-all">
              <div className="w-full h-full bg-white dark:bg-navy-900 rounded-[10px] flex items-center justify-center transition-colors">
                <Scale className="w-5 h-5 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Match<span className="text-blue-600 dark:text-cyan-400">Jurídico</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Dativos
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Assistência Judiciária & IA</p>
            </div>
          </Link>

          {/* Links Principais Desktop */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              href="/cidadao/novo-caso" 
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/cidadao/novo-caso')
                  ? 'bg-blue-600/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30 dark:border-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Pedir Assistência</span>
            </Link>

            <Link 
              href="/cidadao/meus-casos" 
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/cidadao/meus-casos')
                  ? 'bg-blue-600/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30 dark:border-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4 text-blue-500" />
              <span>Painel Cidadão</span>
            </Link>

            <Link 
              href="/advogado/dashboard" 
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/advogado')
                  ? 'bg-blue-600/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30 dark:border-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>Cockpit Advogado</span>
            </Link>

            <Link 
              href="/radar-comarcas" 
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname.startsWith('/radar-comarcas')
                  ? 'bg-blue-600/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30 dark:border-cyan-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Radar Comarcas</span>
            </Link>
          </nav>

          {/* Seletor de Perfil Ativo, GOV.br Badge & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Simulador de Perfil Demo */}
            <div className="flex items-center bg-slate-100 dark:bg-navy-850 p-1 rounded-xl border border-slate-200 dark:border-blue-900/40 transition-colors">
              <button
                onClick={() => handleSwitchRole('cidadao')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  profile.role === 'cidadao'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Alternar visão para Cidadão"
              >
                <User className="w-3.5 h-3.5" />
                <span>Cidadão</span>
              </button>
              <button
                onClick={() => handleSwitchRole('advogado')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  profile.role === 'advogado'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title="Alternar visão para Advogado Dativo"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Advogado</span>
              </button>
            </div>

            {/* Gov.br Badge */}
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>gov.br {profile.govbr_nivel || 'OURO'}</span>
            </div>

            {/* Botão Alternador de Tema Claro/Escuro */}
            <ThemeToggle />

            {/* Link de Autenticação */}
            <Link
              href="/auth/login"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all"
            >
              Entrar / Trocar
            </Link>
          </div>

          {/* Botão Menu Mobile & Theme Toggle Mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Mobile Expandido */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-blue-900/40 bg-white/95 dark:bg-navy-900/95 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">Modo de Acesso:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleSwitchRole('cidadao')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${profile.role === 'cidadao' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Cidadão
              </button>
              <button
                onClick={() => handleSwitchRole('advogado')}
                className={`px-3 py-1 rounded-md text-xs font-medium ${profile.role === 'advogado' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                Advogado
              </button>
            </div>
          </div>
          <Link 
            href="/cidadao/novo-caso" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-sm text-blue-600 dark:text-cyan-300 font-medium"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pedir Assistência Judiciária</span>
          </Link>
          <Link 
            href="/cidadao/meus-casos" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-sm text-slate-700 dark:text-slate-200"
          >
            <User className="w-4 h-4 text-blue-500" />
            <span>Meus Processos (Cidadão)</span>
          </Link>
          <Link 
            href="/advogado/dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-sm text-slate-700 dark:text-slate-200"
          >
            <Briefcase className="w-4 h-4 text-emerald-500" />
            <span>Cockpit do Advogado Dativo</span>
          </Link>
          <Link 
            href="/radar-comarcas" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-sm text-slate-700 dark:text-slate-200"
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Radar de Comarcas & Desertos</span>
          </Link>
          <Link 
            href="/auth/login" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-sm text-slate-700 dark:text-slate-200 border-t border-slate-100 dark:border-slate-800 pt-3"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Entrar / Trocar de Conta</span>
          </Link>
        </div>
      )}
    </header>
  );
}
