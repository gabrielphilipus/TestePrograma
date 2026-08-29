'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

export function VLibrasWidget() {
  const initVLibras = () => {
    if (typeof window !== 'undefined' && window.VLibras) {
      try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      } catch (err) {
        console.warn('VLibras initialization notice:', err);
      }
    }
  };

  useEffect(() => {
    initVLibras();
  }, []);

  const vwProps = { vw: 'true' } as unknown as React.HTMLAttributes<HTMLDivElement>;
  const vwAccessButtonProps = { 'vw-access-button': 'true' } as unknown as React.HTMLAttributes<HTMLDivElement>;
  const vwPluginWrapperProps = { 'vw-plugin-wrapper': 'true' } as unknown as React.HTMLAttributes<HTMLDivElement>;

  return (
    <>
      <div {...vwProps} className="enabled">
        <div 
          {...vwAccessButtonProps} 
          className="active"
          aria-label="Acessibilidade em Libras (Língua Brasileira de Sinais)"
        />
        <div {...vwPluginWrapperProps}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="lazyOnload"
        onLoad={initVLibras}
      />
    </>
  );
}
