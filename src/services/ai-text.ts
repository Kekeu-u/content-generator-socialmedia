/**
 * Serviço de geração de texto usando Perplexity AI e Gemini como fallback
 */

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
 * Gerar texto usando Perplexity AI
 */
async function generateWithPerplexity(prompt: string): Promise<TextGenerationResponse> {
  const startTime = Date.now();
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY not configured");
  }

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em criar conteúdo para redes sociais.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generationTimeMs = Date.now() - startTime;

  return {
    text: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens,
    modelUsed: "llama-3.1-sonar-small-128k-online",
    generationTimeMs,
  };
}

/**
 * Gerar texto usando Gemini (fallback)
 */
async function generateWithGemini(prompt: string): Promise<TextGenerationResponse> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_TEXT_MODEL || "gemini-2.0-flash-exp",
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const generationTimeMs = Date.now() - startTime;

  return {
    text,
    tokensUsed: response.usageMetadata?.totalTokenCount,
    modelUsed: process.env.GEMINI_TEXT_MODEL || "gemini-2.0-flash-exp",
    generationTimeMs,
  };
}

/**
 * Gerar texto - tenta Perplexity primeiro, depois Gemini como fallback
 */
export async function generateText(
  prompt: string
): Promise<TextGenerationResponse> {
  // Tentar Perplexity primeiro
  if (process.env.PERPLEXITY_API_KEY) {
    try {
      return await generateWithPerplexity(prompt);
    } catch (error) {
      console.error("Perplexity API failed, trying Gemini fallback:", error);
    }
  }

  // Fallback para Gemini
  return await generateWithGemini(prompt);
}

/**
 * Gerar post para redes sociais
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
    tone = "casual",
    targetAudience,
    includeHashtags = true,
    includeEmojis = true,
  } = params;

  // Construir prompt
  let prompt = `Crie um post para ${platform} sobre: ${topic}\n\n`;
  prompt += `Tom: ${tone}\n`;
  if (targetAudience) prompt += `Público-alvo: ${targetAudience}\n`;
  if (includeEmojis) prompt += `Use emojis apropriados.\n`;
  if (includeHashtags) prompt += `Inclua hashtags relevantes.\n`;
  prompt += `\nRetorne apenas o conteúdo do post.`;

  const result = await generateText(prompt);

  // Extrair hashtags do texto
  const hashtagRegex = /#[\w]+/g;
  const hashtags = result.text.match(hashtagRegex) || [];

  return {
    content: result.text,
    hashtags: hashtags.map((tag) => tag.substring(1)), // Remove o #
  };
}

/**
 * Gerar variações de texto
 */
export async function generateVariations(
  text: string,
  count: number = 3
): Promise<string[]> {
  const prompt = `Crie ${count} variações diferentes do seguinte texto, mantendo a mesma ideia mas com palavras diferentes:\n\n${text}\n\nRetorne apenas as ${count} variações, uma por linha.`;

  const result = await generateText(prompt);
  return result.text.split("\n").filter((line) => line.trim().length > 0);
}

/**
 * Melhorar texto existente
 */
export async function improveText(
  text: string,
  instructions?: string
): Promise<string> {
  const prompt = instructions
    ? `${instructions}\n\nTexto original:\n${text}`
    : `Melhore o seguinte texto, tornando-o mais claro, envolvente e profissional:\n\n${text}`;

  const result = await generateText(prompt);
  return result.text;
}
