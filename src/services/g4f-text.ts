/**
 * Serviço de geração de texto usando GPT4Free (g4f.dev)
 * API gratuita com suporte a GPT-4, Gemini, Claude e mais
 */

export interface TextGenerationResponse {
  text: string;
  tokensUsed?: number;
  modelUsed: string;
  generationTimeMs: number;
}

/**
 * Gerar texto usando GPT4Free
 */
async function generateWithG4F(prompt: string, model: string = "gpt-4o"): Promise<TextGenerationResponse> {
  const startTime = Date.now();

  const response = await fetch("https://g4f.dev/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
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
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GPT4Free API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generationTimeMs = Date.now() - startTime;

  return {
    text: data.choices[0].message.content,
    tokensUsed: data.usage?.total_tokens,
    modelUsed: model,
    generationTimeMs,
  };
}

/**
 * Gerar texto usando Perplexity (fallback)
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
 * Gerar texto - tenta GPT4Free primeiro (grátis!), depois fallbacks
 */
export async function generateText(
  prompt: string,
  preferredModel?: string
): Promise<TextGenerationResponse> {
  // Tentar GPT4Free primeiro (GRÁTIS!)
  try {
    const model = preferredModel || process.env.G4F_TEXT_MODEL || "gpt-4o";
    return await generateWithG4F(prompt, model);
  } catch (error) {
    console.error("GPT4Free failed, trying Perplexity fallback:", error);
  }

  // Fallback para Perplexity
  if (process.env.PERPLEXITY_API_KEY) {
    try {
      return await generateWithPerplexity(prompt);
    } catch (error) {
      console.error("Perplexity failed, trying Gemini fallback:", error);
    }
  }

  // Fallback final para Gemini
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
