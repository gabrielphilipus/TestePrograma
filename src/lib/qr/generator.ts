import QRCode from 'qrcode';

/**
 * Gera um Hash criptográfico simulado / SHA-256 representativo para o protocolo
 */
export function generateProtocolHash(protocolo: string, extraSeed?: string): string {
  const seed = `${protocolo}-${extraSeed || Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  // Transformar em string hexadecimal de 64 caracteres formatada
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs(hash * 31).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs(hash * 67).toString(16).padStart(8, '0');
  const hexPart4 = Math.abs(hash * 103).toString(16).padStart(8, '0');
  const hexPart5 = Math.abs(hash * 157).toString(16).padStart(8, '0');
  const hexPart6 = Math.abs(hash * 211).toString(16).padStart(8, '0');
  const hexPart7 = Math.abs(hash * 277).toString(16).padStart(8, '0');
  const hexPart8 = Math.abs(hash * 337).toString(16).padStart(8, '0');

  return `${hexPart1}${hexPart2}${hexPart3}${hexPart4}${hexPart5}${hexPart6}${hexPart7}${hexPart8}`.toLowerCase();
}

/**
 * Gera a imagem do QR Code em base64 DataURL apontando para a URL pública de verificação
 */
export async function generateQrCodeDataUrl(hash: string, baseUrl?: string): Promise<string> {
  const host = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  const verificationUrl = `${host}/verificar/${hash}`;

  try {
    const dataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 256,
      color: {
        dark: '#0A2540',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
    return '';
  }
}
