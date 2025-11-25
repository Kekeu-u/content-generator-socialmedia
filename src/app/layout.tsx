import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configuração de fontes otimizadas para evitar CLS
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Metadados globais otimizados para SEO
export const metadata: Metadata = {
  title: {
    template: "%s | Content Generator",
    default: "Content Generator - Aplicação Web Escalável",
  },
  description:
    "Plataforma moderna e escalável para geração de conteúdo para redes sociais, construída com Next.js 15, TypeScript e Tailwind CSS",
  keywords: [
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "React",
    "Content Generator",
    "Social Media",
  ],
  authors: [{ name: "Content Generator Team" }],
  creator: "Content Generator",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Content Generator",
    title: "Content Generator - Aplicação Web Escalável",
    description:
      "Plataforma moderna e escalável para geração de conteúdo para redes sociais",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
