import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { VLibrasWidget } from "@/components/vlibras";

export const metadata: Metadata = {
  title: "Match Jurídico | Conexão Inteligente para Assistência Judiciária Dativa",
  description: "Plataforma de alocação de advogados dativos por proximidade, inteligência artificial jurídica, geração de requerimentos e combate a desertos judiciais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060e1a] text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <VLibrasWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
