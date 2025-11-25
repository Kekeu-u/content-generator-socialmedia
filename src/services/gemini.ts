import { GoogleGenerativeAI } from "@google/generative-ai";

// Validar API key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing GEMINI_API_KEY environment variable. Please check your .env.local file."
  );
}

// Inicializar cliente Gemini
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Interface para resposta de geração de texto
 */
export interface TextGenerationResponse {
  text: string;
  tokensUsed?: number;
  modelUsed: string;
  generationTimeMs: number;
}

/**
 * Interface para resposta de geração de imagem
 */
export interface ImageGenerationResponse {
  imageUrl: string;
  base64Image?: string;
  modelUsed: string;
  generationTimeMs: number;
}

/**
 * Interface para configurações de geração
 */
export interface GenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

/**
 * Gerar texto usando Gemini 2.5 Flash
 *
 * @param prompt - Prompt para geração de texto
 * @param config - Configurações opcionais de geração
 * @returns Resposta com texto gerado
 *
 * @example
 * const response = await generateText("Crie um post sobre tecnologia");
 * console.log(response.text);
 */
export async function generateText(
  prompt: string,
  config?: GenerationConfig
): Promise<TextGenerationResponse> {
  const startTime = Date.now();

  try {
    const modelName = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: config,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Calcular tokens usados (aproximado)
    const tokensUsed = Math.ceil(text.length / 4); // Aproximação

    return {
      text,
      tokensUsed,
      modelUsed: modelName,
      generationTimeMs: Date.now() - startTime,
    };
  } catch (error) {
    console.error("Gemini text generation error:", error);
    throw new Error(`Failed to generate text: ${error}`);
  }
}

/**
 * Gerar texto com streaming (para respostas em tempo real)
 *
 * @param prompt - Prompt para geração
 * @param onChunk - Callback chamado para cada chunk de texto
 * @param config - Configurações opcionais
 */
export async function generateTextStream(
  prompt: string,
  onChunk: (chunk: string) => void,
  config?: GenerationConfig
): Promise<void> {
  try {
    const modelName = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: config,
    });

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
  } catch (error) {
    console.error("Gemini streaming error:", error);
    throw new Error(`Failed to generate streaming text: ${error}`);
  }
}

/**
 * Gerar conteúdo para redes sociais com contexto específico
 *
 * @param params - Parâmetros para geração
 * @returns Post gerado com hashtags
 */
export async function generateSocialMediaPost(params: {
  topic: string;
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok";
  tone?: "professional" | "casual" | "funny" | "inspirational";
  targetAudience?: string;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
}): Promise<{ content: string; hashtags: string[] }> {
  const {
    topic,
    platform,
    tone = "professional",
    targetAudience = "público geral",
    includeHashtags = true,
    includeEmojis = true,
  } = params;

  // Configurações específicas por plataforma
  const platformLimits = {
    instagram: 2200,
    facebook: 63206,
    twitter: 280,
    linkedin: 3000,
    tiktok: 150,
  };

  const maxChars = platformLimits[platform];

  // Construir prompt otimizado
  const prompt = `Crie um post envolvente para ${platform} sobre: ${topic}

Especificações:
- Tom: ${tone}
- Público-alvo: ${targetAudience}
- Limite de caracteres: ${maxChars}
- ${includeEmojis ? "Incluir" : "Não incluir"} emojis relevantes
- ${includeHashtags ? "Incluir" : "Não incluir"} hashtags estratégicas

Formato de resposta:
POST:
[conteúdo do post aqui]

${includeHashtags ? "HASHTAGS:\n#hashtag1 #hashtag2 #hashtag3" : ""}

Crie um conteúdo autêntico, relevante e otimizado para engajamento.`;

  const response = await generateText(prompt, {
    temperature: 0.9,
    maxOutputTokens: 1024,
  });

  // Extrair conteúdo e hashtags
  const text = response.text;
  const postMatch = text.match(/POST:\s*([\s\S]*?)(?=HASHTAGS:|$)/i);
  const hashtagsMatch = text.match(/HASHTAGS:\s*(#[\w\s]+)/i);

  const content = postMatch ? postMatch[1].trim() : text;
  const hashtags = hashtagsMatch
    ? hashtagsMatch[1]
        .split(/\s+/)
        .filter((h) => h.startsWith("#"))
    : [];

  return { content, hashtags };
}

/**
 * Gerar imagem usando Gemini 2.5 Flash (com Imagen)
 *
 * Nota: Gemini 2.5 Flash atualmente não suporta geração de imagens diretamente.
 * Esta função é um placeholder para quando o suporte for adicionado.
 * Alternativamente, você pode integrar com Imagen API ou DALL-E.
 *
 * @param prompt - Descrição da imagem a ser gerada
 * @returns URL ou base64 da imagem gerada
 */
export async function generateImage(
  prompt: string
): Promise<ImageGenerationResponse> {
  const startTime = Date.now();

  try {
    // IMPORTANTE: Gemini 2.5 Flash atualmente não tem capacidade de geração de imagens nativa
    // Você precisará integrar com:
    // 1. Google Imagen API (https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
    // 2. DALL-E API da OpenAI
    // 3. Stable Diffusion
    // 4. Midjourney API

    // Placeholder - substituir com implementação real
    throw new Error(
      "Image generation not yet implemented. Please integrate with Imagen, DALL-E, or Stable Diffusion API."
    );

    // Exemplo de estrutura de resposta quando implementado:
    // return {
    //   imageUrl: "https://storage.googleapis.com/...",
    //   base64Image: "data:image/png;base64,...",
    //   modelUsed: "imagen-2",
    //   generationTimeMs: Date.now() - startTime,
    // };
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}

/**
 * Analisar imagem com visão do Gemini
 *
 * @param imageData - Base64 ou URL da imagem
 * @param prompt - Pergunta ou instrução sobre a imagem
 * @returns Análise da imagem
 */
export async function analyzeImage(
  imageData: string,
  prompt: string = "Descreva esta imagem em detalhes"
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Preparar a imagem
    const imagePart = {
      inlineData: {
        data: imageData.replace(/^data:image\/\w+;base64,/, ""),
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error(`Failed to analyze image: ${error}`);
  }
}

/**
 * Gerar múltiplas variações de texto
 *
 * @param prompt - Prompt base
 * @param count - Número de variações (1-5)
 * @returns Array de variações geradas
 */
export async function generateVariations(
  prompt: string,
  count: number = 3
): Promise<string[]> {
  const variations: string[] = [];

  for (let i = 0; i < Math.min(count, 5); i++) {
    const response = await generateText(prompt, {
      temperature: 0.9 + i * 0.1, // Aumentar temperatura para variabilidade
    });
    variations.push(response.text);
  }

  return variations;
}

/**
 * Melhorar/reescrever texto existente
 *
 * @param text - Texto original
 * @param instructions - Instruções de como melhorar
 * @returns Texto melhorado
 */
export async function improveText(
  text: string,
  instructions: string = "Melhore este texto mantendo o sentido original"
): Promise<string> {
  const prompt = `${instructions}

Texto original:
"""
${text}
"""

Texto melhorado:`;

  const response = await generateText(prompt, {
    temperature: 0.7,
  });

  return response.text;
}

export default {
  generateText,
  generateTextStream,
  generateSocialMediaPost,
  generateImage,
  analyzeImage,
  generateVariations,
  improveText,
};
