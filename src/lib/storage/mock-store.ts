import { Requerimento, Mensagem, Profile, AdvogadoDativo } from '@/types/database';
import { MOCK_REQUERIMENTOS, MOCK_ADVOGADOS } from '@/lib/data/mock-seed-data';

const STORAGE_KEYS = {
  REQUERIMENTOS: 'match_juridico_requerimentos',
  MENSAGENS: 'match_juridico_mensagens',
  CURRENT_USER: 'match_juridico_current_user',
};

export const INITIAL_CITIZEN_PROFILE: Profile = {
  id: 'prof-cid-demo',
  role: 'cidadao',
  nome_completo: 'Juliana Mendes de Castro',
  cpf: '458.912.879-04',
  telefone: '(42) 99876-1234',
  email: 'juliana.castro@gmail.com',
  govbr_verified: true,
  govbr_nivel: 'OURO',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_LAWYER_PROFILE: Profile = {
  id: 'prof-adv-01',
  role: 'advogado',
  nome_completo: 'Dra. Camila Vasconcelos de Oliveira',
  cpf: '312.492.109-88',
  telefone: '(42) 99124-8833',
  email: 'camila.vasconcelos.adv@oabpr.org.br',
  govbr_verified: true,
  govbr_nivel: 'OURO',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function getStoredRequerimentos(): Requerimento[] {
  if (typeof window === 'undefined') return MOCK_REQUERIMENTOS;
  const stored = localStorage.getItem(STORAGE_KEYS.REQUERIMENTOS);
  if (!stored) {
    return MOCK_REQUERIMENTOS;
  }
  try {
    const list = JSON.parse(stored);
    // Garantir que a certidão de exemplo público esteja sempre disponível na lista
    if (Array.isArray(list)) {
      const hasExemplo = list.some(r => r.hash_autenticidade === MOCK_REQUERIMENTOS[0]?.hash_autenticidade);
      if (!hasExemplo && MOCK_REQUERIMENTOS.length > 0) {
        return [...list, ...MOCK_REQUERIMENTOS];
      }
      return list;
    }
    return MOCK_REQUERIMENTOS;
  } catch {
    return MOCK_REQUERIMENTOS;
  }
}

export function clearAllRequerimentos(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.REQUERIMENTOS);
  // Limpar todas as mensagens
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_KEYS.MENSAGENS)) {
      localStorage.removeItem(key);
    }
  });
}

export function saveRequerimento(req: Requerimento): void {
  if (typeof window === 'undefined') return;
  const list = getStoredRequerimentos();
  const index = list.findIndex(r => r.id === req.id);
  if (index >= 0) {
    list[index] = req;
  } else {
    list.unshift(req);
  }
  localStorage.setItem(STORAGE_KEYS.REQUERIMENTOS, JSON.stringify(list));
}

export function getRequerimentoById(id: string): Requerimento | undefined {
  const list = getStoredRequerimentos();
  const found = list.find(r => r.id === id || r.protocolo === id || r.hash_autenticidade === id);
  if (found) return found;
  return MOCK_REQUERIMENTOS.find(r => r.id === id || r.protocolo === id || r.hash_autenticidade === id);
}

export function getStoredMensagens(requerimentoId: string): Mensagem[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`${STORAGE_KEYS.MENSAGENS}_${requerimentoId}`);
  if (!stored) {
    const defaultMessages: Mensagem[] = [
      {
        id: `msg-welcome-${requerimentoId}`,
        requerimento_id: requerimentoId,
        sender_id: 'system',
        conteudo: 'Atendimento iniciado via Match Jurídico. O requerimento foi aceito e o canal seguro de comunicação está ativo.',
        lida: true,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
    localStorage.setItem(`${STORAGE_KEYS.MENSAGENS}_${requerimentoId}`, JSON.stringify(defaultMessages));
    return defaultMessages;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function sendMensagem(msg: Omit<Mensagem, 'id' | 'created_at' | 'lida'>): Mensagem {
  const newMsg: Mensagem = {
    ...msg,
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    lida: false,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const list = getStoredMensagens(msg.requerimento_id);
    list.push(newMsg);
    localStorage.setItem(`${STORAGE_KEYS.MENSAGENS}_${msg.requerimento_id}`, JSON.stringify(list));
  }

  return newMsg;
}

export function getCurrentUserProfile(): Profile {
  if (typeof window === 'undefined') return INITIAL_CITIZEN_PROFILE;
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_CITIZEN_PROFILE));
    return INITIAL_CITIZEN_PROFILE;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_CITIZEN_PROFILE;
  }
}

export function setCurrentUserProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
}
