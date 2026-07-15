import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinica.app — Sua clínica odontológica online",
  description:
    "Plataforma digital para clínicas odontológicas receberem agendamentos online, apresentarem serviços, enviarem orçamentos profissionais e oferecerem uma experiência moderna ao paciente.",
  keywords: [
    "clínica odontológica",
    "agendamento online",
    "dentista",
    "SaaS odontológico",
    "gestão de clínica",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground"
        >
          Pular para o conteúdo
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
