import type { Metadata } from "next";
import ContentGenerator from "@/components/features/ContentGenerator";

export const metadata: Metadata = {
  title: "Gerar Conteúdo",
  description: "Gere conteúdo para redes sociais usando IA",
};

export default function GeneratePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Gerador de Conteúdo</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Crie posts incríveis para redes sociais usando inteligência artificial
          </p>
        </div>

        {/* Content Generator Component */}
        <ContentGenerator />
      </div>
    </main>
  );
}
