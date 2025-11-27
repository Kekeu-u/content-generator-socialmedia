/**
 * Serviço de geração de imagens usando GPT4Free (g4f.dev)
 * API gratuita com suporte a Pollinations, Flux, DALL-E 3, Stable Diffusion
 */

import {
  generateImage as generateWithReve,
  editImage as editWithReve,
  remixImage as remixWithReve,
  ImageGenerationResponse as ReveImageResponse,
} from "./reve-images";

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
 * Gerar imagem usando GPT4Free (GRÁTIS!)
 */
async function generateWithG4F(
  params: ImageGenerationParams
): Promise<ImageGenerationResponse> {
  const startTime = Date.now();
  const { prompt } = params;

  const model = process.env.G4F_IMAGE_MODEL || "pollinations";

  const response = await fetch("https://g4f.dev/api/v1/images/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      response_format: "url",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GPT4Free API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const generationTimeMs = Date.now() - startTime;

  return {
    imageUrl: data.data[0].url,
    modelUsed: model,
    generationTimeMs,
  };
}

/**
 * Gerar imagem - tenta GPT4Free primeiro (grátis!), depois REVE como fallback
 */
export async function generateImage(
  params: ImageGenerationParams
): Promise<ImageGenerationResponse> {
  // Tentar GPT4Free primeiro (GRÁTIS!)
  try {
    return await generateWithG4F(params);
  } catch (error) {
    console.error("GPT4Free failed, trying REVE fallback:", error);
  }

  // Fallback para REVE (pago)
  if (process.env.REVE_API_KEY) {
    const result = await generateWithReve(params);
    return {
      imageBase64: result.imageBase64,
      modelUsed: result.modelUsed,
      generationTimeMs: result.generationTimeMs,
      creditsUsed: result.creditsUsed,
      creditsRemaining: result.creditsRemaining,
      contentViolation: result.contentViolation,
    };
  }

  throw new Error("No image generation API available");
}

/**
 * Editar imagem (apenas REVE suporta)
 */
export async function editImage(params: {
  imageBase64: string;
  prompt: string;
  maskBase64?: string;
}): Promise<ImageGenerationResponse> {
  if (!process.env.REVE_API_KEY) {
    throw new Error("Image editing requires REVE_API_KEY");
  }

  const result = await editWithReve(params);
  return {
    imageBase64: result.imageBase64,
    modelUsed: result.modelUsed,
    generationTimeMs: result.generationTimeMs,
    creditsUsed: result.creditsUsed,
    creditsRemaining: result.creditsRemaining,
    contentViolation: result.contentViolation,
  };
}

/**
 * Remix (apenas REVE suporta)
 */
export async function remixImage(params: {
  imageBase64: string;
  prompt: string;
  strength?: number;
}): Promise<ImageGenerationResponse> {
  if (!process.env.REVE_API_KEY) {
    throw new Error("Image remix requires REVE_API_KEY");
  }

  const result = await remixWithReve(params);
  return {
    imageBase64: result.imageBase64,
    modelUsed: result.modelUsed,
    generationTimeMs: result.generationTimeMs,
    creditsUsed: result.creditsUsed,
    creditsRemaining: result.creditsRemaining,
    contentViolation: result.contentViolation,
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
