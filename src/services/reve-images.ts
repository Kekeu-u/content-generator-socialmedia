/**
 * Serviço de geração de imagens usando REVE AI
 * Documentação: https://api.reve.com/console/9c0d0d23-11ec-45ef-bd8e-212dc0dfd171/docs
 */

export interface ImageGenerationResponse {
  imageUrl?: string;
  imageBase64?: string;
  modelUsed: string;
  generationTimeMs: number;
  creditsUsed?: number;
  creditsRemaining?: number;
  contentViolation?: boolean;
}

export interface ImageGenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  quality?: "standard" | "hd";
}

/**
 * Gerar imagem usando REVE AI
 */
export async function generateImage(
  params: ImageGenerationParams
): Promise<ImageGenerationResponse> {
  const startTime = Date.now();
  const apiKey = process.env.REVE_API_KEY;

  if (!apiKey) {
    throw new Error("REVE_API_KEY not configured");
  }

  const { prompt, width, height, quality } = params;

  const response = await fetch("https://api.reve.com/v1/image/create", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json", // Retorna JSON com base64
    },
    body: JSON.stringify({
      prompt,
      ...(width && { width }),
      ...(height && { height }),
      ...(quality && { quality }),
    }),
  });

  // Capturar headers de resposta
  const contentViolation = response.headers.get("X-Reve-Content-Violation") === "true";
  const modelVersion = response.headers.get("X-Reve-Version");
  const creditsUsed = parseInt(response.headers.get("X-Reve-Credits-Used") || "0");
  const creditsRemaining = parseInt(response.headers.get("X-Reve-Credits-Remaining") || "0");

  if (!response.ok) {
    const errorCode = response.headers.get("X-Reve-Error-Code");
    const errorText = await response.text();
    throw new Error(`REVE API error [${errorCode}]: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generationTimeMs = Date.now() - startTime;

  return {
    imageBase64: data.image, // A imagem vem em base64 no JSON
    modelUsed: modelVersion || "reve-create",
    generationTimeMs,
    creditsUsed,
    creditsRemaining,
    contentViolation,
  };
}

/**
 * Editar imagem existente usando REVE AI
 */
export async function editImage(params: {
  imageBase64: string;
  prompt: string;
  maskBase64?: string;
}): Promise<ImageGenerationResponse> {
  const startTime = Date.now();
  const apiKey = process.env.REVE_API_KEY;

  if (!apiKey) {
    throw new Error("REVE_API_KEY not configured");
  }

  const { imageBase64, prompt, maskBase64 } = params;

  const response = await fetch("https://api.reve.com/v1/image/edit", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      prompt,
      ...(maskBase64 && { mask: maskBase64 }),
    }),
  });

  const contentViolation = response.headers.get("X-Reve-Content-Violation") === "true";
  const modelVersion = response.headers.get("X-Reve-Version");
  const creditsUsed = parseInt(response.headers.get("X-Reve-Credits-Used") || "0");
  const creditsRemaining = parseInt(response.headers.get("X-Reve-Credits-Remaining") || "0");

  if (!response.ok) {
    const errorCode = response.headers.get("X-Reve-Error-Code");
    const errorText = await response.text();
    throw new Error(`REVE API error [${errorCode}]: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generationTimeMs = Date.now() - startTime;

  return {
    imageBase64: data.image,
    modelUsed: modelVersion || "reve-edit",
    generationTimeMs,
    creditsUsed,
    creditsRemaining,
    contentViolation,
  };
}

/**
 * Remix: combinar prompt com imagem de referência
 */
export async function remixImage(params: {
  imageBase64: string;
  prompt: string;
  strength?: number;
}): Promise<ImageGenerationResponse> {
  const startTime = Date.now();
  const apiKey = process.env.REVE_API_KEY;

  if (!apiKey) {
    throw new Error("REVE_API_KEY not configured");
  }

  const { imageBase64, prompt, strength } = params;

  const response = await fetch("https://api.reve.com/v1/image/remix", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      prompt,
      ...(strength && { strength }),
    }),
  });

  const contentViolation = response.headers.get("X-Reve-Content-Violation") === "true";
  const modelVersion = response.headers.get("X-Reve-Version");
  const creditsUsed = parseInt(response.headers.get("X-Reve-Credits-Used") || "0");
  const creditsRemaining = parseInt(response.headers.get("X-Reve-Credits-Remaining") || "0");

  if (!response.ok) {
    const errorCode = response.headers.get("X-Reve-Error-Code");
    const errorText = await response.text();
    throw new Error(`REVE API error [${errorCode}]: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generationTimeMs = Date.now() - startTime;

  return {
    imageBase64: data.image,
    modelUsed: modelVersion || "reve-remix",
    generationTimeMs,
    creditsUsed,
    creditsRemaining,
    contentViolation,
  };
}

/**
 * Gerar imagem para redes sociais com dimensões otimizadas
 */
export async function generateSocialMediaImage(params: {
  prompt: string;
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "story";
}): Promise<ImageGenerationResponse> {
  const { prompt, platform } = params;

  // Dimensões otimizadas por plataforma
  const dimensions: Record<string, { width: number; height: number }> = {
    instagram: { width: 1080, height: 1080 }, // Post quadrado
    facebook: { width: 1200, height: 630 }, // Post compartilhado
    twitter: { width: 1200, height: 675 }, // Card
    linkedin: { width: 1200, height: 627 }, // Post
    story: { width: 1080, height: 1920 }, // Stories (9:16)
  };

  const { width, height } = dimensions[platform];

  return generateImage({
    prompt,
    width,
    height,
    quality: "hd",
  });
}
