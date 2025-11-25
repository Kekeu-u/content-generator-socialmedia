"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from "@/components/ui";

type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
type Tone = "professional" | "casual" | "funny" | "inspirational";

export default function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("professional");
  const [targetAudience, setTargetAudience] = useState("");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    content?: string;
    hashtags?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Por favor, insira um tópico para gerar conteúdo");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const response = await fetch("/api/generate/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: topic,
          type: "social-media",
          platform,
          tone,
          targetAudience: targetAudience || "público geral",
          includeHashtags,
          includeEmojis,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar conteúdo");
      }

      const data = await response.json();
      setGeneratedContent(data.data);
    } catch (err) {
      console.error("Generation error:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao gerar conteúdo"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado para a área de transferência!");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Formulário de Geração */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Geração</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tópico */}
          <Input
            label="Tópico ou Assunto"
            placeholder="Ex: Lançamento de novo produto, dicas de produtividade..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          {/* Plataforma */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Plataforma
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter / X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          {/* Tom */}
          <div>
            <label className="mb-2 block text-sm font-medium">Tom</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="professional">Profissional</option>
              <option value="casual">Casual</option>
              <option value="funny">Engraçado</option>
              <option value="inspirational">Inspiracional</option>
            </select>
          </div>

          {/* Público-alvo */}
          <Input
            label="Público-alvo (opcional)"
            placeholder="Ex: jovens adultos, profissionais de TI..."
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />

          {/* Opções */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeHashtags}
                onChange={(e) => setIncludeHashtags(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">Incluir hashtags</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">Incluir emojis</span>
            </label>
          </div>

          {/* Botão Gerar */}
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={isGenerating || !topic.trim()}
            className="w-full"
          >
            {isGenerating ? "Gerando..." : "Gerar Conteúdo"}
          </Button>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultado */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Gerado</CardTitle>
        </CardHeader>
        <CardContent>
          {!generatedContent && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                className="mb-4 h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">
                Configure as opções e clique em &quot;Gerar Conteúdo&quot; para começar
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Gerando conteúdo com IA...
              </p>
            </div>
          )}

          {generatedContent && (
            <div className="space-y-4">
              {/* Conteúdo */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">Post</label>
                  <button
                    onClick={() =>
                      copyToClipboard(generatedContent.content || "")
                    }
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Copiar
                  </button>
                </div>
                <div className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                  {generatedContent.content}
                </div>
              </div>

              {/* Hashtags */}
              {generatedContent.hashtags &&
                generatedContent.hashtags.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">Hashtags</label>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            generatedContent.hashtags?.join(" ") || ""
                          )
                        }
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Copiar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Ações */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleGenerate}>
                  Gerar Novamente
                </Button>
                <Button variant="secondary">Salvar Post</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
