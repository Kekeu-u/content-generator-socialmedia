import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Bem-vindo ao Content Generator - sua plataforma de geração de conteúdo para redes sociais",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-sans text-sm">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Content Generator
          </h1>
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 md:text-xl">
            Plataforma moderna e escalável para geração de conteúdo para redes sociais.
            Construída com Next.js 15, TypeScript e Tailwind CSS.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/generate"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Gerar Conteúdo IA
            </Link>
            <Link
              href="/products"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Ver Produtos
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Dashboard
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Server Components"
              description="Renderização otimizada no servidor para melhor performance e SEO"
            />
            <FeatureCard
              title="TypeScript Strict"
              description="Type safety completo com noImplicitAny habilitado"
            />
            <FeatureCard
              title="Tailwind CSS"
              description="Estilização moderna e responsiva com classes utilitárias"
            />
            <FeatureCard
              title="App Router"
              description="Arquitetura moderna com Next.js 15 App Router"
            />
            <FeatureCard
              title="SEO Otimizado"
              description="Metadados configurados para máxima visibilidade"
            />
            <FeatureCard
              title="Performance"
              description="React Suspense e loading states para UX superior"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-6 transition-colors hover:border-blue-500 dark:border-gray-800 dark:hover:border-blue-500">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
